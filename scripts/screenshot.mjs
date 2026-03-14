import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

await page.setViewport({ width: 1480, height: 100, deviceScaleFactor: 2 });
await page.goto('http://localhost:5174/infographic.html', { waitUntil: 'networkidle0' });

// Hide footer links for screenshot
await page.evaluate(() => {
  document.querySelector('.footer-links')?.remove();
});

// Get full page height
const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
await page.setViewport({ width: 1480, height: bodyHeight, deviceScaleFactor: 2 });

await page.screenshot({
  path: 'public/infographic.png',
  fullPage: true,
  omitBackground: false,
});

console.log(`Screenshot saved (900x${bodyHeight} @2x)`);
await browser.close();
