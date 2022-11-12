const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const {URL} = require('url');
const { PerformanceObserver, performance } = require('node:perf_hooks');

const { generateReport, generatePage } = require('./report');
const urls = require('./test-cases');

const allTests = [];

const observer = new PerformanceObserver((items) => {
  const targetEntry = items.getEntries().find(entry => entry.name === 'Total running time for all Lighthouse tests');

  if (targetEntry?.name === 'Total running time for all Lighthouse tests') {
    generateReport(allTests, Math.round(targetEntry.duration));
    performance.clearMarks();  
  }
});

observer.observe({ type: 'measure' });
 const myMark = performance.mark('allTests');


const runAllTests = async (browser, index, allUrls) => {
  const url = allUrls.shift();
  console.warn(url);

  const data = await lighthouse(url, {
    port: (new URL(browser.wsEndpoint())).port,
    output: 'html',
    logLevel: 'info',
    defaultProtocolTimeout: 90000,
    chromeFlags: ['--headless'],
  });

  allTests.push(data.lhr);

  if (allUrls.length) {
    generatePage(data.lhr, index).then(() => {
      runAllTests(browser, index + 1, allUrls);
    });
  } else {
    generatePage(data.lhr, index).then(async () => {
      await browser.close();
      performance.measure('Total running time for all Lighthouse tests', myMark);
    });
  }

}

const runTests = async (allUrls) => {

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    chromeFlags: ['--headless'],
  });
  runAllTests(browser, 0, allUrls);
};

runTests([...urls]);
