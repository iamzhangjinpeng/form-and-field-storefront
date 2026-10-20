import { NextRequest, NextResponse } from 'next/server';
import { checkoutMode, getStripe } from '@/lib/stripe';
import { validateCheckout } from '@/lib/checkout';
import { getProduct, shippingCost } from '@/lib/products';
import { subtotalFor } from '@/lib/order';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({ mode: checkoutMode() }, { headers: { 'Cache-Control': 'no-store' } });
}
export async function POST(request: NextRequest) {
  const requestOrigin = request.headers.get('origin');
  let sameOrigin = false;
  try {
    const origin = new URL(requestOrigin || '');
    sameOrigin =
      /^https?:$/.test(origin.protocol) &&
      (process.env.SITE_URL
        ? origin.origin === new URL(process.env.SITE_URL).origin
        : origin.host === request.headers.get('host'));
  } catch {
    /* Reject missing or malformed origins. */
  }
  if (!sameOrigin)
    return NextResponse.json(
      { error: 'Please return to the store and try again.' },
      { status: 403 },
    );
  if (Number(request.headers.get('content-length') || 0) > 30000)
    return NextResponse.json({ error: 'Request too large.' }, { status: 413 });
  let data;
  try {
    data = validateCheckout(await request.json());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid checkout details.' },
      { status: 400 },
    );
  }
  const mode = checkoutMode();
  if (mode === 'demo') return NextResponse.json({ mode: 'demo' });
  if (mode !== 'stripe')
    return NextResponse.json(
      { error: 'This store accepts Stripe test keys only. Please contact the developer.' },
      { status: 503 },
    );
  try {
    const configured = process.env.SITE_URL || requestOrigin!;
    const origin = new URL(configured).origin;
    const subtotal = subtotalFor(data.lines);
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: data.email,
      line_items: data.lines.map((line) => {
        const p = getProduct(line.productId)!;
        return {
          quantity: line.quantity,
          price_data: {
            currency: 'usd',
            unit_amount: p.price,
            product_data: {
              name: p.name,
              description: `${line.color} / ${line.size}`,
              metadata: { sku: p.sku },
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
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?cancelled=true`,
    });
    return NextResponse.json({ mode: 'stripe', url: session.url });
  } catch {
    return NextResponse.json(
      { error: 'We couldn’t open Stripe checkout. Your bag is saved. Please try again.' },
      { status: 502 },
    );
  }
}
