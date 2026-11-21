import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { IMAGES, Post, POSTS } from '../data/siteData';
import { Link, useSeo } from '../utils/router';
import { Img, Reveal } from '../components/ui';
import { ClosingCta, PageHero } from '../components/Sections';

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

/** Post card — mirrors a WordPress loop item (template-parts/content-card.php). */
export function PostCard({ post, large = false }: { post: Post; large?: boolean }) {
  return (
    <Link to={`/blog/${post.slug}`} className={`group block ${large ? 'lg:grid lg:grid-cols-2 lg:items-center lg:gap-14' : ''}`}>
      <div className={`overflow-hidden rounded-2xl ${large ? 'aspect-[16/11]' : 'aspect-[16/11]'}`}>
        <Img src={post.image} alt="" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out-soft group-hover:scale-105" />
      </div>
      <div className={large ? 'mt-6 lg:mt-0' : 'mt-5'}>
        <p className="flex items-center gap-3 text-sm text-muted">
          <span className="font-medium text-bronze">{post.category}</span>
          <span className="h-1 w-1 rounded-full bg-stone" />
          {formatDate(post.date)}
        </p>
        <h3 className={`mt-3 font-medium tracking-[-0.03em] ${large ? 'text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.08]' : 'text-xl leading-snug'}`}>
          {post.title}
        </h3>
        <p className={`mt-3 leading-relaxed text-muted ${large ? 'lead max-w-lg' : 'text-[15px]'}`}>{post.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium">
          Read article
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

const CATEGORIES = ['All', 'Buying', 'Selling', 'Neighborhoods'] as const;

export function BlogPage() {
  useSeo(
    'Chicago Real Estate Blog | Arzoo Naqvi',
    'Practical advice on buying and selling a home in Chicago, plus neighborhood guides from realtor Arzoo Naqvi.',
  );
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('All');
  const posts = cat === 'All' ? POSTS : POSTS.filter((p) => p.category === cat);
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        short
        eyebrow="Blog"
        title="Notes on Chicago real estate."
        text="Plain-English advice for buyers and sellers, and honest takes on the neighborhoods."
        image={IMAGES.chicagoLasalle}
      />

      <section className="py-16 sm:py-24">
        <div className="wrap">
          <div role="tablist" aria-label="Categories" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                onClick={() => setCat(c)}
                className={`h-11 shrink-0 rounded-full border px-5 text-[15px] font-medium transition-colors ${
                  cat === c ? 'border-ink bg-ink text-white' : 'border-stone hover:border-ink/40'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {featured && (
            <Reveal key={`f-${cat}`} className="mt-12 border-b border-stone pb-16">
              <PostCard post={featured} large />
            </Reveal>
          )}

          <div className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={`${cat}-${p.slug}`} delay={(i % 3) * 0.05}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
          {posts.length === 0 && <p className="mt-12 text-muted">No articles in this category yet.</p>}
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
