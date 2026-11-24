import React, { useId, useMemo, useState } from 'react';
import { money } from '../utils/format';
import {
  calculateMortgage,
  MORTGAGE_LIMITS,
  MORTGAGE_TERMS,
  MortgageTerm,
  validateMortgageInputs,
} from '../utils/mortgage';
import { inputClass } from './ui';
import './MortgageCalculator.css';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const preciseMoney = (value: number) => currency.format(value);
const parseInput = (value: string) => (value.trim() === '' ? Number.NaN : Number(value));
const roundedInput = (value: number) => String(Math.round(value * 100) / 100);

function precisionError(value: string) {
  const decimals = value.match(/\.(\d+)/)?.[1];
  return decimals && decimals.length > 2 ? 'Use no more than two decimal places.' : undefined;
}

function sliderValue(value: string, min: number, max: number) {
  const numericValue = parseInput(value);
  if (!Number.isFinite(numericValue)) return min;
  return Math.min(max, Math.max(min, numericValue));
}

function rangeStyle(value: number, min: number, max: number): React.CSSProperties & { '--mortgage-fill': string } {
  const progress = max > min ? (value - min) / (max - min) : 0;
  const clampedProgress = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  return { '--mortgage-fill': `${Number((clampedProgress * 100).toFixed(4))}%` };
}

interface NumericInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: string;
  hint?: string;
}

function NumericInput({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  error,
  min = 0,
  max,
  step = '0.01',
  hint,
}: NumericInputProps) {
  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-2 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between">
        <label htmlFor={id} className="min-w-0 text-sm font-medium text-ink">
          {label}
        </label>
        <div
          className={`relative w-full min-[400px]:shrink-0 ${
            suffix ? 'min-[400px]:w-28 sm:w-30' : 'min-[400px]:w-40 sm:w-44'
          }`}
        >
          {prefix && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
              {prefix}
            </span>
          )}
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`${inputClass} mortgage-number-input num text-right ${prefix ? 'pl-9' : ''} ${suffix ? 'pr-9' : ''} ${error ? 'border-red-700' : ''}`}
          />
          {suffix && (
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">
              {suffix}
            </span>
          )}
        </div>
      </div>
      {hint && <p className="mt-1 text-xs leading-relaxed text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs leading-relaxed text-red-800" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface RangeSliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
  onChange: (value: number) => void;
}

function RangeSlider({ id, label, value, min, max, step, minLabel, maxLabel, onChange }: RangeSliderProps) {
  return (
    <div className="mt-2">
      <input
        id={id}
        type="range"
        className="mortgage-range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        style={rangeStyle(value, min, max)}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="mt-1 flex justify-between gap-3 text-xs text-muted">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

interface PaymentPart {
  label: string;
  value: number;
}

const PAYMENT_COLORS: Record<PaymentPart['label'], string> = {
  'Principal & interest': '#c9a877',
  'Property tax': '#93714a',
  'Home insurance': '#e3ddd3',
  'HOA dues': '#6e685f',
  PMI: '#fbfaf7',
};

function PaymentDonut({ parts, total }: { parts: PaymentPart[]; total: number }) {
  const radius = 49;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg
      viewBox="0 0 128 128"
      className="h-40 w-40 shrink-0"
      role="img"
      aria-label="Monthly payment breakdown chart"
    >
      <circle cx="64" cy="64" r={radius} fill="none" stroke="#2a2927" strokeWidth="12" />
      {total > 0 && (
        <g transform="rotate(-90 64 64)">
          {parts.map((part) => {
            const length = (part.value / total) * circumference;
            const dashOffset = offset;
            offset += length;
            return (
              <circle
                key={part.label}
                cx="64"
                cy="64"
                r={radius}
                fill="none"
                stroke={PAYMENT_COLORS[part.label]}
                strokeWidth="12"
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-dashOffset}
              />
            );
          })}
        </g>
      )}
      <text x="64" y="61" textAnchor="middle" fill="#fbfaf7" className="fill-paper text-[10px]">
        MONTHLY
      </text>
      <text x="64" y="76" textAnchor="middle" fill="#fbfaf7" className="fill-paper text-[12px] font-medium">
        {total > 0 ? 'ESTIMATE' : '$0.00'}
      </text>
    </svg>
  );
}

function PaymentBreakdown({ parts, total }: { parts: PaymentPart[]; total: number }) {
  return (
    <section className="mt-5 flex flex-1 flex-col rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-medium text-white">Monthly breakdown</h3>
        <span className="text-xs text-white/45">Share of payment</span>
      </div>
      <div className="mt-5 flex flex-1 flex-col items-center justify-center gap-5 xl:flex-row xl:items-stretch xl:justify-between">
        <PaymentDonut parts={parts} total={total} />
        {parts.length > 0 && total > 0 ? (
          <ul className="w-full min-w-0 space-y-4 xl:flex xl:flex-1 xl:flex-col xl:justify-evenly xl:space-y-0">
            {parts.map((part) => (
              <li key={part.label} className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: PAYMENT_COLORS[part.label] }}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-medium text-white/80 sm:text-base">
                      {part.label}
                    </span>
                    <span className="num mt-1 block text-[13px] text-white/50">
                      {((part.value / total) * 100).toFixed(1)}% of payment
                    </span>
                  </span>
                </span>
                <span className="num shrink-0 text-[15px] font-medium text-white sm:text-base">
                  {preciseMoney(part.value)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-white/60 xl:flex-1">No monthly payment costs to break down.</p>
        )}
      </div>
    </section>
  );
}

function SummaryDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs text-white/50">{label}</p>
      <p className="num mt-1.5 break-words text-[15px] font-medium text-white sm:text-base">{value}</p>
    </div>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  const progress = max > min ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)) : 0;
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="num text-[15px] font-semibold text-ink">{display}</span>
      </div>
      <input
        type="range"
        className="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ '--fill': `${progress}%` } as React.CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

export function MortgageCalculator({
  initialPrice = 750000,
  initialTax,
  initialHoa = 0,
}: {
  initialPrice?: number;
  initialTax?: number;
  initialHoa?: number;
}) {
  const idPrefix = useId().replace(/:/g, '');
  const [priceInput, setPriceInput] = useState(String(initialPrice));
  const [downPaymentInput, setDownPaymentInput] = useState(roundedInput(initialPrice * 0.2));
  const [downPercentInput, setDownPercentInput] = useState('20');
  const [downPaymentMode, setDownPaymentMode] = useState<'amount' | 'percent'>('percent');
  const [rateInput, setRateInput] = useState('6.5');
  const [term, setTerm] = useState<MortgageTerm>(30);
  const [taxInput, setTaxInput] = useState(String(initialTax ?? Math.round(initialPrice * 0.019)));
  const [insuranceInput, setInsuranceInput] = useState('1800');
  const [hoaInput, setHoaInput] = useState(String(initialHoa));
  const [pmiRateInput, setPmiRateInput] = useState('0.6');

  const price = parseInput(priceInput);
  const downPayment = parseInput(downPaymentInput);
  const downPercent = parseInput(downPercentInput);
  const rate = parseInput(rateInput);
  const taxYear = parseInput(taxInput);
  const insuranceYear = parseInput(insuranceInput);
  const hoa = parseInput(hoaInput);
  const pmiRate = parseInput(pmiRateInput);
  const inputs = {
    homePrice: price,
    downPayment,
    annualInterestRate: rate,
    loanTermYears: term,
    annualPropertyTax: taxYear,
    annualHomeInsurance: insuranceYear,
    monthlyHOA: hoa,
    annualPMIRate: pmiRate,
  };

  const errors = validateMortgageInputs(inputs);
  const downPercentError = !Number.isFinite(downPercent)
    ? 'Enter a down payment percentage.'
    : downPercent < MORTGAGE_LIMITS.downPaymentPercent.min ||
        downPercent > MORTGAGE_LIMITS.downPaymentPercent.max
      ? 'Enter a percentage from 0% to 100%.'
      : precisionError(downPercentInput);
  const precisionErrors: [keyof typeof inputs, string | undefined][] = [
    ['homePrice', precisionError(priceInput)],
    ['downPayment', precisionError(downPaymentInput)],
    ['annualInterestRate', precisionError(rateInput)],
    ['annualPropertyTax', precisionError(taxInput)],
    ['annualHomeInsurance', precisionError(insuranceInput)],
    ['monthlyHOA', precisionError(hoaInput)],
    ['annualPMIRate', precisionError(pmiRateInput)],
  ];
  for (const [field, error] of precisionErrors) {
    if (error) errors[field] = error;
  }

  const hasErrors = Object.keys(errors).length > 0 || Boolean(downPercentError);
  const result = useMemo(
    () => (hasErrors ? null : calculateMortgage(inputs)),
    [
      hasErrors,
      price,
      downPayment,
      rate,
      term,
      taxYear,
      insuranceYear,
      hoa,
      pmiRate,
    ],
  );

  const updatePrice = (value: string) => {
    setPriceInput(value);
    const newPrice = parseInput(value);
    if (!Number.isFinite(newPrice) || newPrice <= 0) return;
    if (downPaymentMode === 'percent') {
      const percent = parseInput(downPercentInput);
      if (Number.isFinite(percent)) setDownPaymentInput(roundedInput((newPrice * percent) / 100));
    } else {
      const amount = parseInput(downPaymentInput);
      if (Number.isFinite(amount)) setDownPercentInput(roundedInput((amount / newPrice) * 100));
    }
  };

  const updateDownPayment = (value: string) => {
    setDownPaymentInput(value);
    setDownPaymentMode('amount');
    const amount = parseInput(value);
    if (Number.isFinite(amount) && Number.isFinite(price) && price > 0) {
      setDownPercentInput(roundedInput((amount / price) * 100));
    }
  };

  const updateDownPercent = (value: string) => {
    setDownPercentInput(value);
    setDownPaymentMode('percent');
    const percent = parseInput(value);
    if (Number.isFinite(percent) && Number.isFinite(price)) {
      setDownPaymentInput(roundedInput((price * percent) / 100));
    }
  };

  const onPriceSlider = (value: number) => updatePrice(String(value));
  const onDownPercentSlider = (value: number) => updateDownPercent(String(value));
  const parts: PaymentPart[] = result
    ? [
        { label: 'Principal & interest', value: result.monthlyPrincipalAndInterest },
        { label: 'Property tax', value: result.monthlyPropertyTax },
        { label: 'Home insurance', value: result.monthlyHomeInsurance },
        { label: 'HOA dues', value: result.monthlyHOA },
        { label: 'PMI', value: result.monthlyPMI },
      ].filter((part) => part.value > 0)
    : [];

  return (
    <div className="mortgage-calculator grid overflow-hidden rounded-3xl border border-stone bg-white lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-7 p-6 sm:p-8 lg:p-10">
        <div>
          <NumericInput
            id={`${idPrefix}-home-price`}
            label="Home price"
            value={priceInput}
            onChange={updatePrice}
            prefix="$"
            error={errors.homePrice}
            min={MORTGAGE_LIMITS.homePrice.min}
            max={MORTGAGE_LIMITS.homePrice.max}
            step="any"
          />
          <RangeSlider
            id={`${idPrefix}-home-price-range`}
            label="Home price"
            value={sliderValue(priceInput, MORTGAGE_LIMITS.homePrice.min, MORTGAGE_LIMITS.homePrice.max)}
            min={MORTGAGE_LIMITS.homePrice.min}
            max={MORTGAGE_LIMITS.homePrice.max}
            step={5000}
            minLabel={money(MORTGAGE_LIMITS.homePrice.min)}
            maxLabel={money(MORTGAGE_LIMITS.homePrice.max)}
            onChange={onPriceSlider}
          />
          <p className="mt-1 text-right text-[11px] text-muted">Slider increments: $5,000. Typed values stay exact.</p>
        </div>

        <div>
          <div className="grid gap-4 2xl:grid-cols-2">
            <NumericInput
              id={`${idPrefix}-down-payment`}
              label="Down payment amount"
              value={downPaymentInput}
              onChange={updateDownPayment}
              prefix="$"
              error={errors.downPayment}
              max={Number.isFinite(price) ? price : undefined}
            />
            <NumericInput
              id={`${idPrefix}-down-payment-percent`}
              label="Down payment percent"
              value={downPercentInput}
              onChange={updateDownPercent}
              suffix="%"
              error={downPercentError}
              min={0}
              max={100}
            />
          </div>
          <RangeSlider
            id={`${idPrefix}-down-payment-range`}
            label="Down payment percentage"
            value={sliderValue(downPercentInput, MORTGAGE_LIMITS.downPaymentPercent.min, MORTGAGE_LIMITS.downPaymentPercent.max)}
            min={MORTGAGE_LIMITS.downPaymentPercent.min}
            max={MORTGAGE_LIMITS.downPaymentPercent.max}
            step={0.01}
            minLabel="0%"
            maxLabel="100%"
            onChange={onDownPercentSlider}
          />
        </div>

        <div>
          <NumericInput
            id={`${idPrefix}-interest-rate`}
            label="Annual interest rate"
            value={rateInput}
            onChange={setRateInput}
            suffix="%"
            error={errors.annualInterestRate}
            min={MORTGAGE_LIMITS.annualInterestRate.min}
            max={MORTGAGE_LIMITS.annualInterestRate.max}
          />
          <RangeSlider
            id={`${idPrefix}-interest-rate-range`}
            label="Annual interest rate"
            value={sliderValue(rateInput, MORTGAGE_LIMITS.annualInterestRate.min, MORTGAGE_LIMITS.annualInterestRate.max)}
            min={MORTGAGE_LIMITS.annualInterestRate.min}
            max={MORTGAGE_LIMITS.annualInterestRate.max}
            step={0.01}
            minLabel="0%"
            maxLabel="10%"
            onChange={(value) => setRateInput(String(value))}
          />
        </div>

        <div>
          <span className="mb-3 block text-sm font-medium text-ink">Loan term</span>
          <div className="grid grid-cols-3 gap-1 rounded-full bg-sand p-1">
            {MORTGAGE_TERMS.map((years) => (
              <button
                key={years}
                type="button"
                onClick={() => setTerm(years)}
                aria-pressed={term === years}
                className={`h-11 rounded-full text-sm font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-bronze ${
                  term === years ? 'bg-ink text-paper shadow-sm' : 'text-muted hover:bg-white/70 hover:text-ink'
                }`}
              >
                {years} years
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 2xl:grid-cols-2">
          <NumericInput
            id={`${idPrefix}-property-tax`}
            label="Annual property tax estimate"
            value={taxInput}
            onChange={setTaxInput}
            prefix="$"
            error={errors.annualPropertyTax}
            hint="Editable estimate; actual taxes vary by home."
          />
          <NumericInput
            id={`${idPrefix}-insurance`}
            label="Annual insurance estimate"
            value={insuranceInput}
            onChange={setInsuranceInput}
            prefix="$"
            error={errors.annualHomeInsurance}
            hint="Editable estimate; confirm with your insurer."
          />
          <NumericInput
            id={`${idPrefix}-hoa`}
            label="Monthly HOA"
            value={hoaInput}
            onChange={setHoaInput}
            prefix="$"
            error={errors.monthlyHOA}
          />
          <NumericInput
            id={`${idPrefix}-pmi`}
            label="Annual PMI rate estimate"
            value={pmiRateInput}
            onChange={setPmiRateInput}
            suffix="%"
            error={errors.annualPMIRate}
            min={MORTGAGE_LIMITS.annualPMIRate.min}
            max={MORTGAGE_LIMITS.annualPMIRate.max}
            hint="Applied only when down payment is under 20%."
          />
        </div>
      </div>

      <div className="flex flex-col bg-ink p-6 text-white sm:p-8 lg:p-10">
        <p className="text-base text-white/60">Estimated monthly payment</p>
        {result ? (
          <>
            <p className="num mt-2 text-[clamp(2.25rem,5vw,3rem)] font-semibold leading-none tracking-[-0.04em]" aria-live="polite">
              {preciseMoney(result.totalMonthlyPayment)}
            </p>

            <div className="mt-5">
              <h3 className="mb-4 text-base font-medium text-white">Loan summary</h3>
              <div className="grid grid-cols-2 gap-3">
                <SummaryDetail label="Loan amount" value={preciseMoney(result.loanAmount)} />
                <SummaryDetail
                  label="Down payment"
                  value={`${result.downPaymentPercent.toFixed(2)}% · ${preciseMoney(downPayment)}`}
                />
                <SummaryDetail label="Loan term" value={`${term} years`} />
                <SummaryDetail label="Total interest" value={preciseMoney(result.totalInterest)} />
              </div>
            </div>

            <PaymentBreakdown parts={parts} total={result.totalMonthlyPayment} />
          </>
        ) : (
          <div className="mt-4 flex flex-1 items-center rounded-2xl border border-white/15 bg-white/[0.04] p-5 text-base leading-relaxed text-white/75" role="status">
            Correct the highlighted values to see an updated payment estimate.
          </div>
        )}

        <p className="mt-5 border-t border-white/10 pt-4 text-sm leading-relaxed text-white/45">
          <span className="mb-1 block font-medium text-white/65">Planning note</span>
          Taxes, insurance, HOA, PMI and lender terms vary. PMI is illustrative and applies only when the down payment
          is under 20%.
        </p>
      </div>
    </div>
  );
}
