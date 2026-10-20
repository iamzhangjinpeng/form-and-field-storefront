'use client';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Product, asset, money } from '@/lib/products';
import { useStore } from './store-provider';
export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useStore();
  return (
    <article className="product-card">
      <div className={`product-photo tone-${index % 4}`}>
        <Link href={`/products/${product.id}`} aria-label={`View ${product.name}`}>
          <img
            src={asset(`/images/${product.image}.jpg`)}
            alt={product.name}
            loading="lazy"
            width="640"
            height="760"
          />
        </Link>
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <button
          className="quick-add"
          aria-label={`Add ${product.name} to bag`}
          onClick={() =>
            add({
              productId: product.id,
              color: product.colors[0],
              size: product.sizes[0],
              quantity: 1,
            })
          }
        >
          <Plus size={19} />
        </button>
      </div>
      <div className="product-meta">
        <div>
          <Link href={`/products/${product.id}`}>
            <h3>{product.name}</h3>
          </Link>
          <p>
            {product.category} <span>·</span> {product.colors.length}{' '}
            {product.colors.length === 1 ? 'finish' : 'finishes'}
          </p>
        </div>
        <span>{money(product.price)}</span>
      </div>
    </article>
  );
}
