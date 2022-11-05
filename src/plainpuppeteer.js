const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const {URL} = require('url');

const { generateReport } = require('./report');
const urls = require('./test-cases');

const allTests = [];

const runTests = async (allUrls) => {
  const url = allUrls.shift();
  console.warn(url);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    chromeFlags: ['--headless'],
  });

  const data = await lighthouse(url, {
    port: (new URL(browser.wsEndpoint())).port,
    output: 'html',
    logLevel: 'info',
    defaultProtocolTimeout: 90000,
    chromeFlags: ['--headless'],
  });

  allTests.push(data.lhr);

  await browser.close();

  if (allUrls.length) {
    runTests(allUrls);
  } else {
    generateReport(allTests, true);
  }

};

runTests([...urls]);
//  let text = `<!--
// @license
// Copyright 2018 The Lighthouse Authors. All Rights Reserved.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// -->
// <!doctype html>
// <html lang="en">
// <head>
//   <meta charset="utf-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">
//   <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEhklEQVR4AWJxL/BhIAesev1U5tcflpncgNrKIsqNIwzC9feMpDUzs70kOczMzMzJJcxwCTMzncPMnOwtzBwzMzPb0vRfeZPp0VhPS5I39V5fdiXV1/VD+9QC7OVn9BsyH1XIoEI1PfmJvLFowVV564+34DFUHudbmfDh4kVXh//7XwE+WjS/YfXZe3yr4j2rqj1AIhSB7hZ8ZtPZu/zw8cK523U4wE1/rvPfWrz4zs0m9ZdC9yUJAlASdBAgocRegfF/f3/h/PuaFsxMdwjAR0vm1+06eMMfIrhLqTWqdH4EumU2SPfMhigJAlRQbZrgrRsl9U+Y2DYDFCz3ILC9kiAiqSrMwbWT0nceEnR+9Kggc2zjOJCASDENkg0a5HfZZgDP81CM3CrQs2Z1+o7DJ6ePr8sK0AOCHv5Jjdt3evyYSaZ351VIStIxPRAUtrBYbxC6w+BZ0ivVSBKkIhJhemSyZpfB00EiPO2VjzYkxhcqXQqCWCShGplvi3y0QxqbuBurMjyJeWnkHZuAEgIQGsUBqwrfjZ+IlBgKyRJzVVYF8O6qFWdh86YzQzMrZigYmxAyfvHgLZQ/LC1CbeniW2Hkqr/PH16SgvGuf2/uzNMBwJA/njxizGPtSyAf7EziJCMGRDRdhoAC4PL1A/SrKQMAAQkEfpJAcRQdrBJ7gNwjSpJsdwK+CANBkqa1LgQB4IicV9nYUct7gaxuDJUErQIiEAiMxLVOFlKzIktPpT0ggpdpC/8YAHnxbgkUY4tAAFSR7AAXNyAAWHJrA/kHGjzg5nleuwFO7Nd/IoDw4Pm58+4jNLmYG0wRA5bErc2Mr3Y+dXTDW1VvwqbJkzMCHQ4S1GTCBOIgUHJrGdEwqzR+jAp/o2qAZelUDoQnruEEdDclJI6576AlNVfc+22XN/+Y1vnJD0Yind6UpEEvn/Hqq15EYjCW7jZCJEpnNvDgkyelDjs106kuux2AAXCSobULOWP8mLhYlpoDMK4qAFXJGk+grtH8YXVz5KJblqaG1+VUdTc0I290bmUQAriGITRbdQnom0aoFj8kx1+wMD2ifncAXUQE4SkDqN1hE0jEophs1SUwZAOhUAiMCLwRtamtTZtbbmZErSAUHbSysaoEmnrsakiMiUAURi283gN6wans9oX8rOCrj7/JP35DFD+iQ7Au/K2KE1jzx6ujjUnXFH9KjEq6ZlhsTBICrNLJf47Pv/pkHzvup1w4dmUbEei0+bcXRqJuh5kVARQ8byyYxOwNGr7A87xh1tp8sGT+uMInrwi++Xj7TQz2d27NvwEkrOflAFQGIDA5khASBCGdO2/Z/MnLPwYfv5TFhjW7QhVKAB6afwe2LpFlFsCnlQEosgQgDsdOG1/LKeNqJS4JCSPJ/i+TakwEARor7gER1Iva5JmPOJK0RUqmoPnnlzFCtmIAhAAQEIQRgDaiYPIauNXcnDlRIrWNFY3hm7PG9YRqr7IV7HrCgAC17befjEvRq2nGhAHtBqDpOuI/I1diUUAMYIxEdyejBJqLnNoszGZtfiX/CztGv2mq+sdaAAAAAElFTkSuQmCC">
//   <title>Lighthouse Report</title>
//   <style>body {margin: 0}</style>
// </head>
// <body>
//   <noscript>Lighthouse report requires JavaScript. Please enable.</noscript>

//   <div id="lh-log"></div>
// `;
// console.warn(text.replace(/((\<\!\-\-)(\S|\s){1,}(\-\-\>))|(\r|\t|\n){1,}/gm, ''))





// const puppeteer = require('puppeteer');
// const lighthouse = require('lighthouse');
// const {URL} = require('url');

// const { generateReport } = require('./report');
// const urls = require('./test-cases');

// (async () => {

//   const allTests = urls.map(async (url) => {
//     let browser;

//     try {
//       console.warn(
//         '1**************************************************************************\n**************************************************************************\n',
//         url,
//       );
//       browser = await puppeteer.launch({
//         headless: false,
//         defaultViewport: null,
//       });
      
//       console.warn(
//         '2**************************************************************************\n**************************************************************************\n',
//         (new URL(browser.wsEndpoint())).port,
//       );

//       const data = await lighthouse(url, {
//         port: (new URL(browser.wsEndpoint())).port,
//         output: 'html',
//         logLevel: 'info',
//       });

//       console.warn(
//         '3**************************************************************************\n**************************************************************************\n',
//       );

//       await browser.close();

//       return Promise.resolve(data.lhr);
//     } catch(error) {
//       return Promise.reject({ browser, error });
//     }
//   });

//   Promise.all(allTests).then((allResults) => {
//     generateReport(allResults, true);
//   }).catch(async ({ browser, error }) => {
//     await browser.close();
//     console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n', error);
//   });

// })();