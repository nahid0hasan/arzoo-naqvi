import React from 'react';
import { SITE } from '../config/site';
import { useSeo } from '../utils/router';

const SECTIONS = [
  {
    h: 'Information you share',
    p: 'When you fill out a form on this site, such as a contact, tour or home valuation request, we collect the details you provide: your name, email, phone number, property address and message.',
  },
  {
    h: 'How it’s used',
    p: 'Your information is used only to respond to your request, provide real estate services and, if you opt in, send market updates. It is never sold.',
  },
  {
    h: 'Cookies and analytics',
    p: 'This site may use cookies and basic analytics to understand how visitors use it and to improve it. You can disable cookies in your browser settings.',
  },
  {
    h: 'Third-party services',
    p: 'Listing data may be provided by MRED LLC through an IDX provider. Maps are provided by Google. These services have their own privacy policies.',
  },
  {
    h: 'Your choices',
    p: `You can ask us to update or delete your information at any time by emailing ${SITE.email}.`,
  },
];

/** Simple text page — matches a default WordPress page.php template. */
export function PrivacyPage() {
  useSeo('Privacy Policy | Arzoo Naqvi', 'How Arzoo Naqvi Real Estate collects and uses information submitted through this website.');
  return (
    <>
      <section className="bg-night pb-16 pt-36 text-white sm:pb-20 sm:pt-44">
        <div className="wrap">
          <h1 className="display">Privacy policy</h1>
          <p className="mt-5 text-white/60">Last updated November 2026</p>
        </div>
      </section>
      <section className="py-16 sm:py-24">
        <div className="wrap max-w-3xl space-y-10 text-[17px] leading-[1.75] text-ink/80">
          {SECTIONS.map((s) => (
            <div key={s.h}>
              <h2 className="mb-3 text-2xl font-medium tracking-[-0.02em] text-ink">{s.h}</h2>
              <p>{s.p}</p>
            </div>
          ))}
          <p className="border-t border-stone pt-8 text-sm text-muted">
            {SITE.license} · {SITE.brokerage}. Equal Housing Opportunity. This policy is a template and should be reviewed before launch.
          </p>
        </div>
      </section>
    </>
  );
}
