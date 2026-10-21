import { test } from 'node:test';
import assert from 'node:assert/strict';
import { products } from '../lib/products';
import {
  catalog,
  shippingCost,
  subtotalFor,
  validateCheckout,
} from '../supabase/functions/_shared/commerce';

test('Supabase payment catalog mirrors the storefront product ids and prices', () => {
  assert.deepEqual(
    catalog.map(({ id, price }) => [id, price]),
    products.map(({ id, price }) => [id, price]),
  );
});

test('server checkout validation owns prices and shipping', () => {
  const checkout = validateCheckout({
    lines: [{ productId: 'forma-vase', color: 'Chalk', size: 'Small', quantity: 2 }],
    email: 'demo@example.com',
    firstName: 'Alex',
    lastName: 'Demo',
    address: '123 Example Street',
    apartment: '',
    city: 'Portland',
    region: 'OR',
    postal: '97201',
    country: 'US',
    price: 1,
  });
  assert.equal(subtotalFor(checkout.lines), 9600);
  assert.equal(shippingCost(9600), 1200);
  assert.equal(shippingCost(15000), 0);
});

test('checkout rejects invalid variants, excess quantities and invalid email addresses', () => {
  const valid = {
    lines: [{ productId: 'forma-vase', color: 'Chalk', size: 'Small', quantity: 1 }],
    email: 'demo@example.com',
    firstName: 'Alex',
    lastName: 'Demo',
    address: '123 Example Street',
    city: 'Portland',
    region: 'OR',
    postal: '97201',
    country: 'US',
  };
  assert.throws(() => validateCheckout({ ...valid, email: 'not-an-email' }));
  assert.throws(() =>
    validateCheckout({ ...valid, lines: [{ ...valid.lines[0], color: 'Gold' }] }),
  );
  assert.throws(() => validateCheckout({ ...valid, lines: [{ ...valid.lines[0], quantity: 11 }] }));
});
