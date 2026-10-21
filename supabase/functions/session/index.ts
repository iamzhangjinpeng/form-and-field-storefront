import Stripe from 'npm:stripe@20.0.0';
import { handleOptions, json } from '../_shared/http.ts';

const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || '';

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return handleOptions(request);
  if (request.method !== 'GET') return json(request, { error: 'Method not allowed.' }, 405);
  const id = new URL(request.url).searchParams.get('id');
  if (!id || !/^cs_test_[a-zA-Z0-9]+$/.test(id))
    return json(request, { error: 'Invalid checkout session.' }, 400);
  if (!/^(sk|rk)_test_/.test(stripeKey))
    return json(request, { error: 'Stripe test mode is not configured.' }, 503);
  try {
    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.retrieve(id);
    if (
      session.livemode ||
      session.payment_status !== 'paid' ||
      session.metadata?.portfolio !== 'form-and-field'
    )
      return json(
        request,
        { error: 'Your payment hasn’t been confirmed. Please review checkout.' },
        409,
      );
    return json(request, {
      paid: true,
      mode: 'stripe',
      reference: session.id.slice(-10).toUpperCase(),
      total: session.amount_total,
      currency: session.currency,
    });
  } catch {
    return json(
      request,
      { error: 'We couldn’t verify this session. Your bag has been kept safe.' },
      400,
    );
  }
});
