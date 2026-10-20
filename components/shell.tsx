'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowUpRight, Menu, Search, ShoppingBag, X, ArrowRight } from 'lucide-react';
import { useStore } from './store-provider';
export function Navbar() {
  const { count } = useStore();
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <>
      <div className="announcement">
        Considered pieces. Everyday living.{' '}
        <span>
          Complimentary shipping over $150 <ArrowUpRight size={12} />
        </span>
      </div>
      <header className="header">
        <Link href="/" className="wordmark" aria-label="Form and Field home">
          FORM <i>&</i> FIELD<span>OBJECTS FOR A SLOWER LIFE</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link className={path.startsWith('/products') ? 'active' : ''} href="/products">
            Shop the collection
          </Link>
          <Link href="/#our-story">Our story</Link>
          <Link href="/#journal">The journal</Link>
        </nav>
        <div className="header-actions">
          <Link href="/products?search=" aria-label="Search the collection" className="icon-button">
            <Search size={20} strokeWidth={1.5} />
          </Link>
          <Link href="/cart" className="bag-link" aria-label={`Shopping bag, ${count} items`}>
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className="desktop-bag">Bag</span>
            <span className="bag-count">{count}</span>
          </Link>
          <button
            className="icon-button mobile-menu"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {[
            ['/products', 'Shop the collection'],
            ['/#our-story', 'Our story'],
            ['/#journal', 'The journal'],
            ['/cart', `Your bag (${count})`],
          ].map(([href, text]) => (
            <Link key={href} onClick={() => setOpen(false)} href={href}>
              {text}
              <ArrowRight size={18} />
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
const policies: Record<string, { title: string; text: string }> = {
  shipping: {
    title: 'Shipping & delivery',
    text: 'For this portfolio store, standard shipping is $12, or complimentary on orders of $150 or more. Delivery estimates of 3–7 business days are illustrative. No products are shipped, and no real orders are accepted.',
  },
  returns: {
    title: 'Returns & care',
    text: 'Our demo return policy illustrates a 30-day return window for unused items. Wipe wooden pieces with a soft, dry cloth, wash linen gently at 30°C, and follow the care details on each product page. This is a fictional shop; no returns are processed.',
  },
  contact: {
    title: 'Let’s make something considered.',
    text: 'FORM & FIELD is a fictional homewares brand built as an ecommerce portfolio. Interested in a store like this? Contact the developer through the GitHub profile linked in the footer.',
  },
};
export function Footer() {
  const [policy, setPolicy] = useState<string | null>(null);
  return (
    <>
      <footer className="footer">
        <div className="footer-top">
          <div>
            <p className="eyebrow">A HOME, WELL CONSIDERED.</p>
            <h2>
              Good things.
              <br />
              <em>Room to breathe.</em>
            </h2>
          </div>
          <div className="footer-links">
            <div>
              <p>Explore</p>
              <Link href="/products">All objects</Link>
              <Link href="/products?category=Furniture">Furniture</Link>
              <Link href="/products?category=Objects">Everyday objects</Link>
              <Link href="/#our-story">Our story</Link>
            </div>
            <div>
              <p>Here to help</p>
              <button onClick={() => setPolicy('shipping')}>Shipping & delivery</button>
              <button onClick={() => setPolicy('returns')}>Returns & care</button>
              <button onClick={() => setPolicy('contact')}>Get in touch</button>
              <a
                href="https://github.com/iamzhangjinpeng/form-and-field-storefront"
                target="_blank"
                rel="noreferrer"
              >
                View the project ↗
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <Link href="/" className="footer-mark">
            FORM & FIELD
          </Link>
          <span>© {new Date().getFullYear()} FORM & FIELD · A portfolio concept store.</span>
          <span>USD $ · English</span>
        </div>
        <p className="demo-disclosure">
          Made for demonstration. All products and brand details are illustrative. No real charges
          or deliveries.
        </p>
      </footer>
      {policy && (
        <div className="modal-backdrop" onClick={() => setPolicy(null)}>
          <section
            className="policy-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="policy-title"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setPolicy(null);
              if (event.key === 'Tab') {
                const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button');
                if (event.shiftKey && document.activeElement === buttons[0]) {
                  event.preventDefault();
                  buttons[buttons.length - 1].focus();
                } else if (
                  !event.shiftKey &&
                  document.activeElement === buttons[buttons.length - 1]
                ) {
                  event.preventDefault();
                  buttons[0].focus();
                }
              }
            }}
          >
            <button
              autoFocus
              className="icon-button modal-close"
              onClick={() => setPolicy(null)}
              aria-label="Close dialog"
            >
              <X />
            </button>
            <p className="eyebrow">FORM & FIELD</p>
            <h2 id="policy-title">{policies[policy].title}</h2>
            <p>{policies[policy].text}</p>
            <button className="button dark" onClick={() => setPolicy(null)}>
              Back to the store <ArrowRight size={16} />
            </button>
          </section>
        </div>
      )}
    </>
  );
}
