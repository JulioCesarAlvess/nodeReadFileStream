import { createReadStream, createWriteStream, readFileSync } from 'fs';
import { pipeline, Transform, Readable } from 'stream';
import { promisify } from 'util';
import { csvFileName, htmlName, htmlTxtName } from '../config/utils';
import { ChunckCounter } from '../entity/chunk-counter';
import { parse } from 'csv-parse';

const chunckCounter = new ChunckCounter();
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

const mapToHtml = new Transform({
  transform(chunk, encoding, cb) {
    const data = chunk.toString();
    const result = `<div><p><span>${data}</span></p></div>\n`;
    cb(null, result);
  },
});

const setHeader = new Transform({
  transform(chunk, encoding, cb) {
    if (chunckCounter.get() > 0) {
      return cb(null, chunk);
    }
    chunckCounter.add();
    cb(null, headerHtml.concat(chunk));
  },
});

export async function createHtml() {
  const readbleStream = createReadStream(csvFileName);
  readbleStream
    .pipe(mapToHtml)
    .pipe(setHeader)
    .pipe(createWriteStream(htmlTxtName))
    .on('finish', () => {
      const txtFile = readFileSync(htmlTxtName);
      const htmlFile = txtFile.toString().concat(footerHtml);
      const buffer = Buffer.from(htmlFile);
      const writableHtmlStream = createWriteStream(htmlName);
      writableHtmlStream.write(buffer);
      writableHtmlStream.close();
    });
}

export class CreateHtml {
  chunckCounter: ChunckCounter;
  mapToHtml: Transform;
  setHeader: Transform;

  constructor() {
    this.chunckCounter = new ChunckCounter();

    // eslint-disable-next-line @typescript-eslint/no-this-alias
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
        cb(null, headerHtml.concat(chunk));
      },
    });
  }

  async create() {
    const readbleStream = createReadStream(csvFileName);
    readbleStream
      .pipe(this.mapToHtml)
      .pipe(this.setHeader)
      .pipe(createWriteStream(htmlTxtName))
      .on('finish', () => {
        const txtFile = readFileSync(htmlTxtName);
        const htmlFile = txtFile.toString().concat(footerHtml);
        const buffer = Buffer.from(htmlFile);
        const writableHtmlStream = createWriteStream(htmlName);
        writableHtmlStream.write(buffer);
        writableHtmlStream.close();
      });
  }
}
