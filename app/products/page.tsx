import { Suspense } from 'react';
import { Catalog } from '@/components/catalog';
export const metadata = { title: 'The collection' };
export default function ProductsPage() {
  return (
    <section className="section catalog-page">
      <div className="collection-heading">
        <p className="eyebrow">FEWER THINGS. BETTER CHOSEN.</p>
        <h1>
          The considered <em>collection.</em>
        </h1>
        <p>Natural textures, thoughtful forms, and a place in your everyday.</p>
      </div>
      <Suspense fallback={<p className="loading-state">Finding your everyday…</p>}>
        <Catalog />
      </Suspense>
      <div className="collection-footnote">A little less noise. A little more you.</div>
    </section>
  );
}
