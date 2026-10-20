'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, ArrowRight, Flower2 } from 'lucide-react';
import { useStore } from './store-provider';
import { asset, money } from '@/lib/products';
type Receipt = { mode: string; reference: string; total: number; createdAt?: number };
export function Success() {
  const params = useSearchParams();
  const { clear, ready } = useStore();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!ready) return;
    let active = true;
    async function verify() {
      try {
        let value: Receipt;
        if (params.get('demo') === 'true') {
          value = JSON.parse(sessionStorage.getItem('ff-demo-receipt') || 'null');
          if (
            !value ||
            value.mode !== 'demo' ||
            !/^FF-[A-F0-9]{8}$/.test(value.reference) ||
            !Number.isFinite(value.total) ||
            Date.now() - (value.createdAt || 0) > 86400000
          )
            throw new Error(
              'There’s no recent demo order in this browser. Explore the collection to get started.',
            );
        } else {
          const id = params.get('session_id');
          if (!id || process.env.NEXT_PUBLIC_STATIC_DEMO === 'true')
            throw new Error('There’s no completed order to show yet.');
          const response = await fetch(`${asset('/api/session')}?id=${encodeURIComponent(id)}`, {
            cache: 'no-store',
          });
          const result = await response.json();
          if (!response.ok || !result.paid)
            throw new Error(result.error || 'Your payment has not been verified.');
          value = result;
        }
        if (active) {
          setReceipt(value);
          if (sessionStorage.getItem('ff-processed-order') !== value.reference) {
            clear();
            sessionStorage.setItem('ff-processed-order', value.reference);
          }
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'We couldn’t verify this order.');
      }
    }
    verify();
    return () => {
      active = false;
    };
  }, [params, clear, ready]);
  if (error)
    return (
      <section className="empty-state">
        <p className="eyebrow">LET’S CHECK THAT AGAIN</p>
        <h1>No confirmed order yet.</h1>
        <p role="alert">{error}</p>
        <Link href="/cart" className="button dark">
          Return to your bag <ArrowRight size={16} />
        </Link>
      </section>
    );
  if (!receipt)
    return (
      <div className="loading-state" role="status">
        Checking your order…
      </div>
    );
  return (
    <section className="success-page">
      <div className="success-icon">
        <Check size={33} strokeWidth={1.5} />
      </div>
      <p className="eyebrow">
        {receipt.mode === 'demo' ? 'YOUR DEMO ORDER IS COMPLETE' : 'STRIPE TEST PAYMENT CONFIRMED'}
      </p>
      <h1>
        A little lovely,
        <br />
        <em>on its way.</em>
      </h1>
      <p className="success-intro">
        {receipt.mode === 'demo'
          ? 'You’ve made it from a little inspiration to a complete demo order. Thank you for taking a look around.'
          : 'Your payment was verified with Stripe in test mode. Thank you for exploring the complete checkout experience.'}
      </p>
      <div className="receipt">
        <div>
          <span>Order reference</span>
          <strong>{receipt.reference}</strong>
        </div>
        <div>
          <span>{receipt.mode === 'demo' ? 'Demo total' : 'Test payment total'}</span>
          <strong>{money(receipt.total)}</strong>
        </div>
        <div>
          <span>Status</span>
          <span className="receipt-status">
            <Check size={12} />
            {receipt.mode === 'demo' ? 'Demo confirmed' : 'Test payment confirmed'}
          </span>
        </div>
      </div>
      <p className="success-note">
        This is a portfolio store. No real money was charged,
        <br />
        no confirmation email is sent, and no items will be shipped.
      </p>
      <Link className="button dark" href="/products">
        A little more inspiration <ArrowRight size={17} />
      </Link>
      <div className="success-signoff">
        <Flower2 size={23} strokeWidth={1} />
        <span>Considered, by nature.</span>
      </div>
    </section>
  );
}
