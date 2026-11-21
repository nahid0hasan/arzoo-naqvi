import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { ButtonLink, Eyebrow, Img, Reveal } from './ui';
import { Link } from '../utils/router';
import { SITE } from '../config/site';
import { IMAGES } from '../data/siteData';

/** Full-bleed image hero used at the top of inner pages. */
export function PageHero({
  eyebrow,
  title,
  text,
  image,
  children,
  short = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  image: string;
  children?: React.ReactNode;
  short?: boolean;
}) {
  return (
    <section className={`relative flex items-end overflow-hidden bg-night text-white ${short ? 'min-h-[64svh]' : 'min-h-[82svh]'}`}>
      <motion.img
        src={image}
        alt=""
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/45" />
      <div className="wrap relative pb-14 pt-36 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h1 className="display">{title}</h1>
          {text && <p className="lead mt-6 max-w-xl text-white/80">{text}</p>}
          {children && <div className="mt-9 flex flex-wrap gap-3">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}

/** Image card that links to a page or section — the "resources" cards. */
export function ResourceCard({
  to,
  title,
  text,
  image,
  index,
}: {
  to: string;
  title: string;
  text: string;
  image: string;
  index: number;
}) {
  return (
    <Reveal delay={index * 0.06}>
      <Link to={to} className="group block h-full overflow-hidden rounded-2xl border border-stone bg-white transition-shadow duration-300 hover:shadow-[0_20px_40px_-20px_rgb(0_0_0/0.25)]">
        <div className="aspect-[16/10] overflow-hidden">
          <Img src={image} alt="" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out-soft group-hover:scale-105" />
        </div>
        <div className="flex items-start justify-between gap-4 p-6">
          <div>
            <h3 className="h-card">{title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

/** Closing call to action shared by every page. */
export function ClosingCta({
  title = 'Let’s talk about your next move.',
  text = 'Whether you’re buying, selling or just weighing your options, a quick conversation is the best place to start.',
  image = IMAGES.chicagoAerial,
}: {
  title?: string;
  text?: string;
  image?: string;
}) {
  return (
    <section className="bg-paper py-6 sm:py-10">
      <div className="wrap">
        <div className="relative overflow-hidden rounded-3xl bg-night text-white">
          <Img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
          <div className="relative px-6 py-16 sm:px-12 sm:py-24 lg:px-16">
            <Reveal className="max-w-xl">
              <h2 className="h-section">{title}</h2>
              <p className="lead mt-5 text-white/75">{text}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink to="/contact" variant="light">
                  Contact Arzoo
                </ButtonLink>
                <ButtonLink to={SITE.phoneHref} variant="outline-light" arrow={false}>
                  {SITE.phone}
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Numbered process steps with an image alongside. */
export function Process({
  steps,
  image,
  imageAlt,
}: {
  steps: { title: string; text: string }[];
  image: string;
  imageAlt: string;
}) {
  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
      <Reveal className="lg:sticky lg:top-28 lg:self-start">
        <div className="aspect-[4/5] overflow-hidden rounded-3xl">
          <Img src={image} alt={imageAlt} className="h-full w-full object-cover" />
        </div>
      </Reveal>
      <ol className="border-t border-stone">
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.04}>
            <li className="grid grid-cols-[3rem_1fr] gap-4 border-b border-stone py-8 sm:grid-cols-[4rem_1fr]">
              <span className="num text-sm font-medium text-bronze">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="h-card">{s.title}</h3>
                <p className="mt-2 max-w-md leading-relaxed text-muted">{s.text}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

/** Simple accessible accordion. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-stone border-y border-stone">
      {items.map((item) => (
        <details key={item.q} className="group py-2">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg font-medium tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
            {item.q}
            <span className="relative h-4 w-4 shrink-0" aria-hidden="true">
              <span className="absolute left-0 top-1/2 h-px w-4 bg-ink" />
              <span className="absolute left-1/2 top-0 h-4 w-px bg-ink transition-transform duration-300 group-open:rotate-90 group-open:opacity-0" />
            </span>
          </summary>
          <p className="max-w-2xl pb-5 leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
