let pages;

class LighthouseTests {
    constructor() {
      this.pages = {
        list: ['https://www.fedex.com/'],
        index: 0
      };

      pages = this.pages;
    }
  
    getUrls() {
      return pages.list;
    }
  
    connect (browser) {
      return new Promise(async (resolve, reject) => {
        const page = await browser.newPage();
        console.warn(
            '*******************\n',
            typeof page.goto,
        );
        await page.goto(pages.list[0], { waitUntil: 'load' });
        
      //   await clickAccept(page);
      //   // await page.screenshot({ path: `${process.cwd()}/scripts/lighthouse/performance/viewer/src/reports/home.png` });
        resolve(browser);
      });
    }
  }

  module.exports = new LighthouseTests();
