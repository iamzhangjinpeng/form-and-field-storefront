import Stripe from 'npm:stripe@20.0.0';
import { catalog, shippingCost, subtotalFor, validateCheckout } from '../_shared/commerce.ts';
import { handleOptions, isAllowedOrigin, json } from '../_shared/http.ts';

const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
const siteUrl = (
  Deno.env.get('SITE_URL') || 'https://iamzhangjinpeng.github.io/form-and-field-storefront'
).replace(/\/$/, '');

function mode() {
  if (!stripeKey) return 'demo';
  return /^(sk|rk)_test_/.test(stripeKey) ? 'stripe' : 'unavailable';
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return handleOptions(request);
  if (request.method === 'GET') return json(request, { mode: mode() });
  if (request.method !== 'POST') return json(request, { error: 'Method not allowed.' }, 405);
  if (!isAllowedOrigin(request))
    return json(request, { error: 'Please return to the store and try again.' }, 403);
  if (Number(request.headers.get('content-length') || 0) > 30000)
    return json(request, { error: 'Request too large.' }, 413);

  let data;
  try {
    data = validateCheckout(await request.json());
  } catch (error) {
    return json(
      request,
      { error: error instanceof Error ? error.message : 'Invalid checkout details.' },
      400,
    );
  }

  if (mode() === 'demo') return json(request, { mode: 'demo' });
  if (mode() !== 'stripe')
    return json(
      request,
      { error: 'This store accepts Stripe test keys only. Please contact the developer.' },
      503,
    );

  try {
    const subtotal = subtotalFor(data.lines);
    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: data.email,
      line_items: data.lines.map((line) => {
        const product = catalog.find((candidate) => candidate.id === line.productId)!;
        return {
          quantity: line.quantity,
          price_data: {
            currency: 'usd',
            unit_amount: product.price,
            product_data: {
              name: product.name,
              description: `${line.color} / ${line.size}`,
              metadata: { sku: product.sku },
            },
          },
        };
      }),
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: shippingCost(subtotal), currency: 'usd' },
            display_name: 'Standard shipping (portfolio demo)',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
      ],
      payment_intent_data: {
        shipping: {
          name: `${data.firstName} ${data.lastName}`,
          address: {
            line1: data.address,
            line2: data.apartment,
            city: data.city,
            state: data.region,
            postal_code: data.postal,
            country: data.country,
          },
        },
      },
      metadata: { portfolio: 'form-and-field', cart: JSON.stringify(data.lines).slice(0, 490) },
      success_url: `${siteUrl}/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/?cancelled=true`,
    });
    return json(request, { mode: 'stripe', url: session.url });
  } catch {
    return json(
      request,
      { error: 'We couldn’t open Stripe checkout. Your bag is saved. Please try again.' },
      502,
    );
  }
});
