'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, ArrowRight, Truck, Package, Check } from 'lucide-react';
import { Product, asset, money } from '@/lib/products';
import { useStore } from './store-provider';
export function Quantity({
  value,
  onChange,
  label = 'Quantity',
}: {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}) {
  return (
    <div className="quantity" role="group" aria-label={label}>
      <button
        type="button"
        aria-label={`Decrease ${label.toLowerCase()}`}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={14} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        aria-label={`Increase ${label.toLowerCase()}`}
        disabled={value >= 10}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
const colorHex: Record<string, string> = {
  'Natural oak': '#c9ab83',
  'Smoked oak': '#6f5140',
  Chalk: '#e6dfd1',
  Terracotta: '#b77357',
  Oat: '#c9bca5',
  Olive: '#85876f',
  Clay: '#ba8c78',
  Sand: '#d2bd9d',
  Walnut: '#634c3c',
  Ivory: '#f1ebdf',
};
export function ProductDetail({ product }: { product: Product }) {
  const { add } = useStore();
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(product.image);
  const [added, setAdded] = useState(false);
  return (
    <>
      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/products">The collection</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>
      <div className="detail-grid">
        <div className="detail-gallery">
          <div className="detail-main-image">
            <img
              src={asset(`/images/${image}.jpg`)}
              alt={
                image === product.image
                  ? product.name
                  : `${product.name} — material and styling inspiration`
              }
              width="1000"
              height="1100"
            />
            {product.tag && <span className="product-tag">{product.tag}</span>}
          </div>
          <div className="image-thumbnails">
            {[product.image, product.alternate].map((img, i) => (
              <button
                key={`${img}-${i}`}
                onClick={() => setImage(img)}
                aria-label={i === 0 ? 'View product image' : 'View styling inspiration'}
                aria-pressed={image === img}
              >
                <img
                  src={asset(`/images/${img}.jpg`)}
                  alt={i === 0 ? 'Product view' : 'Styling inspiration'}
                  width="100"
                  height="110"
                />
              </button>
            ))}
            <p>
              Illustrative photography.
              <br />A little inspiration for your space.
            </p>
          </div>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{product.category.toUpperCase()} · THE EVERYDAY COLLECTION</p>
          <h1>{product.name}</h1>
          <p className="detail-price">
            {money(product.price)} <span>USD</span>
          </p>
          <p className="detail-description">{product.description}</p>
          <fieldset className="option-group">
            <legend>
              Finish <span>— {color}</span>
            </legend>
            <div className="swatches">
              {product.colors.map((c) => (
                <button
                  key={c}
                  className={c === color ? 'chosen' : ''}
                  aria-label={c}
                  aria-pressed={c === color}
                  onClick={() => {
                    setColor(c);
                    setAdded(false);
                  }}
                  style={{ '--swatch': colorHex[c] || '#c8baa7' } as React.CSSProperties}
                >
                  {c === color && <Check size={16} />}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="option-group">
            <legend>
              Size <span>— {size}</span>
            </legend>
            <div className="size-buttons">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  className={s === size ? 'chosen' : ''}
                  aria-pressed={s === size}
                  onClick={() => {
                    setSize(s);
                    setAdded(false);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="add-row">
            <Quantity value={quantity} onChange={setQuantity} />
            <button
              className="button dark add-button"
              onClick={() => {
                add({ productId: product.id, color, size, quantity });
                setAdded(true);
              }}
            >
              {added ? 'Added to your bag' : 'Add to bag'}
              {added ? <Check size={18} /> : <Plus size={18} />}
            </button>
          </div>
          {added && (
            <Link className="added-link" href="/cart">
              View your bag <ArrowRight size={15} />
            </Link>
          )}
          <div className="delivery-notes">
            <span>
              <Truck size={18} /> Complimentary shipping over $150
            </span>
            <span>
              <Package size={18} /> 30-day returns · Portfolio policy
            </span>
          </div>
          <div className="product-accordions">
            <details open>
              <summary>Materials & details</summary>
              <p>
                {product.material}. All sizes and finishes are priced equally in this demo. Product
                SKU: {product.sku}.
              </p>
            </details>
            <details>
              <summary>Care, with a little care</summary>
              <p>
                {product.category === 'Textiles'
                  ? 'Gentle machine wash at 30°C. Air dry and avoid harsh detergents.'
                  : product.category === 'Lighting'
                    ? 'Unplug before cleaning. Dust gently with a soft, dry cloth. Bulb not included.'
                    : 'Dust with a soft cloth. Avoid prolonged direct sunlight and harsh cleaning products.'}
              </p>
            </details>
            <details>
              <summary>Delivery & returns</summary>
              <p>
                Standard shipping is $12, free on orders $150+. An illustrative 3–7 business day
                delivery window and 30-day return policy. This concept store does not fulfill
                orders.
              </p>
            </details>
          </div>
        </div>
      </div>
    </>
  );
}
