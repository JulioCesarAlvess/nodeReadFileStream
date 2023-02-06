import { launch, PaperFormat } from 'puppeteer';
import { createWriteStream, readFileSync } from 'fs';
import { htmlName, pdfFileName } from '../config/utils';

export async function createPdf() {
  const browser = await launch({
    args: [
      '--no-sandbox',
      '--headless',
      '--disable-gpu',
      '--disable-dev-shm-usage',
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 794,
    height: 1122,
    deviceScaleFactor: 2,
  });

  // const url = `file://${process.cwd()}/${htmlName}`;
  // await page.goto(url);

  const htmlFile = readFileSync(htmlName);
  console.log('TAMANHO ARQUIVO: ', htmlFile.toString().length);
  await page.setContent(htmlFile.toString(), {
    waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
    timeout: 0,
  });
  const format: PaperFormat = 'A4';
  const options = {
    format,
    margin: {
      top: '20px',
      left: '20px',
      right: '20px',
      bottom: '20px',
    },
  };
  const pdfStream = await page.createPDFStream(options);

  pdfStream.pipe(createWriteStream(pdfFileName)).on('finish', async () => {
    console.log('END STREAM BEFORE');

    await page.close();
    await browser.close();

    console.log('END STREAM AFTER');
  });
}
