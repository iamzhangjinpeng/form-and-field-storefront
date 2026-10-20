import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateLines, subtotalFor } from '../lib/order';
import { validateCheckout } from '../lib/checkout';
import { shippingCost, products } from '../lib/products';
const line = { productId: 'forma-vase', color: 'Chalk', size: 'Small', quantity: 2 };
test('server totals use catalog prices and ignore client-supplied prices', () => {
  const lines = validateLines([{ ...line, price: 1 }]);
  assert.equal(subtotalFor(lines), 9600);
  assert.equal(shippingCost(14999), 1200);
  assert.equal(shippingCost(15000), 0);
});
test('invalid products, variants, quantities and duplicate lines are rejected', () => {
  for (const bad of [
    { ...line, productId: 'unknown' },
    { ...line, color: 'Pink' },
    { ...line, size: 'XL' },
    { ...line, quantity: 0 },
    { ...line, quantity: 11 },
    { ...line, quantity: 1.5 },
    { ...line, quantity: '2' },
  ])
    assert.throws(() => validateLines([bad]));
  assert.throws(() => validateLines([]));
  assert.throws(() => validateLines([line, line]));
  assert.throws(() => validateLines([null]));
});
test('checkout validates required shipping details and supported countries', () => {
  const body = {
    lines: [line],
    email: 'demo@example.com',
    firstName: 'Alex',
    lastName: 'Demo',
    address: '123 Example Street',
    city: 'Portland',
    region: 'OR',
    postal: '97201',
    country: 'US',
  };
  assert.equal(validateCheckout(body).apartment, '');
  assert.throws(() => validateCheckout({ ...body, email: 'bad' }));
  assert.throws(() => validateCheckout({ ...body, address: ' ' }));
  assert.throws(() => validateCheckout({ ...body, country: 'XX' }));
});
test('the complete eight-product catalog has unique identifiers and valid variants', () => {
  assert.equal(products.length, 8);
  assert.equal(new Set(products.map((p) => p.id)).size, 8);
  for (const p of products) {
    assert.ok(p.price > 0 && Number.isInteger(p.price));
    assert.ok(p.colors.length && p.sizes.length);
    assert.equal(
      validateLines([{ productId: p.id, color: p.colors[0], size: p.sizes[0], quantity: 1 }])
        .length,
      1,
    );
  }
});
