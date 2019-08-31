const puppeteer = require("puppeteer");

class Spoodermon {
  private baseUrl: string;
  private outputName: string;

  constructor(baseUrl: string, outputName: string) {
    this.baseUrl = baseUrl;
    this.outputName = outputName;
  }

  crawl() {
    puppeteer.launch().then(async (browser: any) => {
      const page = await browser.newPage();
      await page.goto(this.baseUrl);
      await page.screenshot({ path: `${this.outputName}.png` });
      await browser.close();
    });
  }
}

const nihongo = new Spoodermon("https://iknow.jp/courses/566921", "page1");

nihongo.crawl();
