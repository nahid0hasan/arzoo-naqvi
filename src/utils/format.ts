import type { CSSProperties } from 'react';

export const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
    Math.round(n),
  );

export const compactMoney = (n: number) =>
  n >= 1_000_000 ? `$${parseFloat((n / 1_000_000).toFixed(2))}M` : `$${Math.round(n / 1000)}K`;

export const number = (n: number) => new Intl.NumberFormat('en-US').format(n);

/** Standard amortized monthly principal + interest. */
export function monthlyPayment(principal: number, annualRatePct: number, years: number) {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (principal <= 0) return 0;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export const rangeFill = (value: number, min: number, max: number) =>
  ({ '--fill': `${((value - min) / (max - min)) * 100}%` }) as CSSProperties;
