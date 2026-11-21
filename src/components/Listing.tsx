import React from 'react';
import { Listing } from '../data/siteData';
import { money, monthlyPayment, number } from '../utils/format';
import { Link } from '../utils/router';
import { Img } from './ui';

export const STATUS_STYLE: Record<Listing['status'], string> = {
  'For Sale': 'bg-white/90 text-ink',
  New: 'bg-bronze text-white',
  'Open House': 'bg-ink text-white',
};

export const listingUrl = (l: Listing) => `/property/${l.id}`;

export function estimateMonthly(l: Listing) {
  const pi = monthlyPayment(l.price * 0.8, 6.5, 30);
  const tax = (l.price * 0.019) / 12;
  return pi + tax + (l.hoa ?? 0);
}

/** Property card — links to the single property page (single-property.php). */
export function ListingCard({ listing }: { listing: Listing }) {
  const url = listingUrl(listing);
  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-2xl">
        <Link to={url} className="block aspect-[4/3] w-full overflow-hidden" aria-label={`View ${listing.address}`}>
          <Img
            src={listing.images[0]}
            alt={`${listing.address}, ${listing.neighborhood}`}
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out-soft group-hover:scale-[1.04]"
          />
        </Link>
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium backdrop-blur ${STATUS_STYLE[listing.status]}`}>
          {listing.status}
        </span>
      </div>
      <Link to={url} className="mt-4 block">
        <div className="flex items-baseline justify-between gap-3">
          <p className="num text-[1.35rem] font-semibold tracking-[-0.02em] text-ink">{money(listing.price)}</p>
          <p className="num shrink-0 text-sm text-muted">~{money(estimateMonthly(listing))}/mo</p>
        </div>
        <p className="mt-1 truncate text-[15px] text-ink">{listing.address}</p>
        <p className="text-sm text-muted">{listing.neighborhood}, Chicago</p>
        <p className="num mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/80">
          <span>{listing.beds} bd</span>
          <span>{listing.baths} ba</span>
          <span>{number(listing.sqft)} sqft</span>
          <span className="text-muted">{listing.type}</span>
        </p>
      </Link>
    </article>
  );
}
