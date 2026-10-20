'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="empty-state">
      <p className="eyebrow">A SMALL PAUSE</p>
      <h1>Something needs a moment.</h1>
      <p>Please try again. Your bag is saved in this browser.</p>
      <button className="button dark" onClick={reset}>
        Try again →
      </button>
    </section>
  );
}
