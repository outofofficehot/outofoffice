import puppeteer from 'puppeteer';

const url = process.argv[2] || 'http://localhost:5173';
const output = process.argv[3] || 'screenshot.png';

async function takeScreenshot() {
  console.log(`Taking screenshot of ${url}...`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  
  // Wait a bit for animations
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: output, fullPage: true });
  console.log(`Screenshot saved to ${output}`);
  
  await browser.close();
}

takeScreenshot().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
