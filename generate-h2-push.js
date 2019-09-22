#!/usr/bin/env node
const puppeteer = require('puppeteer');
const args = process.argv.slice(2);
const host = args[0] || 'http://127.0.0.1:8080';
const indexMatches = [
  '.gz',
  '.map',
  '3rdpartylicenses.txt',
  'ngsw-manifest.json',
  'ngsw.json',
  'worker-basic.min.js',
  'ngsw-worker.js',
  'favicon',
  'index.html',
  'manifest.webmanifest',
  '.svg'
];
async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page._client.send('ServiceWorker.disable')

  page.on('console', msg => console.log(msg.text()));

  console.log('Page: loaded');
  await page.goto(host);

  const allRequests = new Map();
  page.on('request', req => {
    allRequests.set(req.url(), req);
  });

  await page.reload({ waitUntil: 'networkidle2' });

  Array.from(allRequests.values()).forEach(req => {
    const url = req.url();

    // filter out urls that match these extensions
    for (const exlude of indexMatches) {
      if (url.indexOf(exlude) != -1) return false;
    }

    // if external, dont worry about it for now
    //
    const origin = new URL(host);

    if (url.indexOf(origin.origin) === -1) return false;

    // Format the url to remove the host
    const formatted = url.replace(`${origin.origin}/`, '');

    if (origin.pathname.includes(formatted)) return false;

    // if it's an empty string, just ignore it
    if (!formatted) return false;

    let type = url.substr(-3) == 'css' ? 'style' : 'script';
    results += `</${formatted}>;rel=preload;as=${type},`;

  });
  await browser.close();
}


main();
