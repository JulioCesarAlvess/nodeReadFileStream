import { createWriteStream } from 'fs';
import { csvFileName } from 'src/core/config/utils';
import { readbleStream, formatData } from 'src/outbound/Stream';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { stringify } from 'csv-stringify';

const stringifier = stringify();

@Injectable()
export class GenerateFiles {
  private readonly logger = new Logger(GenerateFiles.name);

  constructor(private eventEmitter: EventEmitter2) {}

  @OnEvent('create.csv')
  async on() {
    this.logger.log('gerando arquivos');

    readbleStream
      .pipe(stringifier)
      .pipe(formatData)
      .pipe(createWriteStream(csvFileName))
      .on('finish', () => {
        this.eventEmitter.emit('create.pdf');
      });
    this.logger.log('arquivos gerados');
  }
}
