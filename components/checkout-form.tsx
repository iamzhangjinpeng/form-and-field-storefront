'use client';
import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, LockKeyhole, CreditCard, Check, LoaderCircle } from 'lucide-react';
import { useStore } from './store-provider';
import { EmptyBag, OrderSummary } from './cart';
import { countries, validateCheckout } from '@/lib/checkout';
import { asset, shippingCost } from '@/lib/products';
type Mode = 'loading' | 'demo' | 'stripe' | 'unavailable';
export function CheckoutForm() {
  const { lines, ready, subtotal } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<Mode>(
    process.env.NEXT_PUBLIC_STATIC_DEMO === 'true' ? 'demo' : 'loading',
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STATIC_DEMO === 'true') return;
    const controller = new AbortController();
    fetch(asset('/api/checkout'), { signal: controller.signal, cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => setMode(data.mode))
      .catch((err) => {
        if (err.name !== 'AbortError') setMode('unavailable');
      });
    return () => controller.abort();
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const form = Object.fromEntries(new FormData(event.currentTarget));
      const payload = validateCheckout({ ...form, lines });
      let result: { mode: string; url?: string; error?: string } = { mode: 'demo' };
      if (process.env.NEXT_PUBLIC_STATIC_DEMO !== 'true') {
        const response = await fetch(asset('/api/checkout'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        result = await response.json();
        if (!response.ok)
          throw new Error(result.error || 'Something went wrong. Please try again.');
      }
      if (result.mode === 'stripe' && result.url) {
        window.location.assign(result.url);
        return;
      }
      if (result.mode !== 'demo')
        throw new Error('Checkout is temporarily unavailable. Please try again.');
      const reference = `FF-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const receipt = {
        mode: 'demo',
        reference,
        total: subtotal + shippingCost(subtotal),
        createdAt: Date.now(),
      };
      sessionStorage.setItem('ff-demo-receipt', JSON.stringify(receipt));
      router.push('/success?demo=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please check your details and try again.');
      setBusy(false);
    }
  }
  if (!ready) return <p className="loading-state">Preparing your checkout…</p>;
  if (!lines.length) return <EmptyBag />;
  return (
    <section className="section checkout-page">
      <Link href="/cart" className="text-link">
        <ArrowLeft size={15} /> Back to your bag
      </Link>
      <div className="checkout-title">
        <p className="eyebrow">ONE STEP CLOSER TO HOME</p>
        <h1>
          The good things <em>await.</em>
        </h1>
        <div className="checkout-steps">
          <span>
            <Check size={12} /> Bag
          </span>
          <span className="step-line" />
          <strong>01 &nbsp; Your details</strong>
          <span className="step-line" />
          <span>02 &nbsp; {mode === 'stripe' ? 'Test payment' : 'Demo confirmation'}</span>
        </div>
      </div>
      <div className="checkout-layout">
        <form onSubmit={submit} className="checkout-form">
          {params.get('cancelled') && (
            <p role="status" className="info-note">
              You’re back from Stripe. No payment was completed. Your bag is still here.
            </p>
          )}
          <div className="form-section">
            <h2>
              <span>01</span> Contact details
            </h2>
            <p>Checking out as a guest. Make yourself at home.</p>
            <label>
              Email address
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                maxLength={254}
              />
            </label>
          </div>
          <div className="form-section">
            <h2>
              <span>02</span> Shipping address
            </h2>
            <div className="form-row">
              <label>
                First name
                <input name="firstName" autoComplete="given-name" required maxLength={80} />
              </label>
              <label>
                Last name
                <input name="lastName" autoComplete="family-name" required maxLength={80} />
              </label>
            </div>
            <label>
              Address
              <input
                name="address"
                autoComplete="address-line1"
                placeholder="Street address"
                required
                maxLength={150}
              />
            </label>
            <label>
              Apartment, suite, etc. (optional)
              <input name="apartment" autoComplete="address-line2" maxLength={100} />
            </label>
            <div className="form-row">
              <label>
                City
                <input name="city" autoComplete="address-level2" required maxLength={100} />
              </label>
              <label>
                State / province / region
                <input name="region" autoComplete="address-level1" required maxLength={100} />
              </label>
            </div>
            <div className="form-row">
              <label>
                Country
                <select name="country" autoComplete="country" defaultValue="US">
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                ZIP / postal code
                <input name="postal" autoComplete="postal-code" required maxLength={20} />
              </label>
            </div>
          </div>
          <div className="payment-panel">
            <div className="payment-panel-title">
              <CreditCard size={20} />
              <h2>
                {mode === 'stripe'
                  ? 'Stripe · test mode'
                  : mode === 'loading'
                    ? 'Preparing checkout…'
                    : mode === 'unavailable'
                      ? 'Checkout unavailable'
                      : 'Try the full experience'}
              </h2>
              <span>{mode === 'stripe' ? 'TEST' : 'DEMO'}</span>
            </div>
            <p>
              {mode === 'stripe'
                ? 'Continue to Stripe’s secure, hosted payment page. Use test card 4242 4242 4242 4242, any future expiry date and any 3-digit CVC. No real money is charged.'
                : mode === 'unavailable'
                  ? 'Please refresh the page or try again later. Your bag is saved.'
                  : 'This is a portfolio store. Place a demo order to explore the complete journey. No card required, no payment taken, and nothing is shipped. Use fictional contact details.'}
            </p>
          </div>
          {error && (
            <div className="error-note" role="alert">
              {error}
            </div>
          )}
          <button
            className="button dark checkout-submit"
            type="submit"
            disabled={busy || mode === 'loading' || mode === 'unavailable'}
          >
            {busy ? (
              <>
                <LoaderCircle size={18} className="spin" /> Preparing your order…
              </>
            ) : (
              <>
                {mode === 'stripe' ? 'Continue to test payment' : 'Place demo order'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
          <p className="secure-note">
            <LockKeyhole size={13} />
            {mode === 'stripe'
              ? 'Encrypted payment · Stripe test mode'
              : 'No real payment · No card details collected'}
          </p>
        </form>
        <OrderSummary checkout />
      </div>
    </section>
  );
}
