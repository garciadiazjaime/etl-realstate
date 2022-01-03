const puppeteer = require('puppeteer');
const debug = require('debug')('app:extract');

async function extract(url, name) {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-gpu',
    ],
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4796.0 Safari/537.36');

  debug(url);

  try {
    await page.goto(url);
  } catch (error) {
    await page.screenshot({ path: `./public/${name}` });
    return debug(error);
  }

  const html = await page.content();

  await browser.close();

  return html;
}

module.exports = extract;
