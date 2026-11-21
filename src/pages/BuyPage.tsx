import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, SlidersHorizontal, X } from 'lucide-react';
import { IMAGES, LISTINGS, LISTING_NEIGHBORHOODS, PropertyType } from '../data/siteData';
import { SITE } from '../config/site';
import { useRouter } from '../utils/router';
import { compactMoney } from '../utils/format';
import { ButtonLink, Eyebrow, Img, Reveal, SectionHead } from '../components/ui';
import { opts, Select } from '../components/Select';
import { ListingCard } from '../components/Listing';
import { MortgageCalculator } from '../components/MortgageCalculator';
import { InquiryForm } from '../components/InquiryForm';
import { Faq, PageHero, Process } from '../components/Sections';

const TYPES: ('Any' | PropertyType)[] = ['Any', 'House', 'Condo', 'Townhome', 'Loft'];
const PRICE_OPTS = opts([500000, 750000, 1000000, 1250000, 1500000, 2000000, 3000000], (p) => compactMoney(+p));
const AREA_OPTS = [{ value: "", label: "All neighborhoods" }, ...opts(LISTING_NEIGHBORHOODS)];
const SORTS = { newest: 'Newest', low: 'Price: low to high', high: 'Price: high to low', size: 'Largest' } as const;

function SearchSection() {
  const { searchParams } = useRouter();
  const [area, setArea] = useState(searchParams.get('area') ?? '');
  const [min, setMin] = useState('');
  const [max, setMax] = useState(searchParams.get('max') ?? '');
  const [beds, setBeds] = useState(searchParams.get('beds') ?? '');
  const [baths, setBaths] = useState('');
  const [type, setType] = useState<(typeof TYPES)[number]>('Any');
  const [sort, setSort] = useState<keyof typeof SORTS>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Keep filters in sync when arriving from the homepage search.
  const paramKey = searchParams.toString();
  useEffect(() => {
    setArea(searchParams.get('area') ?? '');
    setMax(searchParams.get('max') ?? '');
    setBeds(searchParams.get('beds') ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramKey]);

  const results = useMemo(() => {
    const list = LISTINGS.filter(
      (l) =>
        (!area || l.neighborhood === area) &&
        (!min || l.price >= +min) &&
        (!max || l.price <= +max) &&
        (!beds || l.beds >= +beds) &&
        (!baths || l.baths >= +baths) &&
        (type === 'Any' || l.type === type),
    );
    if (sort === 'low') list.sort((a, b) => a.price - b.price);
    if (sort === 'high') list.sort((a, b) => b.price - a.price);
    if (sort === 'size') list.sort((a, b) => b.sqft - a.sqft);
    return list;
  }, [area, min, max, beds, baths, type, sort]);

  const activeCount = [area, min, max, beds, baths, type !== 'Any' ? type : ''].filter(Boolean).length;
  const reset = () => {
    setArea('');
    setMin('');
    setMax('');
    setBeds('');
    setBaths('');
    setType('Any');
  };

  const extraCount = [min, max, beds, baths, type !== "Any" ? type : ""].filter(Boolean).length;
  const FILTERS = [
    { label: "Min price", value: min, set: setMin, options: [{ value: "", label: "No min" }, ...PRICE_OPTS] },
    { label: "Max price", value: max, set: setMax, options: [{ value: "", label: "No max" }, ...PRICE_OPTS] },
    { label: "Beds", value: beds, set: setBeds, options: [{ value: "", label: "Any" }, ...opts([1, 2, 3, 4, 5], (b) => `${b}+`)] },
    { label: "Baths", value: baths, set: setBaths, options: [{ value: "", label: "Any" }, ...opts([1, 2, 3, 4], (b) => `${b}+`)] },
    { label: "Home type", value: type, set: (v: string) => setType(v as (typeof TYPES)[number]), options: opts(TYPES, (t) => (t === "Any" ? "Any type" : t)) },
  ];

  return (
    <section id="search" className="scroll-mt-20 py-20 sm:py-28">
      <div className="wrap">
        <SectionHead
          eyebrow="Search homes"
          title="Homes for sale in Chicago"
          action={
            SITE.zillowProfile ? (
              <ButtonLink to={SITE.zillowProfile} variant="outline">
                Also browse on Zillow
              </ButtonLink>
            ) : undefined
          }
        />

        <div className="sticky top-[68px] z-30 -mx-5 mt-10 border-y border-stone bg-paper/95 px-5 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-3xl sm:border sm:bg-white/95 sm:p-2 sm:shadow-[0_10px_30px_-18px_rgb(0_0_0/0.25)]">
          <div className="flex items-center gap-2 lg:grid lg:grid-cols-[1.4fr_repeat(5,1fr)] lg:gap-0">
            <Select variant="hero" label="Location" icon={<MapPin className="h-[18px] w-[18px]" />} value={area} onChange={setArea} options={AREA_OPTS} className="flex-1 lg:pr-1" />
            {FILTERS.map((f) => (
              <Select key={f.label} variant="hero" label={f.label} value={f.value} onChange={f.set} options={f.options} className="hidden lg:block lg:border-l lg:border-stone lg:px-1" />
            ))}
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              className={`flex h-14 shrink-0 items-center gap-2 rounded-xl border px-4 text-[15px] font-medium transition-colors lg:hidden ${showFilters ? "border-ink bg-ink text-white" : "border-stone bg-white"}`}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters{extraCount ? ` · ${extraCount}` : ""}
            </button>
          </div>
          {showFilters && (
            <div className="mt-3 grid grid-cols-2 gap-2 lg:hidden">
              {FILTERS.map((f, i) => (
                <Select key={f.label} showLabel label={f.label} value={f.value} onChange={f.set} options={f.options} className={i === FILTERS.length - 1 ? "col-span-2" : ""} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[15px]" aria-live="polite">
            <span className="font-semibold">{results.length}</span> {results.length === 1 ? 'home' : 'homes'}
            {activeCount > 0 && (
              <button type="button" onClick={reset} className="ml-3 inline-flex items-center gap-1 text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
                <X className="h-3.5 w-3.5" /> Clear filters
              </button>
            )}
          </p>
          <Select
            variant="pill"
            label="Sort"
            value={sort}
            onChange={(v) => setSort(v as keyof typeof SORTS)}
            options={Object.entries(SORTS).map(([value, label]) => ({ value, label }))}
          />
        </div>

        {results.length > 0 ? (
          <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((l, i) => (
              <Reveal key={l.id} delay={(i % 3) * 0.05}>
                <ListingCard listing={l} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl bg-sand p-10 text-center sm:p-16">
            <p className="h-card">No homes match those filters yet.</p>
            <p className="mx-auto mt-2 max-w-md text-muted">
              Many homes sell before they hit the market. Tell me what you’re after and I’ll send matches as soon as they come up.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={reset} className="h-12 rounded-full border border-ink/20 px-6 font-medium hover:border-ink">
                Clear filters
              </button>
              <ButtonLink to="#consult">Get listing alerts</ButtonLink>
            </div>
          </div>
        )}

        <p className="mt-12 text-xs text-muted">
          Sample listings for preview. Live MRED listings with full search will appear here once the IDX feed is connected.
        </p>
      </div>
    </section>
  );
}

const STEPS = [
  { title: 'Talk through your goals', text: 'A 20-minute call about budget, timing, must-haves and the neighborhoods worth a look.' },
  { title: 'Get pre-approved', text: 'I’ll connect you with trusted local lenders so you know your number and can offer with confidence.' },
  { title: 'Tour the right homes', text: 'Curated showings, including off-market and coming-soon homes, with honest notes on each one.' },
  { title: 'Make a strong offer', text: 'Pricing backed by recent sales and terms that sellers take seriously, without overpaying.' },
  { title: 'Inspection to closing', text: 'I coordinate attorney review, inspection, appraisal and the final walkthrough so nothing slips.' },
];

const FAQ = [
  { q: 'How much do I need for a down payment in Chicago?', a: 'Conventional loans can start at 3–5% down, FHA at 3.5%. Many condo buildings and sellers prefer 10–20%. We’ll look at what makes your offer competitive without stretching you thin.' },
  { q: 'Do I need a real estate attorney?', a: 'Yes. In Illinois, buyers and sellers each typically hire an attorney for the attorney review period and closing. I’ll refer you to several I trust.' },
  { q: 'What does it cost to work with you as a buyer?', a: 'We’ll go over compensation clearly in our first conversation and put it in a written buyer agreement, as required. In many cases the seller contributes toward it.' },
  { q: 'How long does it take to buy a home?', a: 'Most clients find a home within 30–90 days of starting to tour. Once under contract, closing usually takes 30–45 days.' },
  { q: 'What about homes not listed on Zillow?', a: 'Some of the best homes trade quietly through agent networks. I’ll flag coming-soon and off-market homes that match your search.' },
];

export function BuyPage() {
  return (
    <>
      <PageHero
        eyebrow="Buying in Chicago"
        title="Find a home that fits how you live."
        text="Search homes, run the numbers and get a clear plan from your first showing to closing day."
        image={IMAGES.livingWarm}
      >
        <ButtonLink to="#search" variant="light">Search homes</ButtonLink>
        <ButtonLink to="#mortgage" variant="outline-light">Mortgage calculator</ButtonLink>
      </PageHero>

      <SearchSection />

      <section id="mortgage" className="scroll-mt-20 bg-sand py-20 sm:py-28">
        <div className="wrap">
          <SectionHead
            eyebrow="Mortgage calculator"
            title="Know your monthly payment."
            text="Adjust the price, down payment and rate to see principal, interest, taxes, insurance and HOA in one number."
          />
          <Reveal className="mt-12">
            <MortgageCalculator />
          </Reveal>
        </div>
      </section>

      <section id="process" className="scroll-mt-20 py-20 sm:py-28">
        <div className="wrap">
          <SectionHead eyebrow="How buying works" title="Five steps to your keys." className="mb-14" />
          <Process steps={STEPS} image={IMAGES.livingLight} imageAlt="Sunlit living room" />
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 pb-20 sm:pb-28">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <Reveal>
            <Eyebrow>Buyer questions</Eyebrow>
            <h2 className="h-section">Good questions to ask.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Faq items={FAQ} />
          </Reveal>
        </div>
      </section>

      <section id="consult" className="scroll-mt-20 bg-sand py-20 sm:py-28">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="overflow-hidden rounded-3xl">
            <Img src={IMAGES.coupleKitchen} alt="A couple cooking together in their kitchen" className="aspect-[4/5] w-full object-cover sm:aspect-[4/3] lg:aspect-[4/5]" />
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow>Start here</Eyebrow>
            <h2 className="h-section">Book a free buyer consultation.</h2>
            <p className="lead mt-5 text-muted">
              Tell me what you’re looking for. I’ll set up a search with listing alerts and we’ll map out next steps.
            </p>
            <InquiryForm source="Buyer consultation" submitLabel="Book my consultation" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
