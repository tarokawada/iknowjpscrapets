const puppeteer = require("puppeteer");
const fs = require("fs");

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
      await page.waitForSelector(".cue");

      let data = await page.evaluate(() => {
        let cueResponses = Array.from(
          document.querySelectorAll(".cue-response")
        ).map(cueResponse => {
          let cue = cueResponse.getElementsByClassName("cue")[0].innerHTML;
          let meaning = cueResponse
            .getElementsByClassName("response")[0]
            .innerHTML.split(",");
          let transliteration = cueResponse.getElementsByClassName(
            "transliteration"
          );
          if (transliteration.length) {
            let text = transliteration[0].innerHTML;
            let hiragana = text.match(/([ぁ-んァ-ン])/g);

            return {
              vocab: cue,
              hiragana: hiragana ? hiragana.join("") : hiragana,
              meaning
            };
          }
          return { vocab: cue, hiragana: cue, meaning };
        });

        return cueResponses;
      });
      fs.writeFile(
        "./json/teams.json",
        JSON.stringify(data, null, 2),
        (err: any) =>
          err
            ? console.error("Data not written", err)
            : console.log("Data written")
      );
      await browser.close();
    });
  }
}

const nihongo = new Spoodermon("https://iknow.jp/courses/566921", "page1");

nihongo.crawl();
