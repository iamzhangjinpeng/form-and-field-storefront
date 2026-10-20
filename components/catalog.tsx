'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { categories, products } from '@/lib/products';
import { ProductCard } from './product-card';
export function Catalog() {
  const params = useSearchParams();
  const initial = params.get('category');
  const [category, setCategory] = useState(
    initial && categories.includes(initial) ? initial : categories[0],
  );
  const [query, setQuery] = useState(params.get('search') || '');
  const [sort, setSort] = useState('featured');
  useEffect(() => {
    const next = params.get('category');
    setCategory(next && categories.includes(next) ? next : categories[0]);
    setQuery(params.get('search') || '');
  }, [params]);
  const shown = products
    .filter(
      (p) =>
        (category === categories[0] || p.category === category) &&
        `${p.name} ${p.description} ${p.category} ${p.material}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => (sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0));
  return (
    <>
      <div className="catalog-toolbar">
        <div className="category-tabs" role="group" aria-label="Product category">
          {categories.map((name) => (
            <button
              key={name}
              aria-pressed={category === name}
              className={category === name ? 'selected' : ''}
              onClick={() => setCategory(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={17} />
          <input
            autoFocus={params.has('search')}
            type="search"
            placeholder="Find something lovely…"
            aria-label="Search products"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button aria-label="Clear search" onClick={() => setQuery('')}>
              <X size={15} />
            </button>
          )}
        </label>
      </div>
      <div className="results-bar">
        <p aria-live="polite">
          {shown.length} considered {shown.length === 1 ? 'object' : 'objects'}
          <span> · Find your everyday</span>
        </p>
        <label>
          <SlidersHorizontal size={14} />
          <span className="sr-only">Sort products</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </label>
      </div>
      {shown.length ? (
        <div className="product-grid catalog-grid">
          {shown.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="empty-state compact">
          <Search size={32} />
          <h2>No little treasures here.</h2>
          <p>Try another search, or explore the whole collection.</p>
          <button
            className="button dark"
            onClick={() => {
              setQuery('');
              setCategory(categories[0]);
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
