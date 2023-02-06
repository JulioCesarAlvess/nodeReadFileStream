import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { createReadStream, createWriteStream } from 'fs';
import { Transform } from 'stream';
import { ChunckCounter } from '../entity/chunk-counter';
import { CreateFileEvent } from '../events/create-file.event';

const headerHtml = `
<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link
      href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700"
      rel="stylesheet"
    />
    <title>Document</title>
    <link
      href="https://unpkg.com/tailwindcss@^2.0/dist/tailwind.min.css"
      rel="stylesheet"
    />
    <style type="text/css">
      * {
        font-family: "Open Sans";
      }
      body {
        margin: 0;
        max-width: 8.2677in;
      }
    </style>
  </head>
  <body>
    <h1>Title Test</h1>
    <p>Test body</p>
    <div class="p-4 pr-2.5 border-b-2 border-underline-color">
`;

const footerHtml = `
</div>
</body>
</html>
`;

@Injectable()
export class GenerateHtmlTxt {
  chunckCounter: ChunckCounter;
  mapToHtml: Transform;
  setHeader: Transform;
  private readonly logger = new Logger(GenerateHtmlTxt.name);

  constructor(private eventEmitter: EventEmitter2) {
    this.chunckCounter = new ChunckCounter();

    const _this = this;

    this.mapToHtml = new Transform({
      transform(chunk, encoding, cb) {
        const data = chunk.toString();
        const result = `<div><p><span>${data}</span></p></div>\n`;
        cb(null, result);
      },
    });

    this.setHeader = new Transform({
      transform(chunk, encoding, cb) {
        if (_this.chunckCounter.get() > 0) {
          return cb(null, chunk);
        }
        _this.chunckCounter.add();
        cb(null, `${headerHtml}`.concat(chunk));
      },
    });
  }

  @OnEvent('finish.csv')
  async on(event: CreateFileEvent) {
    const { account, folderName } = event;
    this.logger.log(`gerando arquivo txt para o pdf para a conta ${account}`);
    const csvFilename = `${folderName}/${account}.csv`;
    const readbleStream = createReadStream(csvFilename);
    const htmlTxtName = `${folderName}/${account}.txt`;

    readbleStream
      .pipe(this.mapToHtml)
      .pipe(this.setHeader)
      .pipe(createWriteStream(htmlTxtName))
      .on('finish', () => {
        this.logger.log(
          `arquivo txt para a conta ${account} criado com sucesso`,
        );
        this.eventEmitter.emit('finish.txt', {
          account,
          folderName,
        });
      });
  }
}
