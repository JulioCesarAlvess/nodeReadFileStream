import { unlinkSync } from 'fs';
import { htmlName, htmlTxtName } from '../config/utils';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { CreateHtml } from '../service/create-html';
import { createPdf } from '../service/create-pdf';

@Injectable()
export class GeneratePdf {
  private readonly logger = new Logger(GeneratePdf.name);
  constructor(private eventEmitter: EventEmitter2) {}

  @OnEvent('create.pdf')
  async on() {
    this.logger.log('criando a stream com o csv');

    this.logger.log('iniciando geracao do html');
    await new CreateHtml().create();
    this.logger.log('html gerado');
    this.logger.log('iniciando geracao do pdf');
    await createPdf().then(() => {
      unlinkSync(htmlTxtName);
      unlinkSync(htmlName);
    });
    this.logger.log('pdf gerado');
    this.eventEmitter.emit('create.zip');
  }
}
