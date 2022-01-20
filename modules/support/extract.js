const fs = require('fs');
const puppeteer = require('puppeteer');
const debug = require('debug')('app:extract');

async function extract(url, name, count, cookies, newCookies) {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-gpu',
    ],
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4796.0 Safari/537.36');

  if (Array.isArray(cookies) && cookies.length) {
    debug('setting cookies');
    await page.setCookie(...cookies);
  }

  debug(url);

  let html;

  try {
    await page.goto(url);
    html = await page.content();
  } catch (error) {
    debug(error);
  }

  fs.writeFileSync(`./public/${count}-${name}.html`, html);
  await page.screenshot({ path: `./public/${count}-${name}.png` });
  debug(`screenshot:${count}-${name}.png`);

  if (newCookies) {
    const response = await page.cookies();
    debug(`new-cookies:${!!response}`);
    fs.writeFileSync('./data/cookies.json', JSON.stringify(response));
  }

  await browser.close();

  return html;
}

async function getPage() {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-gpu',
    ],
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4796.0 Safari/537.36');

  return { browser, page };
}

async function getHTML(page, url) {
  debug(url);

  let html;

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    html = await page.content();
  } catch (error) {
    debug(error);
  }

  return html;
}

async function printScreen(page, html, count, name) {
  fs.writeFileSync(`./public/${count}-${name}.html`, html);

  await page.screenshot({ path: `./public/${count}-${name}.png` });

  debug(`screenshot:${count}-${name}.png`);
}

async function closeBrowser(browser) {
  await browser.close();
}

module.exports = extract;
module.exports.getPage = getPage;
module.exports.getHTML = getHTML;
module.exports.closeBrowser = closeBrowser;
module.exports.printScreen = printScreen;
