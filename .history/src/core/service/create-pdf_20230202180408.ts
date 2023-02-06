import { Browser, launch, PaperFormat } from 'puppeteer';
import { createWriteStream, readFileSync, writeFile, writeFileSync } from 'fs';
import { htmlName, pdfFileName } from '../config/utils';

class BrowserService {
  private browser: Browser;
  public static instance: BrowserService | null = null;

  public static async getInstance(): Promise<Browser> {
    if (this.instance == null) {
      this.instance = new BrowserService();
      await this.instance.initialize();
    }

    return this.instance.browser;
  }

  public async initialize(): Promise<void> {
    this.browser = await launch();
  }
}

export async function createPdf() {
  const browser = await BrowserService.getInstance();
  const page = await browser.newPage();
  await page.setViewport({
    width: 794,
    height: 1122,
    deviceScaleFactor: 2,
  });

  const url = `file://${process.cwd()}/${htmlName}`;
  await page.goto(url);

  // const htmlFile = readFileSync(htmlName);
  // console.log('TAMANHO ARQUIVO: ', htmlFile.toString().length);
  // await page.setContent(htmlFile.toString(), {
  //   waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
  //   timeout: 0,
  // });
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

  const pdf = await page.pdf(options);
  writeFileSync(pdfFileName, pdf);

  await page.close();
  // await browser.close();

  // const pdfStream = await page.createPDFStream(options);

  // pdfStream.pipe(createWriteStream(pdfFileName)).on('finish', async () => {
  //   console.log('END STREAM BEFORE');

  //   await page.close();
  //   await browser.close();

  //   console.log('END STREAM AFTER');
  // });
}
