const lighthouse = require('google-lighthouse-puppeteer');

// class LighthouseTests {
//   constructor() {
//     this.pages = {
//       list: ['https://www.fedex.com/'],
//       index: 0
//     };

//     pages = this.pages;

//     console.log(this);
//   }

//   getUrls() {
//     return this.pages.list;
//   }

//   connect(browser) {
//     return new Promise(async (resolve, reject) => {
//       const page = await browser.newPage();
//       await page.goto(this.pages.list[0], { waitUntil: 'load' });
//     //   await clickAccept(page);
//     //   // await page.screenshot({ path: `${process.cwd()}/scripts/lighthouse/performance/viewer/src/reports/home.png` });
//       resolve(browser);
//     });
//   }
// }





const options = {
  main: {
    port: 1337,
    verbose: [true, true],
    max_wait_for_load: 60000
  },
  lighthouse: {
    // params: `--output-path stdout`,
    // lighthouse_params: `--output-path stdout`,
    output: 'json',
    params: '',
    lighthouse_params: '--max-wait-for-load 40000',
    output_directory: '../reports',
    html: true,
    max_wait_for_load: 60000
  },
  chromium: '--no-sandbox --disable-setuid-sandbox --ssl-version-max=tls1.1',
  _unknown: ['--puppeteer-ignoreHTTPSErrors', '--puppeteer-slowMo', '20']
};

// const lighthouseExecutionModule = require('./lighthouse');
// const cli = require('child_process').execSync;
// const fs = require('fs');
// let copied = 0;

// const tryCatch = (tryFunction, catchValue) => {
//   let result;
//   try {
//     result = tryFunction();
//   } catch(err) {
//     result = catchValue;
//   }
//   return result;
// };

const runPerfTest = () => {
  lighthouse
    .exec(`${process.cwd()}/lighthouse.js`, options)
    .then((data) => {
      console.warn('!!!!!!!!!!!!!');
      console.warn(data);
      resolve(data);
      // const tempFolder = fs.readdirSync(`${process.cwd()}/viewer/src/reports_temp`, { encoding: 'utf8' });
      // const summary = tryCatch(() => {
      //   const data = fs.readFileSync(`${process.cwd()}/viewer/src/reports/summary.json`, { encoding: 'utf8' });
      //   return JSON.parse(data);
      // }, []).filter(item => !item.error);
      // const allFiles = tempFolder.map(file => new Promise((resolve) => {
      //   if (file === 'summary.json') {
      //     fs.readFile(`${process.cwd()}/viewer/src/reports_temp/summary.json`, { encoding: 'utf8' }, (err, newSummary) => {
      //       const updatedSummary = [...summary, ...JSON.parse(newSummary)];
      //       fs.writeFile(`${process.cwd()}/viewer/src/reports/summary.json`, JSON.stringify(updatedSummary), { encoding: 'utf8' }, () => resolve(file));
      //     });
      //   } else {
      //     fs.copyFile(`${process.cwd()}/viewer/src/reports_temp/${file}`, `${process.cwd()}/viewer/src/reports/${file}`, () => {
      //       if (file.indexOf('.json') > -1) {
      //         copied += 1;
      //       }
      //       resolve(file);
      //     });
      //   }
      }).catch((err) => {
        console.log('--------------------------');
        console.log(err);
      });
};

// process.stdout.on('data', (...args) => {
//   console.log('1????????????????????????????????');
//   console.log(args);
// });
// process.on('stdout', (...args) => {
//   console.log('2????????????????????????????????');
//   console.log(args);
// })
// cli(`rm -rf ${process.cwd()}/viewer/src/reports/*`);
// cli(`rm -rf ${process.cwd()}/viewer/src/reports_temp/*`);
runPerfTest();