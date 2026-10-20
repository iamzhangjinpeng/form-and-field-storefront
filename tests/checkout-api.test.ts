import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { POST, GET } from '../app/api/checkout/route';

const body = {
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
const request = (origin: string, data: unknown = body) =>
  new NextRequest('http://localhost:3006/api/checkout', {
    method: 'POST',
    headers: { origin, host: '127.0.0.1:3006', 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

test('same-origin checkout accepts a browser-facing host distinct from the internal server name', async () => {
  delete process.env.STRIPE_SECRET_KEY;
  delete process.env.SITE_URL;
  const response = await POST(request('http://127.0.0.1:3006'));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { mode: 'demo' });
});
test('cross-site checkout is rejected, and same-origin invalid variants are rejected', async () => {
  assert.equal((await POST(request('https://unrelated.example'))).status, 403);
  assert.equal(
    (
      await POST(
        request('http://127.0.0.1:3006', {
          ...body,
          lines: [{ ...body.lines[0], color: 'invalid' }],
        }),
      )
    ).status,
    400,
  );
});
test('live Stripe keys cannot enable payment checkout', async () => {
  process.env.STRIPE_SECRET_KEY = 'sk_live_not_a_real_credential';
  assert.deepEqual(await (await GET()).json(), { mode: 'unavailable' });
  assert.equal((await POST(request('http://127.0.0.1:3006'))).status, 503);
  delete process.env.STRIPE_SECRET_KEY;
});
