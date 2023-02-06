import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { createWriteStream } from 'fs';
import { ReadableStream } from 'src/outbound/Stream';
import { Transform } from 'stream';
import { CreateFileEvent } from '../events/create-file.event';

@Injectable()
export class GenerateCsv {
  private readonly logger = new Logger(GenerateCsv.name);

  constructor(private eventEmitter: EventEmitter2) {}

  @OnEvent('create.csv')
  async on(event: CreateFileEvent) {
    const { account, folderName } = event;
    this.logger.log(`gerando arquivo csv para a conta ${account}`);

    const formatDataCsv = new Transform({
      transform(chunk, encoding, cb) {
        const data = JSON.parse(chunk);
        const result = `${data.id}; ${data.name.toUpperCase()}; ${account} \n`;
        cb(null, result);
      },
    });

    const path = `${folderName}/${account}.csv`;

    new ReadableStream()
      .pipe(formatDataCsv)
      .pipe(createWriteStream(path))
      .on('finish', () => {
        this.logger.log(`arquivo csv gerado para a conta ${event.account}`);
        this.eventEmitter.emit('finish.csv', {
          account,
          folderName,
          fileName: path,
        });
      });
  }
}
