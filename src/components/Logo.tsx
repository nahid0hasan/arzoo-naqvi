import React from 'react';

/** Arzoo Naqvi wordmark with an A/N monogram (the N's diagonal doubles as a roofline). */
export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  const fg = light ? '#FBFAF7' : '#121212';
  const accent = light ? '#C9A877' : '#93714A';
  return (
    <span className={`inline-flex items-center gap-3 ${light ? 'text-paper' : 'text-ink'}`}>
      <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
        <rect x="1.5" y="1.5" width="61" height="61" rx="12" fill="none" stroke={fg} strokeOpacity="0.9" strokeWidth="2.5" />
        <path d="M14 46 26 18h3l12 28" fill="none" stroke={fg} strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M36 46V18l14 28V18" fill="none" stroke={accent} strokeWidth="3.5" strokeLinejoin="round" />
      </svg>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[17px] font-semibold tracking-[-0.02em]">Arzoo Naqvi</span>
          <span className={`mt-1 text-[10.5px] font-medium uppercase tracking-[0.22em] ${light ? 'text-paper/60' : 'text-muted'}`}>
            Chicago Real Estate
          </span>
        </span>
      )}
    </span>
  );
}
