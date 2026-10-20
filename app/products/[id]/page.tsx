import { notFound } from 'next/navigation';
import { products, getProduct } from '@/lib/products';
import { ProductDetail } from '@/components/product-detail';
import { ProductCard } from '@/components/product-card';
export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: getProduct(id)?.name || 'Object not found' };
}
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  return (
    <section className="section product-page">
      <ProductDetail product={product} />
      <div className="related">
        <div className="section-heading">
          <div>
            <p className="eyebrow">GOOD THINGS GO TOGETHER</p>
            <h2>
              A little more <em>inspiration.</em>
            </h2>
          </div>
        </div>
        <div className="product-grid">
          {products
            .filter((p) => p.id !== id)
            .slice(0, 4)
            .map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
        </div>
      </div>
    </section>
  );
}
