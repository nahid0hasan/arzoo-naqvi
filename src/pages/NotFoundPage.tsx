import React from 'react';
import { IMAGES } from '../data/siteData';
import { useSeo } from '../utils/router';
import { ButtonLink } from '../components/ui';

export function NotFoundPage() {
  useSeo('Page not found | Arzoo Naqvi', 'The page you were looking for could not be found.');
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-night text-white">
      <img src={IMAGES.chicagoNight} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/50 to-night/40" />
      <div className="wrap relative py-32">
        <p className="num text-[clamp(5rem,18vw,14rem)] font-medium leading-none tracking-[-0.06em] text-white/15">404</p>
        <h1 className="h-section -mt-4 max-w-xl sm:-mt-10">This address doesn’t exist.</h1>
        <p className="lead mt-5 max-w-md text-white/70">
          The page may have moved, or the listing may have sold. Let’s get you back on track.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink to="/" variant="light">Back to home</ButtonLink>
          <ButtonLink to="/buy#search" variant="outline-light">Search homes</ButtonLink>
        </div>
      </div>
    </section>
  );
}
