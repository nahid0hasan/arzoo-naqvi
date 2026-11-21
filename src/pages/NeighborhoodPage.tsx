import React from 'react';
import { ArrowUpRight, Home, Train } from 'lucide-react';
import { LISTINGS, NEIGHBORHOODS, POSTS } from '../data/siteData';
import { Link, useSeo } from '../utils/router';
import { ButtonLink, Eyebrow, Img, Reveal, SectionHead } from '../components/ui';
import { ListingCard } from '../components/Listing';
import { ClosingCta, PageHero } from '../components/Sections';
import { PostCard } from './BlogPage';
import { NotFoundPage } from './NotFoundPage';

export function NeighborhoodPage({ id }: { id: string }) {
  const n = NEIGHBORHOODS.find((x) => x.id === id);
  useSeo(
    n ? `Living in ${n.name}, Chicago | Homes & Guide | Arzoo Naqvi` : 'Neighborhood not found | Arzoo Naqvi',
    n ? `${n.short} Homes for sale, transit and local highlights in ${n.name}, Chicago.` : '',
  );
  if (!n) return <NotFoundPage />;

  const homes = LISTINGS.filter((l) => l.neighborhood === n.name);
  const others = NEIGHBORHOODS.filter((x) => x.id !== n.id);
  const posts = POSTS.filter((p) => p.category === 'Neighborhoods' || p.body.some((b) => 'text' in b && b.text.includes(n.name))).slice(0, 3);

  return (
    <>
      <PageHero eyebrow="Chicago neighborhood" title={n.name} text={n.short} image={n.image}>
        <ButtonLink to="#homes" variant="light">Homes for sale</ButtonLink>
        <ButtonLink to="/contact" variant="outline-light">Ask Arzoo</ButtonLink>
      </PageHero>

      <section className="py-20 sm:py-28">
        <div className="wrap">
          <nav aria-label="Breadcrumb" className="mb-12 flex flex-wrap gap-2 text-sm text-muted">
            <Link to="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <Link to="/chicago" className="hover:text-ink">Neighborhoods</Link>
            <span>/</span>
            <span className="text-ink">{n.name}</span>
          </nav>
          <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-20">
            <Reveal>
              <Eyebrow>Overview</Eyebrow>
              <p className="text-[clamp(1.4rem,2.4vw,2rem)] font-medium leading-[1.3] tracking-[-0.025em]">{n.description}</p>
              <h2 className="h-card mt-12">What locals love</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {n.highlights.map((h) => (
                  <li key={h} className="rounded-2xl bg-sand p-5 font-medium">
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <dl className="divide-y divide-stone rounded-3xl border border-stone bg-white p-6">
                <div className="pb-5">
                  <dt className="flex items-center gap-2 text-sm text-muted">
                    <Home className="h-4 w-4 text-bronze" /> Typical homes
                  </dt>
                  <dd className="mt-1.5 font-medium">{n.homes}</dd>
                </div>
                <div className="py-5">
                  <dt className="flex items-center gap-2 text-sm text-muted">
                    <Train className="h-4 w-4 text-bronze" /> Getting around
                  </dt>
                  <dd className="mt-1.5 font-medium">{n.transit}</dd>
                </div>
                <div className="pt-5">
                  <dt className="text-sm text-muted">Homes for sale now</dt>
                  <dd className="num mt-1.5 text-2xl font-semibold">{homes.length}</dd>
                </div>
              </dl>
              <Link to="/chicago#market" className="group mt-4 flex items-center justify-between rounded-2xl bg-ink p-5 text-white">
                <span>
                  <span className="block font-medium">Monthly market report</span>
                  <span className="text-sm text-white/60">Prices and sales for {n.name}</span>
                </span>
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="homes" className="scroll-mt-20 bg-sand py-20 sm:py-28">
        <div className="wrap">
          <SectionHead
            eyebrow="Homes for sale"
            title={`Homes in ${n.name}`}
            action={<ButtonLink to={`/buy?area=${encodeURIComponent(n.name)}#search`} variant="outline">Search all</ButtonLink>}
          />
          {homes.length ? (
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {homes.map((l, i) => (
                <Reveal key={l.id} delay={i * 0.05}>
                  <ListingCard listing={l} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-3xl bg-white p-10 text-center">
              <p className="h-card">Nothing listed here right now.</p>
              <p className="mx-auto mt-2 max-w-md text-muted">Homes here often sell quickly. Get alerts the moment one comes up.</p>
              <div className="mt-6">
                <ButtonLink to="/contact">Get alerts</ButtonLink>
              </div>
            </div>
          )}
        </div>
      </section>

      {posts.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="wrap">
            <SectionHead eyebrow="From the blog" title="Read before you move" />
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {posts.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.05}>
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`pb-20 sm:pb-28 ${posts.length ? '' : 'pt-20 sm:pt-28'}`}>
        <div className="wrap">
          <SectionHead eyebrow="Keep exploring" title="Other neighborhoods" />
          <div className="no-scrollbar -mx-5 mt-10 flex snap-x gap-4 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5">
            {others.map((o) => (
              <Link key={o.id} to={`/chicago/${o.id}`} className="group w-[62vw] shrink-0 snap-start sm:w-auto">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl">
                  <Img src={o.image} alt={o.name} className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                </div>
                <p className="mt-3 flex items-center justify-between font-medium">
                  {o.name}
                  <ArrowUpRight className="h-4 w-4 text-muted transition-colors group-hover:text-ink" />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ClosingCta title={`Thinking about ${n.name}?`} text="I’ll show you the blocks, buildings and homes worth your time, and the ones to skip." image={n.image} />
    </>
  );
}
