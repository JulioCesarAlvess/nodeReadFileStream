import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { existsSync, mkdirSync } from 'fs';
import { FileFactory } from '../factory/file-factory';

@Injectable()
export class GenerateFiles {
  private readonly logger = new Logger(GenerateFiles.name);
  constructor(private eventEmitter: EventEmitter2) {}

  async execute(accounts: string[]) {
    this.logger.log(`gerando arquivo para as contas ${accounts}`);
    const folderName = `${new Date().getTime()}`;

    this.logger.log(`criando a pasta ${folderName}`);
    if (!existsSync(folderName)) {
      mkdirSync(folderName);
    }

    const factory = new FileFactory(accounts, this.eventEmitter);
    factory.init(folderName);
  }
}
