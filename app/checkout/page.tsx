import { Suspense } from 'react';
import { CheckoutForm } from '@/components/checkout-form';
export const metadata = { title: 'Checkout' };
export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className="loading-state">Preparing your checkout…</p>}>
      <CheckoutForm />
    </Suspense>
  );
}
