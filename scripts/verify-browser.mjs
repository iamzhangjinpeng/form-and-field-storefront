import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const origin = process.env.TEST_URL || 'http://127.0.0.1:3006';
const output = new URL('../docs/images/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
    : {}),
});
const context = await browser.newContext({ viewport: { width: 1440, height: 1050 } });
const page = await context.newPage();
page.setDefaultTimeout(15000);
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
const visit = async (path) => {
  const response = await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200, `${path} must load`);
};
const fits = async () =>
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    true,
    'Page must fit viewport',
  );
const shot = async (name) => {
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = 'eager';
    await Promise.all(Array.from(document.images).map((img) => img.decode().catch(() => {})));
  });
  assert.equal(
    await page
      .locator('img')
      .evaluateAll((images) => images.every((img) => img.complete && img.naturalWidth > 0)),
    true,
    'All page images must load',
  );
  await page.screenshot({ path: new URL(name, output).pathname, fullPage: true });
};
try {
  await visit('/');
  await fits();
  await shot('home-desktop.png');
  assert.equal(
    (await page.locator('h1').innerText()).replace(/\s+/g, ' '),
    'A little less. A little more home.',
  );
  await visit('/products');
  assert.equal(await page.locator('.product-card').count(), 8);
  await page.getByRole('button', { name: 'Furniture', exact: true }).click();
  assert.equal(await page.locator('.product-card').count(), 2);
  await page.getByRole('button', { name: 'All objects', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Search products' }).fill('vase');
  assert.equal(await page.locator('.product-card').count(), 1);
  await page.getByRole('searchbox', { name: 'Search products' }).fill('no-match-at-all');
  await page.getByRole('heading', { name: 'No little treasures here.' }).waitFor();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await page.getByRole('combobox', { name: 'Sort products' }).selectOption('low');
  assert.equal(await page.locator('.product-card h3').first().innerText(), 'Ritual Stoneware Cup');
  await page.getByRole('combobox', { name: 'Sort products' }).selectOption('featured');
  await shot('collection.png');
  await visit('/products/forma-vase');
  await page.getByRole('button', { name: 'Terracotta', exact: true }).click();
  await page.getByRole('button', { name: 'Large', exact: true }).click();
  await page.getByRole('button', { name: 'Increase quantity', exact: true }).click();
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await shot('product.png');
  await visit('/cart');
  assert.match(await page.locator('.cart-line-copy').innerText(), /Terracotta \/ Large/);
  assert.equal(await page.locator('.quantity>span').innerText(), '2');
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('.quantity>span').innerText(), '2');
  await page.getByRole('button', { name: 'Increase quantity of Forma Ceramic Vase' }).click();
  await shot('bag.png');
  assert.match(await page.locator('.summary-total').innerText(), /156\.00/);
  await visit('/checkout');
  await page.getByLabel('Email address').fill('alex.demo@example.com');
  await page.getByLabel('First name').fill('Alex');
  await page.getByLabel('Last name').fill('Demo');
  await page.getByLabel('Address', { exact: true }).fill('123 Example Street');
  await page.getByLabel('City', { exact: true }).fill('Portland');
  await page.getByLabel('State / province / region').fill('OR');
  await page.getByLabel('ZIP / postal code').fill('97201');
  await shot('checkout.png');
  await page.getByRole('button', { name: 'Place demo order' }).click();
  await page.getByRole('heading', { name: /A little lovely/ }).waitFor();
  await shot('success.png');
  assert.match(await page.locator('.receipt-status').innerText(), /Demo confirmed/);
  assert.equal(await page.locator('.bag-count').innerText(), '0');
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: /A little lovely/ }).waitFor();
  await visit('/products/ritual-cup');
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await visit('/success?demo=true');
  await page.getByRole('heading', { name: /A little lovely/ }).waitFor();
  assert.equal(
    await page.locator('.bag-count').innerText(),
    '1',
    'Reopening old success must not clear a new bag',
  );
  await visit('/cart');
  await page.getByRole('button', { name: 'Remove Ritual Stoneware Cup' }).click();
  await page.getByRole('heading', { name: 'Your bag is taking a breather.' }).waitFor();
  await visit('/success');
  await page.getByRole('heading', { name: 'No confirmed order yet.' }).waitFor();
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of ['/', '/products', '/products/arc-lounge-chair', '/cart']) {
      await visit(path);
      await fits();
      if (width === 390 && path === '/') await shot('home-mobile.png');
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await visit('/products/forma-vase');
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await visit('/cart');
  await fits();
  await visit('/checkout');
  await fits();
  await shot('checkout-mobile.png');
  await page.setViewportSize({ width: 320, height: 844 });
  await fits();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).waitFor();
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Shop the collection' })
    .click();
  assert.equal(await page.getByRole('navigation', { name: 'Mobile navigation' }).count(), 0);
  await page.getByRole('button', { name: 'Shipping & delivery' }).click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(), 0);
  assert.deepEqual(errors, [], 'No browser runtime errors');
  console.log(
    'PASS: catalog, search, variants, persistent bag, totals, demo checkout, success verification, mobile layouts, navigation, policies, and no browser errors.',
  );
} finally {
  await browser.close();
}
