import React, { useMemo, useState } from 'react';
import { Bath, BedDouble, CalendarDays, Car, Check, Grid2x2, Home, MapPin, Maximize, Share2 } from 'lucide-react';
import { IMAGES, LISTING_FACTS, LISTINGS, NEIGHBORHOODS } from '../data/siteData';
import { SITE } from '../config/site';
import { Link, useSeo } from '../utils/router';
import { money, number } from '../utils/format';
import { ButtonLink, Eyebrow, Img, Reveal, SectionHead } from '../components/ui';
import { estimateMonthly, ListingCard, STATUS_STYLE } from '../components/Listing';
import { MortgageCalculator } from '../components/MortgageCalculator';
import { InquiryForm } from '../components/InquiryForm';
import { NotFoundPage } from './NotFoundPage';
import { Lightbox } from '../components/Lightbox';

/** Next 6 days for the tour picker. */
function nextDays() {
  const days: { value: string; day: string; date: string }[] = [];
  const d = new Date();
  for (let i = 1; i <= 6; i++) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    days.push({
      value: `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`,
      day: x.toLocaleDateString('en-US', { weekday: 'short' }),
      date: x.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });
  }
  return days;
}

function TourCard({ address }: { address: string }) {
  const days = useMemo(nextDays, []);
  const [mode, setMode] = useState<'In person' | 'Video'>('In person');
  const [day, setDay] = useState(days[0].value);
  const [time, setTime] = useState('Afternoon');

  return (
    <div className="rounded-3xl border border-stone bg-white p-5 shadow-[0_30px_60px_-35px_rgb(0_0_0/0.3)] sm:p-6">
      <div className="flex items-center gap-4">
        {/* <img src={IMAGES.portrait} alt="" className="h-14 w-14 rounded-full object-cover object-top" /> */}
        <img src={IMAGES.ArzooNaqviHome} alt="" className="h-14 w-14 rounded-full object-cover object-center" />
        <div>
          <p className="font-medium">Arzoo Naqvi</p>
          <a href={SITE.phoneHref} className="text-sm text-muted hover:text-ink">
            {SITE.phone}
          </a>
        </div>
      </div>

      <p className="h-card mt-6">Schedule a tour</p>
      <InquiryForm
        source={`Tour request: ${address}`}
        compact
        submitLabel="Request tour"
        defaultMessage=""
        extra={{ property: address, tourType: mode, date: day, time }}
      >
        <div className="grid grid-cols-2 gap-1 rounded-full bg-sand p-1">
          {(['In person', 'Video'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`h-10 rounded-full text-sm font-medium transition-colors ${mode === m ? 'bg-white text-ink shadow-sm' : 'text-muted'}`}
            >
              {m === 'Video' ? 'Video tour' : m}
            </button>
          ))}
        </div>
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1" role="radiogroup" aria-label="Tour date">
          {days.map((d) => (
            <button
              key={d.value}
              type="button"
              role="radio"
              aria-checked={day === d.value}
              onClick={() => setDay(d.value)}
              className={`flex w-[68px] shrink-0 flex-col items-center rounded-2xl border py-2.5 transition-colors ${
                day === d.value ? 'border-ink bg-ink text-white' : 'border-stone hover:border-ink/40'
              }`}
            >
              <span className={`text-xs ${day === d.value ? 'text-white/70' : 'text-muted'}`}>{d.day}</span>
              <span className="mt-0.5 text-[15px] font-semibold">{d.date.split(' ')[1]}</span>
              <span className={`text-xs ${day === d.value ? 'text-white/70' : 'text-muted'}`}>{d.date.split(' ')[0]}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Time of day">
          {['Morning', 'Afternoon', 'Evening'].map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={time === t}
              onClick={() => setTime(t)}
              className={`h-10 rounded-full border text-sm font-medium transition-colors ${time === t ? 'border-ink bg-ink text-white' : 'border-stone hover:border-ink/40'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </InquiryForm>
    </div>
  );
}

export function PropertyPage({ id }: { id: string }) {
  const listing = LISTINGS.find((l) => l.id === id);
  const [photo, setPhoto] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useSeo(
    listing ? `${listing.address}, ${listing.neighborhood} | ${money(listing.price)} | Arzoo Naqvi` : 'Home not found | Arzoo Naqvi',
    listing ? `${listing.beds} bed, ${listing.baths} bath ${listing.type.toLowerCase()} in ${listing.neighborhood}, Chicago. ${listing.description}` : '',
  );

  if (!listing) return <NotFoundPage />;

  const facts = LISTING_FACTS[listing.id];
  const hood = NEIGHBORHOODS.find((n) => n.name === listing.neighborhood);
  const similar = LISTINGS.filter((l) => l.id !== listing.id)
    .sort((a, b) => Math.abs(a.price - listing.price) - Math.abs(b.price - listing.price))
    .slice(0, 3);
  const mapQuery = encodeURIComponent(`${listing.address.split(',')[0]}, Chicago, IL`);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: listing.address, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* cancelled */
    }
  };

  const details: [string, string][] = [
    ['Price', money(listing.price)],
    ['Price per sq ft', money(listing.price / listing.sqft)],
    ['Property type', listing.type],
    ['Year built', String(facts?.yearBuilt ?? '—')],
    ['Bedrooms', String(listing.beds)],
    ['Bathrooms', String(listing.baths)],
    ['Living area', `${number(listing.sqft)} sq ft`],
    ['Parking', facts?.parking ?? '—'],
    ['Heating & cooling', facts?.heating ?? '—'],
    ['Annual taxes', facts ? money(facts.taxes) : '—'],
    ['HOA dues', listing.hoa ? `${money(listing.hoa)}/mo` : 'None'],
    ['MLS #', facts?.mls ?? '—'],
  ];

  return (
    <>
      {/* Title */}
      <section className="pt-28 sm:pt-32">
        <div className="wrap">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <Link to="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <Link to="/buy#search" className="hover:text-ink">Homes for sale</Link>
            <span>/</span>
            <span className="text-ink">{listing.address}</span>
          </nav>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[listing.status].replace('bg-white/90', 'bg-sand')}`}>
                {listing.status}
              </span>
              <h1 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.035em]">{listing.address}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-muted">
                <MapPin className="h-4 w-4" /> {listing.neighborhood}, Chicago, IL
              </p>
            </div>
            <div className="flex flex-wrap items-end gap-6 lg:flex-col lg:items-end lg:gap-3">
              <div className="lg:text-right">
                <p className="num text-[clamp(2rem,4vw,3rem)] font-semibold leading-none tracking-[-0.04em]">{money(listing.price)}</p>
                <p className="num mt-2 text-sm text-muted">Est. {money(estimateMonthly(listing))}/mo</p>
              </div>
              <button type="button" onClick={share} className="flex h-11 items-center gap-2 rounded-full border border-stone px-4 text-sm font-medium transition-colors hover:border-ink">
                <Share2 className="h-4 w-4" /> {copied ? 'Link copied' : 'Share'}
              </button>
            </div>
          </div>

          {/* Gallery mosaic */}
          <div className="relative mt-8 grid h-[56svh] min-h-[320px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl sm:h-[62svh] sm:gap-3">
            {listing.images.slice(0, 5).map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setPhoto(i)}
                aria-label={`Open photo ${i + 1}`}
                className={`group relative cursor-zoom-in overflow-hidden bg-stone ${i === 0 ? 'col-span-4 row-span-2 md:col-span-2' : 'hidden md:block'} ${
                  listing.images.length === 4 && i === 3 ? 'md:col-span-2' : ''
                }`}
              >
                <Img
                  src={src}
                  alt={i === 0 ? `${listing.address} exterior` : `${listing.address} photo ${i + 1}`}
                  eager={i === 0}
                  className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out-soft group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPhoto(0)}
              className="absolute bottom-4 right-4 flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-ink shadow-lg transition-transform hover:scale-[1.03]"
            >
              <Grid2x2 className="h-4 w-4" /> View all {listing.images.length} photos
            </button>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-14 sm:py-20">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_380px] lg:gap-16">
          <div className="min-w-0">
            <div className="num grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-stone bg-stone sm:grid-cols-4">
              {[
                { Icon: BedDouble, v: listing.beds, l: 'Bedrooms' },
                { Icon: Bath, v: listing.baths, l: 'Bathrooms' },
                { Icon: Maximize, v: number(listing.sqft), l: 'Sq ft' },
                { Icon: CalendarDays, v: facts?.yearBuilt ?? '—', l: 'Year built' },
              ].map(({ Icon, v, l }) => (
                <div key={l} className="bg-white p-5">
                  <Icon className="h-5 w-5 text-bronze" />
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.02em]">{v}</p>
                  <p className="text-sm text-muted">{l}</p>
                </div>
              ))}
            </div>

            <div className="mt-14">
              <h2 className="h-card">About this home</h2>
              <p className="lead mt-4 text-ink/80">{listing.description}</p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {listing.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 rounded-xl bg-sand px-4 py-3 text-[15px]">
                    <Check className="h-4 w-4 shrink-0 text-bronze" strokeWidth={2.5} /> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-14">
              <h2 className="h-card">Property details</h2>
              <dl className="mt-5 grid border-t border-stone sm:grid-cols-2 sm:gap-x-10">
                {details.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-stone py-3.5 text-[15px]">
                    <dt className="text-muted">{k}</dt>
                    <dd className="num text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div id="photos" className="mt-14 scroll-mt-24">
              <h2 className="h-card">Photos</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {listing.images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setPhoto(i)}
                    aria-label={`Open photo ${i + 1}`}
                    className={`group cursor-zoom-in overflow-hidden rounded-2xl ${i % 3 === 0 ? 'sm:col-span-2' : ''}`}
                  >
                    <Img
                      src={src}
                      alt={`${listing.address} photo ${i + 1}`}
                      className={`w-full object-cover transition-transform duration-[1.2s] ease-out-soft group-hover:scale-[1.03] ${i % 3 === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-14">
              <h2 className="h-card">Location</h2>
              <p className="mt-2 text-muted">
                {listing.address}, {listing.neighborhood}
              </p>
              <div className="mt-5 overflow-hidden rounded-2xl border border-stone">
                <iframe
                  title={`Map of ${listing.address}`}
                  src={`https://www.google.com/maps?q=${mapQuery}&z=15&output=embed`}
                  className="h-80 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <TourCard address={listing.address} />
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-sand p-4 text-sm">
              <Car className="h-5 w-5 shrink-0 text-bronze" />
              <span>{facts?.parking ?? 'Parking details on request'}</span>
            </div>
          </aside>
        </div>
      </section>

      {/* Mortgage */}
      <section className="bg-sand py-20 sm:py-24">
        <div className="wrap">
          <SectionHead eyebrow="Payment calculator" title="What this home could cost per month." />
          <Reveal className="mt-10">
            <MortgageCalculator key={listing.id} initialPrice={listing.price} initialTax={facts?.taxes} initialHoa={listing.hoa ?? 0} />
          </Reveal>
        </div>
      </section>

      {/* Neighborhood */}
      {hood && (
        <section className="py-20 sm:py-24">
          <div className="wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <Reveal className="overflow-hidden rounded-3xl">
              <Img src={hood.image} alt={hood.name} className="aspect-[16/11] w-full object-cover" />
            </Reveal>
            <Reveal delay={0.1}>
              <Eyebrow>The neighborhood</Eyebrow>
              <h2 className="h-section">{hood.name}</h2>
              <p className="lead mt-5 text-muted">{hood.description}</p>
              <div className="mt-8">
                <ButtonLink to={`/chicago/${hood.id}`} variant="outline">
                  Explore {hood.name}
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Similar */}
      <section className={`pb-20 sm:pb-28 ${hood ? '' : 'pt-20 sm:pt-28'}`}>
        <div className="wrap">
          <SectionHead
            eyebrow="You may also like"
            title="Similar homes"
            action={<ButtonLink to="/buy#search" variant="outline">All homes</ButtonLink>}
          />
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((l, i) => (
              <Reveal key={l.id} delay={i * 0.05}>
                <ListingCard listing={l} />
              </Reveal>
            ))}
          </div>
          <p className="mt-12 flex items-start gap-2 text-xs text-muted">
            <Home className="mt-px h-3.5 w-3.5 shrink-0" />
            Sample listing for preview. Information deemed reliable but not guaranteed. Live listing data courtesy of MRED LLC once IDX is connected.
          </p>
        </div>
      </section>

      <Lightbox images={listing.images} index={photo} onIndex={setPhoto} onClose={() => setPhoto(null)} title={listing.address} />
    </>
  );
}
