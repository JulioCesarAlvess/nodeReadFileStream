import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import * as archiver from 'archiver';
import { createReadStream, createWriteStream, readdirSync } from 'fs';
import { CreateFileEvent } from '../events/create-file.event';
import { removeSync } from 'fs-extra';

@Injectable()
export class GenerateZip {
  private readonly logger = new Logger(GenerateZip.name);
  @OnEvent('create.zip')
  async on(event: CreateFileEvent) {
    const { folderName } = event;
    this.logger.log('iniciando geracao do zip');

    const output = createWriteStream(`${folderName}.zip`);
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    //transformar esse cara num useCase que espera um evento
    this.logger.log(`listando os arquivos da pasta ${folderName}`);

    const files = readdirSync(folderName);
    files.forEach((fileName) => {
      if (fileName.includes('csv') || fileName.includes('pdf')) {
        console.log(`arquivo: ${fileName}`);
        archive.append(createReadStream(`${folderName}\\${fileName}`), {
          name: fileName,
        });
      }
    });

    archive.pipe(output);
    archive.finalize().then(() => {
      this.logger.log('zip gerado');
      this.logger.log(`apagando a pasta ${folderName}`);
      removeSync(folderName);
    });
  }
}
