import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Search, Star } from 'lucide-react';
import { IMAGES, LISTINGS, LISTING_NEIGHBORHOODS, NEIGHBORHOODS, POSTS } from '../data/siteData';
import { PostCard } from './BlogPage';
import { SITE } from '../config/site';
import { Link, useRouter } from '../utils/router';
import { compactMoney, money, monthlyPayment, rangeFill } from '../utils/format';
import { ButtonLink, Eyebrow, Img, Reveal, SectionHead, TextLink } from '../components/ui';
import { ListingCard } from '../components/Listing';
import { ClosingCta } from '../components/Sections';
import { opts, Select } from '../components/Select';

// const SLIDES = [
//   { src: IMAGES.penthouseSkyline, caption: 'River North' },
//   { src: IMAGES.brownstoneStreet, caption: 'Lincoln Park' },
//   { src: IMAGES.chicagoRiver, caption: 'Chicago River' },
//   { src: IMAGES.goldCoastSalon, caption: 'Gold Coast' },
// ];
// const SLIDE_MS = 6500;



const SLIDES = [
  { src: IMAGES.arzooChicagoPenthouse, caption: 'Chicago Penthouse' },
  { src: IMAGES.arzooChicagoResidence, caption: 'Lincoln Park' },
  { src: IMAGES.arzooGardenLifestyle, caption: 'Garden Lifestyle' },
  { src: IMAGES.arzooLuxuryInterior, caption: 'Luxury Interior' },
  // { src: IMAGES.arzooModernExterior, caption: 'Chicago River' },
];

const SLIDE_MS = 6500;

/* --------------------------------- Hero ----------------------------------- */

function Hero() {
  const { navigate } = useRouter();
  const [slide, setSlide] = useState(0);
  const [area, setArea] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [beds, setBeds] = useState('');

  useEffect(() => {
    if (SITE.heroVideo) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(t);
  }, []);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (area) q.set('area', area);
    if (maxPrice) q.set('max', maxPrice);
    if (beds) q.set('beds', beds);
    navigate(`/buy?${q.toString()}#search`);
  };

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-night text-white">
      {SITE.heroVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={SITE.heroVideo}
          poster={SLIDES[0].src}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <AnimatePresence initial={false}>
          <motion.div
            key={slide}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
          >
            <img
              src={SLIDES[slide].src}
              alt=""
              className="kenburns h-full w-full object-cover"
              {...(slide === 0 ? { fetchPriority: 'high' as const } : {})}
            />
          </motion.div>
        </AnimatePresence>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" />

      <div className="wrap relative pb-8 pt-32 sm:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <Eyebrow light>Arzoo Naqvi · Chicago Realtor</Eyebrow>
          <h1 className="display">
            Find your place
            <br className="hidden sm:block" /> in Chicago.
          </h1>
          <p className="lead mt-6 max-w-xl text-white/80">
            Buying your first condo or selling the family home, you’ll get honest advice, local knowledge and
            someone who picks up the phone.
          </p>
        </motion.div>

        <motion.form
          onSubmit={search}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 mt-10 max-w-4xl rounded-3xl bg-white/95 p-2 text-ink shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)] ring-1 ring-white/40 backdrop-blur-xl sm:rounded-full"
          aria-label="Search homes"
        >
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-[1.5fr_1fr_1fr_auto] sm:items-center sm:gap-0">
            <Select
              variant="hero"
              label="Location"
              icon={<MapPin className="h-[18px] w-[18px]" />}
              value={area}
              onChange={setArea}
              options={[{ value: "", label: "All neighborhoods" }, ...opts(LISTING_NEIGHBORHOODS)]}
              className="col-span-2 sm:col-span-1 sm:border-r sm:border-stone sm:pr-1"
            />
            <Select
              variant="hero"
              label="Max price"
              value={maxPrice}
              onChange={setMaxPrice}
              options={[{ value: "", label: "Any price" }, ...opts([750000, 1000000, 1500000, 2000000, 3000000], (p) => `Up to ${compactMoney(+p)}`)]}
              className="border-t border-stone sm:border-r sm:border-t-0 sm:px-1"
            />
            <Select
              variant="hero"
              label="Bedrooms"
              value={beds}
              onChange={setBeds}
              options={[{ value: "", label: "Any" }, ...opts([1, 2, 3, 4, 5], (b) => `${b}+ beds`)]}
              className="border-t border-stone sm:border-t-0 sm:pl-1"
            />
            <button
              type="submit"
              className="col-span-2 mt-1 flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-ink px-8 text-[15px] font-medium text-white transition-colors hover:bg-ink-soft sm:col-span-1 sm:mt-0 sm:ml-2 sm:h-16 sm:rounded-full"
            >
              <Search className="h-[18px] w-[18px]" /> Search
            </button>
          </div>
        </motion.form>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-white/15 pt-6">
          <Link to="/sell#valuation" className="group inline-flex items-center gap-2 text-[15px] font-medium text-white">
            Selling? Find out what your home is worth
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          {!SITE.heroVideo && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/60">{SLIDES[slide].caption}</span>
              <div className="flex gap-1.5">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.caption}
                    type="button"
                    onClick={() => setSlide(i)}
                    aria-label={`Show ${s.caption}`}
                    className="relative h-[3px] w-8 overflow-hidden rounded-full bg-white/25"
                  >
                    {i === slide && (
                      <motion.span
                        key={`bar-${slide}`}
                        className="absolute inset-y-0 left-0 bg-white"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Introduction ------------------------------ */

function Intro() {
  return (
    <section className="py-24 sm:py-32">
      <div className="wrap grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-5">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl">
              {/* <Img src={IMAGES.portrait} alt="Arzoo Naqvi" className="h-full w-full object-cover object-top" /> */}
              <Img src={IMAGES.ArzooNaqviHome} alt="Arzoo Naqvi" className="h-full w-full object-cover object-center" />
            </div>
            <div className="absolute -bottom-6 -right-3 hidden w-48 overflow-hidden rounded-2xl border-[6px] border-paper sm:block lg:-right-10">
              <Img src={IMAGES.lincolnParkWalk} alt="" className="aspect-square h-full w-full object-cover" />
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-7">
          <Eyebrow>Meet Arzoo</Eyebrow>
          <p className="text-[clamp(1.6rem,3vw,2.5rem)] font-medium leading-[1.2] tracking-[-0.03em]">
            I help people buy and sell homes in Chicago with{' '}
            <span className="text-muted">straight answers, real neighborhood knowledge and a plan that fits their life.</span>
          </p>
          <div className="mt-10 grid gap-8 border-t border-stone pt-8 sm:grid-cols-3">
            {[
              { t: 'Local', d: 'I live and work in the neighborhoods I sell in.' },
              { t: 'Responsive', d: 'Calls and texts answered the same day.' },
              { t: 'Clear', d: 'No pressure, no jargon, no surprises at closing.' },
            ].map((v) => (
              <div key={v.t}>
                <p className="font-medium">{v.t}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{v.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <ButtonLink to="/about">More about me</ButtonLink>
            <TextLink to="/contact">Book a call</TextLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------- Buyers / Sellers tabs ------------------------ */

const PATHS = {
  buying: {
    label: 'I’m buying',
    title: 'Buy with a plan, not a guess.',
    text: 'From your first showing to the keys, I’ll help you know what a home is really worth and how to win it.',
    image: IMAGES.coupleKitchen,
    cta: { label: 'Buyer guide', to: '/buy' },
    links: [
      { title: 'Search homes for sale', text: 'Browse homes across Chicago with filters.', to: '/buy#search' },
      { title: 'Mortgage calculator', text: 'See your monthly payment in seconds.', to: '/buy#mortgage' },
      { title: 'How buying works', text: 'The steps from pre-approval to closing.', to: '/buy#process' },
      { title: 'Neighborhood guides', text: 'Find the part of the city that fits you.', to: '/chicago' },
    ],
  },
  selling: {
    label: 'I’m selling',
    title: 'Sell for the right price, on your timeline.',
    text: 'Pricing, preparation, marketing and negotiation, handled so you can focus on what comes next.',
    image: IMAGES.brownstoneStreet,
    cta: { label: 'Seller guide', to: '/sell' },
    links: [
      { title: 'What’s my home worth?', text: 'A real valuation based on homes selling near you.', to: '/sell#valuation' },
      { title: 'Net proceeds calculator', text: 'Estimate what you walk away with after costs.', to: '/sell#net-proceeds' },
      { title: 'Seller checklist', text: 'The essentials for getting your home ready.', to: '/sell#checklist' },
      { title: 'Market snapshot', text: 'What’s happening in your neighborhood right now.', to: '/chicago#market' },
    ],
  },
} as const;

function BuySellTabs() {
  const [tab, setTab] = useState<keyof typeof PATHS>('buying');
  const p = PATHS[tab];
  return (
    <section className="bg-sand py-24 sm:py-32">
      <div className="wrap">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <h2 className="h-section max-w-xl">How can I help?</h2>
          </Reveal>
          <div role="tablist" aria-label="Buying or selling" className="inline-flex self-start rounded-full bg-white p-1.5 shadow-sm md:self-auto">
            {(Object.keys(PATHS) as (keyof typeof PATHS)[]).map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                onClick={() => setTab(k)}
                className="relative h-11 rounded-full px-6 text-[15px] font-medium"
              >
                {tab === k && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }} />}
                <span className={`relative transition-colors ${tab === k ? 'text-white' : 'text-muted'}`}>{PATHS[k].label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            role="tabpanel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 grid gap-6 lg:grid-cols-2"
          >
            <Link to={p.cta.to} className="group relative min-h-[420px] overflow-hidden rounded-3xl bg-night text-white lg:min-h-[560px]">
              <img src={p.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out-soft group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10">
                <h3 className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.03em]">{p.title}</h3>
                <p className="mt-3 max-w-md text-white/75">{p.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-medium">
                  {p.cta.label} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {p.links.map((l) => (
                <Link
                  key={l.title}
                  to={l.to}
                  className="group flex items-center justify-between gap-6 rounded-2xl border border-transparent bg-white p-6 transition-all duration-300 hover:border-ink sm:p-7"
                >
                  <div>
                    <h3 className="text-xl font-medium tracking-[-0.02em]">{l.title}</h3>
                    <p className="mt-1.5 text-[15px] text-muted">{l.text}</p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand transition-colors group-hover:bg-ink group-hover:text-white">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ---------------------------- Featured listings --------------------------- */

function FeaturedHomes() {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="overflow-hidden py-24 sm:py-32">
      <div className="wrap">
        <SectionHead
          eyebrow="Homes for sale"
          title="Recently listed around the city"
          action={
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => scroll(-1)} aria-label="Previous homes" className="flex h-12 w-12 items-center justify-center rounded-full border border-stone transition-colors hover:border-ink">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => scroll(1)} aria-label="More homes" className="flex h-12 w-12 items-center justify-center rounded-full border border-stone transition-colors hover:border-ink">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          }
        />
      </div>
      <div
        ref={track}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 sm:gap-6 sm:px-8 lg:px-[max(48px,calc((100vw-1320px)/2+48px))]"
      >
        {LISTINGS.map((l) => (
          <div key={l.id} className="w-[82vw] shrink-0 snap-start sm:w-[400px]">
            <ListingCard listing={l} />
          </div>
        ))}
        <div className="w-px shrink-0" aria-hidden="true" />
      </div>
      <div className="wrap mt-12 flex flex-wrap items-center gap-4">
        <ButtonLink to="/buy#search">See all homes</ButtonLink>
        {SITE.zillowProfile && (
          <ButtonLink to={SITE.zillowProfile} variant="outline">
            Browse on Zillow
          </ButtonLink>
        )}
      </div>
    </section>
  );
}

/* ------------------------------ Neighborhoods ----------------------------- */

function Neighborhoods() {
  const names = [...NEIGHBORHOODS.map((n) => n.name), 'Bucktown', 'Wicker Park', 'Old Town', 'Streeterville', 'South Loop', 'Oak Park'];
  return (
    <section className="bg-night py-24 text-white sm:py-32">
      <div className="wrap">
        <SectionHead
          light
          eyebrow="Know the city"
          title="Every neighborhood has its own pace."
          text="Lakefront high-rises, boulevard greystones and warehouse lofts. Here’s where my clients are buying right now."
          action={<ButtonLink to="/chicago" variant="light">Neighborhood guide</ButtonLink>}
        />

        <div className="mt-14 grid auto-rows-[220px] grid-cols-2 gap-3 sm:auto-rows-[260px] sm:gap-4 lg:grid-cols-4">
          {NEIGHBORHOODS.map((n, i) => (
            <Reveal
              key={n.id}
              delay={i * 0.05}
              className={i === 0 ? 'col-span-2 row-span-2' : i === 3 ? 'col-span-2 lg:col-span-1' : ''}
            >
              <Link to={`/chicago/${n.id}`} className="group relative block h-full overflow-hidden rounded-2xl">
                <Img src={n.image} alt={n.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out-soft group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6">
                  <div>
                    <h3 className={`${i === 0 ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'} font-medium tracking-[-0.03em]`}>{n.name}</h3>
                    <p className="mt-1 hidden text-sm text-white/70 sm:block">{n.short}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-20 overflow-hidden border-y border-white/10 py-6" aria-hidden="true">
        <div className="marquee flex w-max gap-10 whitespace-nowrap">
          {[...names, ...names].map((n, i) => (
            <span key={i} className="flex items-center gap-10 text-[clamp(1.75rem,3.5vw,3rem)] font-medium tracking-[-0.03em] text-white/25">
              {n} <span className="h-2 w-2 rounded-full bg-bronze-light/60" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Mini calculator ---------------------------- */

function AffordabilityTeaser() {
  const [price, setPrice] = useState(650000);
  const [down, setDown] = useState(20);
  const monthly = useMemo(() => {
    const loan = price * (1 - down / 100);
    return monthlyPayment(loan, 6.5, 30) + (price * 0.019) / 12 + 150;
  }, [price, down]);

  return (
    <section className="py-24 sm:py-32">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <Eyebrow>Mortgage calculator</Eyebrow>
          <h2 className="h-section">What would you pay each month?</h2>
          <p className="lead mt-5 max-w-md text-muted">
            Move the sliders for a quick estimate including taxes and insurance. The full calculator lets you
            adjust everything.
          </p>
          <div className="mt-9">
            <ButtonLink to="/buy#mortgage">Open full calculator</ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-[var(--calc-border)] bg-[var(--calc-card)] p-6 sm:p-10">
            <div className="space-y-8">
              {[
                { label: 'Home price', value: price, min: 200000, max: 3000000, step: 10000, set: setPrice, show: money(price) },
                { label: 'Down payment', value: down, min: 3, max: 50, step: 1, set: setDown, show: `${down}%` },
              ].map((s) => (
                <div key={s.label}>
                  <div className="mb-3 flex justify-between text-sm">
                    <span className="font-medium">{s.label}</span>
                    <span className="num font-semibold">{s.show}</span>
                  </div>
                  <input
                    type="range"
                    className="range"
                    aria-label={s.label}
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={s.value}
                    style={rangeFill(s.value, s.min, s.max)}
                    onChange={(e) => s.set(Number(e.target.value))}
                  />
                </div>
              ))}
            </div>
            <div className="mt-10 flex items-end justify-between gap-4 rounded-2xl bg-[var(--calc-summary)] p-6 text-white">
              <div>
                <p className="text-sm text-white/60">Estimated monthly</p>
                <p className="num mt-1 text-[clamp(2.25rem,5vw,3rem)] font-semibold leading-none tracking-[-0.04em]">{money(monthly)}</p>
              </div>
              <p className="text-right text-xs text-white/50">
                6.5% · 30-yr fixed
                <br />
                incl. tax & insurance
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ Home value CTA ---------------------------- */

function HomeValue() {
  const { navigate } = useRouter();
  const [address, setAddress] = useState('');
  return (
    <section className="bg-sand py-24 sm:py-32">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] overflow-hidden rounded-3xl">
              <Img src={IMAGES.greystoneDusk} alt="Chicago greystone at dusk" className="h-full w-full object-cover" />
            </div>
            <div className="mt-12 aspect-[3/4] overflow-hidden rounded-3xl">
              <Img src={IMAGES.livingArched} alt="Bright living room" className="h-full w-full object-cover" />
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="order-1 lg:order-2">
          <Eyebrow>For sellers</Eyebrow>
          <h2 className="h-section">What’s your home worth today?</h2>
          <p className="lead mt-5 max-w-md text-muted">
            Online estimates can miss by tens of thousands. Get a real number from someone who has walked the
            comparable homes, within 24 hours.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/sell?address=${encodeURIComponent(address)}#valuation`);
            }}
            className="mt-9 flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-sm sm:flex-row sm:rounded-full"
          >
            <label className="flex flex-1 items-center gap-2 px-4">
              <MapPin className="h-4 w-4 shrink-0 text-bronze" />
              <span className="sr-only">Your address</span>
              <input
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your home address"
                autoComplete="street-address"
                className="h-12 w-full bg-transparent text-[15px] focus:outline-none"
              />
            </label>
            <button type="submit" className="h-12 rounded-full bg-ink px-6 text-[15px] font-medium text-white hover:bg-ink-soft">
              Get my value
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------- Reviews -------------------------------- */

function Reviews() {
  if (!SITE.zillowReviews) return null;
  return (
    <section className="py-20 sm:py-24">
      <div className="wrap">
        <Reveal className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-stone p-8 sm:p-12 md:flex-row md:items-center">
          <div>
            <div className="flex gap-1 text-bronze" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <h2 className="mt-4 text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium tracking-[-0.03em]">Hear it from my clients.</h2>
            <p className="mt-2 max-w-lg text-muted">Verified reviews from buyers and sellers I’ve worked with are on my Zillow profile.</p>
          </div>
          <ButtonLink to={SITE.zillowReviews} variant="outline">
            Read reviews on Zillow
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

function FromTheBlog() {
  return (
    <section className="pb-24 sm:pb-32">
      <div className="wrap">
        <SectionHead eyebrow="From the blog" title="Advice for your next move" action={<ButtonLink to="/blog" variant="outline">All articles</ButtonLink>} />
        <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
          {POSTS.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <PostCard post={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <BuySellTabs />
      <FeaturedHomes />
      <Neighborhoods />
      <AffordabilityTeaser />
      <HomeValue />
      <Reviews />
      <FromTheBlog />
      <ClosingCta />
    </>
  );
}
