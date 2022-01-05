const puppeteer = require('puppeteer');
const debug = require('debug')('app:extract');

async function extract(url, name, count) {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-gpu',
    ],
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4796.0 Safari/537.36');

  debug(url);

  let html;

  try {
    await page.goto(url);
    html = await page.content();
  } catch (error) {
    debug(error);
  }

  await page.screenshot({ path: `./public/${count}-${name}.png` });
  debug(`screenshot:${count}-${name}.png`);

  await browser.close();

  return html;
}

module.exports = extract;
