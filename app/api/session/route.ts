import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id || !/^cs_test_[a-zA-Z0-9]+$/.test(id))
    return NextResponse.json({ error: 'Invalid checkout session.' }, { status: 400 });
  try {
    const session = await getStripe().checkout.sessions.retrieve(id);
    if (
      session.livemode ||
      session.payment_status !== 'paid' ||
      session.metadata?.portfolio !== 'form-and-field'
    )
      return NextResponse.json(
        { error: 'Your payment hasn’t been confirmed. Please review checkout.' },
        { status: 409 },
      );
    return NextResponse.json(
      {
        paid: true,
        mode: 'stripe',
        reference: session.id.slice(-10).toUpperCase(),
        total: session.amount_total,
        currency: session.currency,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json(
      { error: 'We couldn’t verify this session. Your bag has been kept safe.' },
      { status: 400 },
    );
  }
}
