import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="empty-state">
      <p className="eyebrow">A LITTLE LOST?</p>
      <h1>This corner is empty.</h1>
      <p>Let’s find you something lovely instead.</p>
      <Link className="button dark" href="/products">
        Explore the collection →
      </Link>
    </section>
  );
}
