import React from 'react';
import { Logo } from './Logo';
import { Link, useRouter } from '../utils/router';
import { SITE } from '../config/site';
import { COLUMNS } from '../data/navigation';

export function Footer() {
  const { pathname } = useRouter();
  if (pathname === '/dashboard') return null;

  const socials = [
    { label: 'Instagram', href: SITE.instagram },
    { label: 'Facebook', href: SITE.facebook },
    { label: 'LinkedIn', href: SITE.linkedin },
    { label: 'Zillow', href: SITE.zillowProfile },
  ].filter((s) => s.href);

  return (
    <footer className="bg-night text-white">
      <div className="wrap pb-10 pt-20 sm:pt-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo light />
            <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-white/60">
              Helping people buy and sell homes across Chicago and the near suburbs, with clear advice from the
              first call to the closing table.
            </p>
            <div className="mt-8 space-y-2 text-[15px]">
              <a href={SITE.phoneHref} className="block text-white hover:text-bronze-light">
                {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="block text-white hover:text-bronze-light">
                {SITE.email}
              </a>
              <p className="text-white/50">{SITE.city}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mb-5 text-sm font-medium text-white/40">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="text-[15px] text-white/80 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-8">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {s.label}
            </a>
          ))}
        </div>

        <div className="mt-8 grid gap-4 text-xs leading-relaxed text-white/40 md:grid-cols-2">
          <p>
            {SITE.license} · {SITE.brokerage}. Equal Housing Opportunity. Listing information is deemed reliable but
            not guaranteed. Listing data courtesy of MRED LLC once IDX is connected.
          </p>
          <p className="md:text-right">
            © {new Date().getFullYear()} Arzoo Naqvi. All rights reserved. ·{' '}
            <Link to="/privacy" className="hover:text-white">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
