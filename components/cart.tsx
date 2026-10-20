'use client';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, LockKeyhole, Trash2, ArrowLeft } from 'lucide-react';
import { useStore } from './store-provider';
import { asset, getProduct, money, shippingCost } from '@/lib/products';
import { lineKey } from '@/lib/order';
import { Quantity } from './product-detail';
export function EmptyBag() {
  return (
    <div className="empty-state">
      <ShoppingBag size={42} strokeWidth={1} />
      <p className="eyebrow">GOOD THINGS TAKE A LITTLE LOOKING.</p>
      <h1>Your bag is taking a breather.</h1>
      <p>Fill it with something that feels like home.</p>
      <Link href="/products" className="button dark">
        Explore the collection <ArrowRight size={17} />
      </Link>
    </div>
  );
}
export function OrderSummary({ checkout = false }: { checkout?: boolean }) {
  const { lines, subtotal } = useStore();
  const shipping = shippingCost(subtotal);
  return (
    <aside className="order-summary">
      <p className="eyebrow">A FEW GOOD THINGS</p>
      <h2>Order summary</h2>
      {checkout && (
        <div className="summary-items">
          {lines.map((line) => {
            const p = getProduct(line.productId)!;
            return (
              <div key={lineKey(line)}>
                <img src={asset(`/images/${p.image}.jpg`)} alt={p.name} width="64" height="76" />
                <div>
                  <span>{p.name}</span>
                  <small>
                    {line.color} / {line.size} · Qty {line.quantity}
                  </small>
                </div>
                <span>{money(p.price * line.quantity)}</span>
              </div>
            );
          })}
        </div>
      )}
      <div className="summary-row">
        <span>Subtotal</span>
        <span>{money(subtotal)}</span>
      </div>
      <div className="summary-row">
        <span>Shipping</span>
        <span>{shipping ? money(shipping) : 'On us'}</span>
      </div>
      <div className="summary-row">
        <span>Tax</span>
        <span>
          $0.00 <small>(demo)</small>
        </span>
      </div>
      <div className="summary-total">
        <span>Total</span>
        <span>
          <small>USD</small> {money(subtotal + shipping)}
        </span>
      </div>
      {!checkout && (
        <>
          <Link href="/checkout" className="button dark">
            Continue to checkout <ArrowRight size={17} />
          </Link>
          <p className="secure-note">
            <LockKeyhole size={13} /> Secure checkout · Demo store
          </p>
        </>
      )}
      <p className="summary-fineprint">A portfolio experience. No real purchases or deliveries.</p>
    </aside>
  );
}
export function Cart() {
  const { lines, ready, count, subtotal, update, remove } = useStore();
  if (!ready) return <p className="loading-state">Opening your bag…</p>;
  if (!lines.length) return <EmptyBag />;
  return (
    <section className="section bag-page">
      <div className="bag-heading">
        <div>
          <p className="eyebrow">A LITTLE SOMETHING LOVELY</p>
          <h1>
            Your bag<span>({count})</span>
          </h1>
        </div>
        <Link className="text-link" href="/products">
          Keep exploring <ArrowRight size={16} />
        </Link>
      </div>
      <div className="cart-layout">
        <div>
          <div className="shipping-progress">
            <p>
              {subtotal >= 15000
                ? 'Your order qualifies for complimentary shipping.'
                : `You’re ${money(15000 - subtotal)} away from complimentary shipping.`}
            </p>
            <div>
              <span style={{ width: `${Math.min(subtotal / 150, 100)}%` }} />
            </div>
          </div>
          <div className="cart-table-head">
            <span>Object</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>
          {lines.map((line) => {
            const p = getProduct(line.productId)!;
            const key = lineKey(line);
            return (
              <article className="cart-line" key={key}>
                <Link className="cart-line-image" href={`/products/${p.id}`}>
                  <img
                    src={asset(`/images/${p.image}.jpg`)}
                    alt={p.name}
                    width="120"
                    height="145"
                  />
                </Link>
                <div className="cart-line-copy">
                  <Link href={`/products/${p.id}`}>
                    <h2>{p.name}</h2>
                  </Link>
                  <p>
                    {line.color} / {line.size}
                  </p>
                  <span>{money(p.price)}</span>
                  <button
                    className="remove-link"
                    aria-label={`Remove ${p.name}`}
                    onClick={() => remove(key)}
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
                <Quantity
                  label={`Quantity of ${p.name}`}
                  value={line.quantity}
                  onChange={(quantity) => update(key, quantity)}
                />
                <span className="line-total">{money(p.price * line.quantity)}</span>
              </article>
            );
          })}
          <Link className="text-link back-shop" href="/products">
            <ArrowLeft size={16} /> Back to the collection
          </Link>
        </div>
        <OrderSummary />
      </div>
    </section>
  );
}
