import { Browser, launch, PaperFormat } from 'puppeteer';

/* class BrowserService {
  private browser: Browser;
  public static instance: BrowserService | null = null;

  public static async getInstance(): Promise<Browser> {
    console.log('tentou pegar a instancia ');
    this.instance = new BrowserService();
    await this.instance.initialize();

    return this.instance.browser;
  }

  public async initialize(): Promise<void> {
    this.browser = await launch({
      args: [
        '--no-sandbox',
        '--headless',
        '--disable-gpu',
        '--disable-dev-shm-usage',
      ],
    });
  }
} */

export async function createPdf(htmlName: string, folderName: string) {
  //const browser = await BrowserService.getInstance();
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

  const url = `file://${process.cwd()}\\${htmlName}`;
  console.log('teste url ', url);
  await page.goto(url);

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

  return {
    pdfStream,
    page,
    browser,
  };
}
