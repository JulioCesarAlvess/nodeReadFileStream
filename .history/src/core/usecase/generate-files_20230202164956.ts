import { createWriteStream } from 'fs';
import { csvFileName } from 'src/core/config/utils';
import { ReadableStream, formatData, transform } from 'src/outbound/Stream';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { stringify } from 'csv-stringify';
import { Transform } from 'stream';

const stringifier = stringify();

@Injectable()
export class GenerateFiles {
  private readonly logger = new Logger(GenerateFiles.name);

  constructor(private eventEmitter: EventEmitter2) {}

  @OnEvent('create.csv')
  async on() {
    console.time('csv');
    this.logger.log('gerando arquivos');

    new ReadableStream()
      .pipe(stringify())
      .pipe(new Transform({ transform }))
      .pipe(createWriteStream(csvFileName))
      .on('finish', () => {
        console.timeEnd('csv');
        this.eventEmitter.emit('create.pdf');
      });
    this.logger.log('arquivos gerados');
  }
}
