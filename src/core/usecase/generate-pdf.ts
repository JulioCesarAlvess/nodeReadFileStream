import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { createWriteStream } from 'fs';
import { CreateFileEvent } from '../events/create-file.event';
import { createPdf } from '../service/create-pdf';

@Injectable()
export class GeneratePdf {
  private readonly logger = new Logger(GeneratePdf.name);
  constructor(private eventEmitter: EventEmitter2) {}

  @OnEvent('finish.html')
  async on(event: CreateFileEvent) {
    const { account, folderName } = event;
    const htmlName = `${folderName}/${account}.html`;

    this.logger.log('iniciando geracao do pdf');
    const { pdfStream, page, browser } = await createPdf(htmlName, folderName);

    const path = `${folderName}/${account}.pdf`;

    pdfStream.pipe(createWriteStream(path)).on('finish', async () => {
      /* await page.close().then(async () => { */
      await browser.close().then(() => {
        console.log(`arquivo pdf gerado para a conta ${event.account}`);
        this.eventEmitter.emit('finish.pdf', {
          account,
          folderName,
        });
        /*  }); */
      });
    });
  }
}
