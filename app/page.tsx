import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Flower2, Package, Sun, Truck } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { products, asset } from '@/lib/products';
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-line" /> THE ART OF EVERYDAY LIVING
          </p>
          <h1>
            A little less.
            <br />A little more
            <br />
            <em>home.</em>
          </h1>
          <p className="hero-description">
            Thoughtful objects. Natural textures. Quiet details.
            <br className="desktop-only" /> A collection to make the everyday feel a little better.
          </p>
          <Link href="/products" className="button dark">
            Find your everyday <ArrowUpRight size={18} />
          </Link>
          <div className="hero-bottom">
            <span>DESIGNED TO FIT YOUR LIFE</span>
            <span>01 — 08</span>
          </div>
        </div>
        <div className="hero-image">
          <img
            src={asset('/images/hero.jpg')}
            alt="A sunlit, neutral living room with natural wood furniture and soft textiles"
            width="1400"
            height="1500"
            fetchPriority="high"
          />
          <div className="image-label">
            <span>THE SLOW LIVING EDIT</span>
            <span>Less, but lovelier.</span>
          </div>
          <Link className="hero-product" href="/products/arc-lounge-chair">
            <span className="hero-product-dot">+</span>
            <div>
              A considered corner<span>Explore the collection</span>
            </div>
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <div className="values-strip">
        <span>
          <Flower2 size={18} strokeWidth={1.3} /> Natural textures, thoughtful forms
        </span>
        <span>
          <Sun size={18} strokeWidth={1.3} /> Made for your everyday
        </span>
        <span>
          <Truck size={19} strokeWidth={1.3} /> Free shipping on orders $150+
        </span>
      </div>
      <section className="section featured">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE CONSIDERED COLLECTION</p>
            <h2>
              Meet your new <em>everyday.</em>
            </h2>
          </div>
          <Link className="text-link" href="/products">
            Shop all objects <ArrowRight size={17} />
          </Link>
        </div>
        <div className="product-grid">
          {products.slice(0, 4).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>
      <section className="category-section section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FIND YOUR KIND OF CALM</p>
            <h2>
              A place for <em>everything.</em>
            </h2>
          </div>
          <p className="section-note">
            Simple additions.
            <br />A different feeling.
          </p>
        </div>
        <div className="category-grid">
          {[
            ['Furniture', 'Room to unwind.', 'chair-studio'],
            ['Objects', 'Little things. Lasting joy.', 'vase-studio'],
            ['Lighting', 'Set a softer mood.', 'lamp-studio'],
          ].map(([category, copy, image]) => (
            <Link key={category} href={`/products?category=${category}`} className="category-card">
              <img
                src={asset(`/images/${image}.jpg`)}
                alt={`${category} collection`}
                loading="lazy"
                width="640"
                height="760"
              />
              <div>
                <p>{category}</p>
                <span>{copy}</span>
              </div>
              <span className="circle-arrow">
                <ArrowUpRight size={21} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="story" id="our-story">
        <div className="story-image">
          <img
            src={asset('/images/story.jpg')}
            alt="Natural materials and warm neutral tones in a considered home"
            loading="lazy"
            width="1000"
            height="1100"
          />
          <span className="story-caption">A LITTLE SPACE TO SIMPLY BE.</span>
        </div>
        <div className="story-copy">
          <p className="eyebrow">THE FORM & FIELD PHILOSOPHY</p>
          <h2>
            A home is more
            <br />
            than the things
            <br />
            <em>you put in it.</em>
          </h2>
          <p>
            It’s the morning light on your favorite chair. The cup that fits just right. The small,
            familiar things that make a space feel like you.
          </p>
          <p>
            We bring together warm materials, honest forms and an unhurried point of view. Fewer
            things, chosen with a little more care.
          </p>
          <Link href="/products" className="text-link">
            Discover the collection <ArrowRight size={17} />
          </Link>
          <div className="story-signature">Considered, by nature.</div>
        </div>
      </section>
      <section className="section journal" id="journal">
        <div className="section-heading">
          <div>
            <p className="eyebrow">NOTES ON A SLOWER LIFE</p>
            <h2>
              The quiet <em>journal.</em>
            </h2>
          </div>
          <span className="section-note">A little inspiration for feeling at home.</span>
        </div>
        <div className="journal-grid">
          <article>
            <img
              src={asset('/images/interior.jpg')}
              alt="A relaxed living space in warm neutral tones"
              loading="lazy"
              width="900"
              height="600"
            />
            <p className="eyebrow">AT HOME · A MOMENT TO PAUSE</p>
            <h3>Make room for the everyday.</h3>
            <p>
              A favorite seat. A soft light. Start with one corner, add a texture you love, and
              leave a little space for life to happen.
            </p>
          </article>
          <article>
            <img
              src={asset('/images/vase-studio.jpg')}
              alt="Ceramic forms and tactile finishes"
              loading="lazy"
              width="900"
              height="600"
            />
            <p className="eyebrow">MATERIAL NOTES · QUIET DETAILS</p>
            <h3>The beauty in the imperfect.</h3>
            <p>
              A subtle glaze, the grain of wood, the fold of linen. Let small variations bring
              warmth and character into your home.
            </p>
          </article>
        </div>
      </section>
      <section className="closing-note">
        <Package size={26} strokeWidth={1} />
        <p>
          Little details. <em>A lovely difference.</em>
        </p>
        <Link href="/products" className="text-link">
          Make yourself at home <ArrowRight size={17} />
        </Link>
      </section>
    </>
  );
}
