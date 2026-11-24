import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { IMAGES } from '../data/siteData';
import { useRouter } from '../utils/router';
import { ButtonLink, Eyebrow, Img, Reveal, SectionHead } from '../components/ui';
import { ValuationForm } from '../components/ValuationForm';
import { NetProceedsCalculator } from '../components/NetProceeds';
import { ClosingCta, PageHero, Process } from '../components/Sections';

const CHECKLIST: { group: string; items: string[] }[] = [
  {
    group: 'Before listing',
    items: [
      'Gather your survey, HOA documents and recent utility bills',
      'Book a pre-listing walkthrough with Arzoo',
      'Fix small repairs: leaky faucets, loose handles, burned-out bulbs',
      'Touch up paint in high-traffic areas',
    ],
  },
  {
    group: 'Getting photo-ready',
    items: [
      'Declutter counters, closets and shelves',
      'Remove personal photos and bold decor',
      'Deep clean, including windows and grout',
      'Freshen the entry: doormat, plants, house numbers',
    ],
  },
  {
    group: 'Showings and closing',
    items: [
      'Plan where pets and valuables go during showings',
      'Keep the thermostat comfortable and lights on',
      'Hire your real estate attorney',
      'Schedule movers once attorney review is complete',
    ],
  },
];

const STORE = 'an_seller_checklist';

function Checklist() {
  const [done, setDone] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORE) || '[]');
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(done));
    } catch {
      /* ignore */
    }
  }, [done]);

  const total = CHECKLIST.reduce((n, g) => n + g.items.length, 0);
  const toggle = (item: string) => setDone((d) => (d.includes(item) ? d.filter((i) => i !== item) : [...d, item]));

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone">
          <div className="h-full rounded-full bg-ink transition-[width] duration-500" style={{ width: `${(done.length / total) * 100}%` }} />
        </div>
        <span className="num shrink-0 text-sm font-medium">
          {done.length} of {total} done
        </span>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {CHECKLIST.map((g, gi) => (
          <Reveal key={g.group} delay={gi * 0.06} className="rounded-3xl border border-stone bg-white p-6 sm:p-7">
            <h3 className="h-card">{g.group}</h3>
            <ul className="mt-5 space-y-1">
              {g.items.map((item) => {
                const checked = done.includes(item);
                return (
                  <li key={item}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      onClick={() => toggle(item)}
                      className="flex w-full items-start gap-3 rounded-xl p-2 text-left transition-colors hover:bg-sand"
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                          checked ? 'border-ink bg-ink text-white' : 'border-stone bg-white'
                        }`}
                      >
                        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </span>
                      <span className={`text-[15px] leading-snug transition-colors ${checked ? 'text-muted line-through' : 'text-ink'}`}>{item}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

const SERVICES = [
  { title: 'Pricing strategy', text: 'A detailed comparative analysis and a list price that draws strong offers.', image: IMAGES.livingGray },
  { title: 'Staging & prep', text: 'A room-by-room plan, plus trusted painters, cleaners and stagers.', image: IMAGES.livingArched },
  { title: 'Photo & video', text: 'Professional photography, video walkthroughs and floor plans.', image: IMAGES.dining },
  { title: 'Targeted marketing', text: 'MLS, Zillow, social campaigns and agent outreach before launch day.', image: IMAGES.chicagoAerial },
];

const STEPS = [
  { title: 'Walkthrough & valuation', text: 'I tour your home, review recent sales nearby and give you a clear price range.' },
  { title: 'Prepare the home', text: 'A prioritized list of what’s worth doing and what isn’t, with vendors to handle it.' },
  { title: 'Launch with impact', text: 'Photos, video and marketing go live together so the first weekend counts.' },
  { title: 'Negotiate the best terms', text: 'I compare offers on price, financing and timing, and negotiate through inspection.' },
  { title: 'Close and move on', text: 'I work with your attorney and the buyer’s side through to a smooth closing.' },
];

export function SellPage() {
  const { searchParams } = useRouter();
  const address = searchParams.get('address') ?? '';

  return (
    <>
      <PageHero
        eyebrow="Selling in Chicago"
        title="Sell your home for what it’s worth."
        text="Accurate pricing, beautiful marketing and steady negotiation, with a clear plan from day one."
        image={IMAGES.brownstoneStreet}
        titleClassName="text-[clamp(3.3rem,8vw,7.25rem)]"
      >
        <ButtonLink to="#valuation" variant="light">What’s my home worth?</ButtonLink>
        <ButtonLink to="#net-proceeds" variant="outline-light">Net proceeds calculator</ButtonLink>
      </PageHero>

      <section id="valuation" className="scroll-mt-20 py-20 sm:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Eyebrow>Home valuation</Eyebrow>
            <h2 className="h-section">What’s my home worth?</h2>
            <p className="lead mt-5 max-w-lg text-muted">
              Not an algorithm. I look at homes that actually sold near you, adjust for your home’s condition and
              updates, and send you a realistic price range within 24 hours.
            </p>
            <ul className="mt-8 space-y-3">
              {['Based on recent nearby sales', 'Adjusted for upgrades and condition', 'Free, with no obligation to list'].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[15px]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sand">
                    <Check className="h-3.5 w-3.5 text-bronze" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-10 hidden overflow-hidden rounded-3xl lg:block">
              <Img src={IMAGES.greystoneDusk} alt="Chicago greystone at dusk" className="aspect-[16/10] w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:pt-4">
            <div className="rounded-3xl border border-stone bg-white p-6 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.2)] sm:p-10">
              <ValuationForm key={address} initialAddress={address} />
            </div>
          </Reveal>
        </div>
      </section>

      <section id="net-proceeds" className="scroll-mt-20 bg-sand py-20 sm:py-28">
        <div className="wrap">
          <SectionHead
            eyebrow="Net proceeds calculator"
            title="See what you’ll walk away with."
            text="Estimate your take-home after the mortgage payoff, commission, transfer taxes and closing costs."
          />
          <Reveal className="mt-12">
            <NetProceedsCalculator />
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="wrap">
          <SectionHead eyebrow="What you get" title="Everything it takes to sell well." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <div className="aspect-[4/5] overflow-hidden rounded-2xl">
                  <Img src={s.image} alt="" className="h-full w-full object-cover" />
                </div>
                <h3 className="h-card mt-5">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="checklist" className="scroll-mt-20 bg-sand py-20 sm:py-28">
        <div className="wrap">
          <SectionHead
            eyebrow="Seller checklist"
            title="Getting your home ready."
            text="Tick things off as you go. Your progress is saved on this device."
            className="mb-12"
          />
          <Checklist />
        </div>
      </section>

      <section id="process" className="scroll-mt-20 py-20 sm:py-28">
        <div className="wrap">
          <SectionHead eyebrow="How selling works" title="From first visit to closing." className="mb-14" />
          {/* <Process steps={STEPS} image={IMAGES.goldCoastSalon} imageAlt="Elegant Gold Coast living room" /> */}
          <Process steps={STEPS} image={IMAGES.ArzooNaqviSell} imageAlt="Elegant Gold Coast living room" />
        </div>
      </section>

      <ClosingCta
        title="Thinking about selling this year?"
        text="Even if you’re a year out, a short conversation now can add real value when it’s time to list."
        image={IMAGES.chicagoRiver}
      />
    </>
  );
}
