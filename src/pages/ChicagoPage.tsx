import React, { useState } from 'react';
import { Check, Loader2, Train } from 'lucide-react';
import { IMAGES, LISTING_NEIGHBORHOODS, NEIGHBORHOODS } from '../data/siteData';
import { Link } from '../utils/router';
import { submitInquiry } from '../utils/forms';
import { ButtonLink, buttonClass, Eyebrow, Img, inputClass, Reveal, SectionHead } from '../components/ui';
import { ClosingCta, PageHero } from '../components/Sections';
import { opts, Select } from '../components/Select';

function MarketReport() {
  const [area, setArea] = useState(NEIGHBORHOODS[0].name);
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');

  return (
    <section id="market" className="scroll-mt-20 bg-night py-20 text-white sm:py-28">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <Eyebrow light>Market snapshot</Eyebrow>
          <h2 className="h-section">Get your neighborhood’s numbers every month.</h2>
          <p className="lead mt-5 max-w-lg text-white/70">
            Homes for sale, what sold, median prices and days on market for your area, pulled from MRED and
            explained in plain English.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          {state === 'done' ? (
            <div className="rounded-3xl bg-white/10 p-8" role="status">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bronze">
                <Check className="h-5 w-5" />
              </span>
              <p className="h-card mt-5">You’re on the list.</p>
              <p className="mt-2 text-white/70">Your first {area} report will arrive at {email}.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setState('sending');
                submitInquiry('Market report signup', { neighborhood: area, email }).then(() => setState('done'));
              }}
              className="rounded-3xl bg-white p-6 text-ink sm:p-8"
            >
              <Select
                showLabel
                label="Neighborhood"
                value={area}
                onChange={setArea}
                options={opts([...new Set([...NEIGHBORHOODS.map((n) => n.name), ...LISTING_NEIGHBORHOODS])])}
              />
              <label className="mt-4 block">
                <span className="mb-2 block text-sm font-medium">Email</span>
                <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@email.com" />
              </label>
              <button type="submit" disabled={state === 'sending'} className={buttonClass('dark', 'mt-6 w-full')}>
                {state === 'sending' && <Loader2 className="h-4 w-4 animate-spin" />}
                Send me the report
              </button>
              <p className="mt-3 text-xs text-muted">Monthly. Unsubscribe anytime.</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function ChicagoPage() {
  return (
    <>
      <PageHero
        eyebrow="Neighborhood guide"
        title="Chicago, block by block."
        text="Where to live depends on how you want to live. Here’s an honest look at the neighborhoods my clients ask about most."
        image={IMAGES.chicagoAerial}
      />

      <section className="py-16 sm:py-20">
        <div className="wrap grid grid-cols-2 gap-8 border-b border-stone pb-16 sm:pb-20 lg:grid-cols-4">
          {[
            { v: '77', l: 'Community areas' },
            { v: '26 mi', l: 'Of lakefront' },
            { v: '600+', l: 'Public parks' },
            { v: '8', l: 'L train lines' },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i * 0.05}>
              <p className="num text-[clamp(2.5rem,5vw,4rem)] font-medium leading-none tracking-[-0.04em]">{s.v}</p>
              <p className="mt-2 text-muted">{s.l}</p>
            </Reveal>
          ))}
        </div>
        <nav aria-label="Neighborhoods" className="wrap mt-10 flex flex-wrap gap-2">
          {NEIGHBORHOODS.map((n) => (
            <Link key={n.id} to={`#${n.id}`} className="h-10 rounded-full border border-stone px-4 text-sm font-medium leading-10 transition-colors hover:border-ink hover:bg-ink hover:text-white">
              {n.name}
            </Link>
          ))}
        </nav>
      </section>

      <div className="pb-12">
        {NEIGHBORHOODS.map((n, i) => {
          const hasListings = LISTING_NEIGHBORHOODS.includes(n.name);
          return (
            <section key={n.id} id={n.id} className="scroll-mt-20 py-12 sm:py-16">
              <div className="wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
                <Reveal className={i % 2 ? 'lg:order-2' : ''}>
                  <div className="aspect-[4/3] overflow-hidden rounded-3xl">
                    <Link to={`/chicago/${n.id}`} aria-label={`Explore ${n.name}`}>
                      <Img src={n.image} alt={n.name} className="h-full w-full object-cover transition-transform duration-[1.2s] hover:scale-105" />
                    </Link>
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="num text-sm font-medium text-bronze">{String(i + 1).padStart(2, '0')}</p>
                  <h2 className="h-section mt-3">{n.name}</h2>
                  <p className="lead mt-5 text-muted">{n.description}</p>
                  <dl className="mt-8 grid gap-5 border-t border-stone pt-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm text-muted">Typical homes</dt>
                      <dd className="mt-1 font-medium">{n.homes}</dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1.5 text-sm text-muted">
                        <Train className="h-3.5 w-3.5" /> Getting around
                      </dt>
                      <dd className="mt-1 font-medium">{n.transit}</dd>
                    </div>
                  </dl>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {n.highlights.map((h) => (
                      <li key={h} className="rounded-full bg-sand px-3.5 py-1.5 text-sm">
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <ButtonLink to={`/chicago/${n.id}`}>Explore {n.name}</ButtonLink>
                    {hasListings && (
                      <ButtonLink to={`/buy?area=${encodeURIComponent(n.name)}#search`} variant="outline">
                        Homes for sale
                      </ButtonLink>
                    )}
                  </div>
                </Reveal>
              </div>
            </section>
          );
        })}
      </div>

      <section className="pb-20 sm:pb-28">
        <div className="wrap">
          <SectionHead eyebrow="Life in the city" title="More than a place to live." className="mb-12" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {[
              { src: IMAGES.chicagoTheatre, alt: 'The Chicago Theatre on State Street' },
              { src: IMAGES.chicagoNight, alt: 'Chicago skyline at night over Lake Michigan' },
              { src: IMAGES.chicagoLasalle, alt: 'LaSalle Street and the Board of Trade building' },
            ].map((p, i) => (
              <Reveal key={p.src} delay={i * 0.06} className={i === 1 ? 'col-span-2 row-span-1 lg:col-span-1' : ''}>
                <div className="aspect-[4/5] overflow-hidden rounded-2xl">
                  <Img src={p.src} alt={p.alt} className="h-full w-full object-cover transition-transform duration-[1.4s] hover:scale-105" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <MarketReport />
      <ClosingCta title="Not sure which neighborhood fits?" text="Tell me how you live, commute and spend weekends. I’ll suggest a short list and show you around." />
    </>
  );
}
