import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { createWriteStream, readFileSync } from 'fs';
import { CreateFileEvent } from '../events/create-file.event';

const footerHtml = `
</div>
</body>
</html>
`;

@Injectable()
export class GenerateHtml {
  private readonly logger = new Logger(GenerateHtml.name);

  constructor(private eventEmitter: EventEmitter2) {}

  @OnEvent('finish.txt')
  async on(event: CreateFileEvent) {
    const { account, folderName } = event;

    this.logger.log(`gerando arquivo html para a conta ${account}`);

    const htmlTxtName = `${folderName}/${account}.txt`;
    const htmlName = `${folderName}/${account}.html`;
    const txtFile = readFileSync(htmlTxtName);
    const htmlFile = txtFile.toString().concat(`${footerHtml}`);
    const buffer = Buffer.from(htmlFile);

    const writableHtmlStream = createWriteStream(htmlName);
    writableHtmlStream.write(buffer);
    writableHtmlStream.close();

    this.logger.log(`arquivo html gerado para a conta ${account}`);
    this.eventEmitter.emit('finish.html', {
      account,
      folderName,
    });
  }
}
