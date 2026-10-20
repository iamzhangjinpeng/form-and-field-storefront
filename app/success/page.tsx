import { Suspense } from 'react';
import { Success } from '@/components/success';
export const metadata = { title: 'Thank you', robots: { index: false, follow: false } };
export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="loading-state">Checking your order…</p>}>
      <Success />
    </Suspense>
  );
}
