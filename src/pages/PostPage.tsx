import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link2 } from 'lucide-react';
import { IMAGES, POSTS } from '../data/siteData';
import { SITE } from '../config/site';
import { Link, useSeo } from '../utils/router';
import { ButtonLink, Reveal, SectionHead } from '../components/ui';
import { ClosingCta } from '../components/Sections';
import { formatDate, PostCard } from './BlogPage';
import { NotFoundPage } from './NotFoundPage';

export function PostPage({ slug }: { slug: string }) {
  const post = POSTS.find((p) => p.slug === slug);
  const [copied, setCopied] = useState(false);
  useSeo(post ? `${post.title} | Arzoo Naqvi` : 'Article not found | Arzoo Naqvi', post?.excerpt ?? '');
  if (!post) return <NotFoundPage />;

  const related = POSTS.filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 3);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <section className="relative flex min-h-[72svh] items-end overflow-hidden bg-night text-white">
        <motion.img
          src={post.image}
          alt=""
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/40" />
        <div className="wrap relative pb-14 pt-36 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <nav aria-label="Breadcrumb" className="flex gap-2 text-sm text-white/60">
              <Link to="/blog" className="hover:text-white">Blog</Link>
              <span>/</span>
              <span className="text-bronze-light">{post.category}</span>
            </nav>
            <h1 className="mt-5 text-[clamp(2.25rem,5.5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.04em]">{post.title}</h1>
            <div className="mt-8 flex items-center gap-4">
              <img src={IMAGES.portrait} alt="" className="h-11 w-11 rounded-full object-cover object-top ring-2 ring-white/20" />
              <div className="text-sm">
                <p className="font-medium">Arzoo Naqvi</p>
                <p className="text-white/60">
                  {formatDate(post.date)} · {post.readTime} min read
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <article className="py-16 sm:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_minmax(0,680px)_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-2">
              <p className="mb-2 text-sm text-muted">Share</p>
              <button
                type="button"
                onClick={copy}
                className="flex h-10 w-fit items-center gap-2 rounded-full border border-stone px-4 text-sm font-medium transition-colors hover:border-ink"
              >
                <Link2 className="h-4 w-4" /> {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
          </aside>

          {/* Mirrors WordPress post content (the_content) — style these elements in the theme. */}
          <div className="text-[18px] leading-[1.8] text-ink/85">
            <p className="text-[clamp(1.25rem,2vw,1.4rem)] leading-[1.6] text-ink">{post.excerpt}</p>
            {post.body.map((b, i) => {
              if (b.type === 'h2')
                return (
                  <h2 key={i} className="mb-4 mt-12 text-[1.75rem] font-medium leading-tight tracking-[-0.03em] text-ink">
                    {b.text}
                  </h2>
                );
              if (b.type === 'ul')
                return (
                  <ul key={i} className="my-6 space-y-3">
                    {b.items.map((it) => (
                      <li key={it} className="flex gap-3">
                        <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
                        {it}
                      </li>
                    ))}
                  </ul>
                );
              if (b.type === 'quote')
                return (
                  <blockquote key={i} className="my-10 border-l-2 border-bronze pl-6 text-[1.4rem] font-medium leading-[1.45] tracking-[-0.02em] text-ink">
                    {b.text}
                  </blockquote>
                );
              return (
                <p key={i} className="mt-5">
                  {b.text}
                </p>
              );
            })}

            <div className="mt-16 flex flex-col gap-6 rounded-3xl bg-sand p-6 sm:flex-row sm:items-center sm:p-8">
              <img src={IMAGES.portrait} alt="" className="h-20 w-20 shrink-0 rounded-full object-cover object-top" />
              <div className="text-base">
                <p className="font-medium text-ink">Written by Arzoo Naqvi</p>
                <p className="mt-1 leading-relaxed text-muted">
                  Chicago realtor helping buyers and sellers across the city. Questions about this article? I’m happy to talk it through.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ButtonLink to="/contact" className="h-11 text-sm">Ask a question</ButtonLink>
                  <ButtonLink to={SITE.phoneHref} variant="outline" arrow={false} className="h-11 text-sm">
                    {SITE.phone}
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <section className="bg-sand py-20 sm:py-24">
        <div className="wrap">
          <SectionHead eyebrow="Keep reading" title="Related articles" action={<ButtonLink to="/blog" variant="outline">All articles</ButtonLink>} />
          <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
