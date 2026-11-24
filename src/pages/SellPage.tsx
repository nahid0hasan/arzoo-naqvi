import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { IMAGES } from '../data/siteData';
import { TAX_SOURCES } from '../data/taxResources';
import { useRouter } from '../utils/router';
import { ButtonLink, Eyebrow, Img, Reveal, SectionHead } from '../components/ui';
import { ValuationForm } from '../components/ValuationForm';
import { NetProceedsCalculator } from '../components/NetProceeds';
import { ClosingCta, Faq, PageHero, Process } from '../components/Sections';
import { SellerTaxInformation } from '../components/SellerTaxInformation';

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

const SELLER_TAX_FAQ = [
  {
    q: 'Do I have to pay taxes when selling my home in Chicago?',
    a: (
      <>
        Possibly, but not simply because you sold a home. Federal tax may apply to taxable gain after basis and
        selling expenses, with a possible primary-residence exclusion. Illinois income-tax treatment and
        location-specific transfer taxes are separate, and closing may include property-tax prorations. Your
        ownership, use, filing status, contract and property location all matter.{' '}
        <a href={TAX_SOURCES.irsSellingYourHome.href} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline underline-offset-4">
          IRS Publication 523
        </a>{' '}
        explains the federal rules.
      </>
    ),
  },
  {
    q: 'Can I qualify for the $250,000 or $500,000 home sale tax exclusion?',
    a: (
      <>
        Some sellers may exclude up to $250,000 of gain, or up to $500,000 for qualifying married couples filing
        jointly. Generally, ownership and use tests require two years during the five-year period before the sale;
        using the exclusion on another home within the prior two years may limit eligibility. Joint filers have
        additional rules, and exceptions or partial exclusions may apply. Eligibility is not automatic. See{' '}
        <a href={TAX_SOURCES.irsSaleOfHome.href} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline underline-offset-4">
          IRS Tax Topic 701
        </a>
        .
      </>
    ),
  },
  {
    q: 'What real estate transfer taxes apply when selling a home in Chicago?',
    a: (
      <>
        Illinois, Cook County and Chicago have separate transfer-tax rules. The City currently lists a $3.75-per-$500
        City portion generally paid by the buyer and a $1.50-per-$500 CTA portion generally paid by the seller.
        Exemptions may apply, and Chicago’s municipal tax does not apply to every Cook County suburb. Confirm the
        parcel, current charges and closing allocation with your title company or attorney.{' '}
        <a href={TAX_SOURCES.chicagoTransferTax.href} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline underline-offset-4">
          Check the City’s current guidance.
        </a>
      </>
    ),
  },
  {
    q: 'How are property taxes handled when selling a home?',
    a: (
      <>
        Property-tax bills may be issued after the period they cover, so a sale can close before the seller’s share
        has been paid. The purchase contract and closing statement determine how taxes are prorated or credited and
        how outstanding bills are addressed. The amount is not based on one universal percentage. Review the
        closing figures with your attorney or title company and check current bills with the{' '}
        <a href={TAX_SOURCES.cookCountyTreasurer.href} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline underline-offset-4">
          Cook County Treasurer
        </a>
        .
      </>
    ),
  },
  {
    q: 'Can home improvements and selling expenses reduce my taxable gain?',
    a: (
      <>
        Qualifying capital improvements may increase a home’s adjusted basis, while allowable selling expenses may
        reduce the amount realized. Routine repairs and maintenance generally are not treated like capital
        improvements, and not every expense qualifies. Keep purchase, improvement and closing records, then ask a
        tax professional which costs count.{' '}
        <a href={TAX_SOURCES.irsSellingYourHome.href} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline underline-offset-4">
          IRS Publication 523
        </a>{' '}
        describes common basis adjustments.
      </>
    ),
  },
  {
    q: 'Are rental and investment properties taxed differently when sold?',
    a: (
      <>
        They can be. A sale may involve capital gain and tax treatment for depreciation, while the primary-residence
        exclusion depends on ownership and use. A Section 1031 exchange may defer gain for qualifying investment or
        business real estate under strict rules; it does not automatically eliminate tax and generally is not for
        an ordinary personal residence. Discuss your history with a qualified tax professional.
      </>
    ),
  },
  {
    q: 'Does selling my home affect my Illinois income taxes?',
    a: (
      <>
        It may if the sale produces gain that is taxable under the applicable federal and Illinois rules. Illinois
        generally starts with federal adjusted gross income and applies state additions or subtractions, so the
        result depends on your return, residency, exclusion eligibility and other facts—not simply the home’s gross
        sale price. See the{' '}
        <a href={TAX_SOURCES.illinoisIncomeTax.href} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline underline-offset-4">
          Illinois Department of Revenue
        </a>{' '}
        or consult a tax professional.
      </>
    ),
  },
  {
    q: 'Do I need to report my home sale on my tax return?',
    a: (
      <>
        Reporting depends on whether gain is taxable, whether an exclusion applies and your filing circumstances.
        The IRS says a sale generally must be reported if you receive Form 1099-S, even when the gain may be
        excludable; other reporting rules can also apply. Check current{' '}
        <a href={TAX_SOURCES.irsSaleOfHome.href} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline underline-offset-4">
          IRS home-sale guidance
        </a>{' '}
        and get professional help for your federal and Illinois filing obligations.
      </>
    ),
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

      <SellerTaxInformation />

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

      <section id="faq" className="scroll-mt-20 py-20 sm:py-28">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <Reveal>
            <Eyebrow>Seller questions</Eyebrow>
            <h2 className="h-section">Questions about selling and taxes.</h2>
            <p className="mt-5 max-w-md leading-relaxed text-muted">
              General answers to common tax and closing questions. Your exact obligations depend on your home and
              circumstances.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Faq items={SELLER_TAX_FAQ} />
          </Reveal>
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
