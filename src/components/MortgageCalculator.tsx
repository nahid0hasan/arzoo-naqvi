import React, { useMemo, useState } from 'react';
import { money, monthlyPayment, rangeFill } from '../utils/format';
import { inputClass } from './ui';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}

export function Slider({ label, value, min, max, step, onChange, display }: SliderProps) {
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
        style={rangeFill(value, min, max)}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function NumberInput({ label, value, onChange, prefix = '$' }: { label: string; value: number; onChange: (v: number) => void; prefix?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">{prefix}</span>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          value={Number.isFinite(value) ? value : ''}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          className={`${inputClass} num pl-8`}
        />
      </div>
    </label>
  );
}

const TERMS = [30, 20, 15] as const;

export function MortgageCalculator({
  initialPrice = 750000,
  initialTax,
  initialHoa = 0,
}: {
  initialPrice?: number;
  initialTax?: number;
  initialHoa?: number;
}) {
  const [price, setPrice] = useState(initialPrice);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState<(typeof TERMS)[number]>(30);
  const [taxYear, setTaxYear] = useState(initialTax ?? Math.round(initialPrice * 0.019));
  const [insYear, setInsYear] = useState(1800);
  const [hoa, setHoa] = useState(initialHoa);

  const r = useMemo(() => {
    const down = (price * downPct) / 100;
    const loan = price - down;
    const pi = monthlyPayment(loan, rate, term);
    const tax = taxYear / 12;
    const ins = insYear / 12;
    const pmi = downPct < 20 ? (loan * 0.006) / 12 : 0;
    const total = pi + tax + ins + hoa + pmi;
    return { down, loan, pi, tax, ins, pmi, total };
  }, [price, downPct, rate, term, taxYear, insYear, hoa]);

  const parts = [
    { label: 'Principal & interest', value: r.pi, color: 'bg-ink' },
    { label: 'Property tax', value: r.tax, color: 'bg-bronze' },
    { label: 'Home insurance', value: r.ins, color: 'bg-bronze-light' },
    { label: 'HOA dues', value: hoa, color: 'bg-muted' },
    { label: 'PMI', value: r.pmi, color: 'bg-stone' },
  ].filter((p) => p.value > 0);

  return (
    <div className="grid overflow-hidden rounded-3xl border border-stone bg-white lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-7 p-6 sm:p-10">
        <Slider label="Home price" value={price} min={100000} max={5000000} step={5000} onChange={setPrice} display={money(price)} />
        <Slider
          label="Down payment"
          value={downPct}
          min={0}
          max={50}
          step={1}
          onChange={setDownPct}
          display={`${downPct}% · ${money(r.down)}`}
        />
        <Slider label="Interest rate" value={rate} min={2} max={10} step={0.05} onChange={setRate} display={`${rate.toFixed(2)}%`} />

        <div>
          <span className="mb-3 block text-sm font-medium text-ink">Loan term</span>
          <div className="grid grid-cols-3 gap-2 rounded-full bg-sand p-1">
            {TERMS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTerm(t)}
                aria-pressed={term === t}
                className={`h-10 rounded-full text-sm font-medium transition-colors ${term === t ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'}`}
              >
                {t} years
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <NumberInput label="Property tax / yr" value={taxYear} onChange={setTaxYear} />
          <NumberInput label="Insurance / yr" value={insYear} onChange={setInsYear} />
          <NumberInput label="HOA / mo" value={hoa} onChange={setHoa} />
        </div>
      </div>

      <div className="flex flex-col bg-ink p-6 text-white sm:p-10">
        <p className="text-sm text-white/60">Estimated monthly payment</p>
        <p className="num mt-2 text-[clamp(2.75rem,6vw,4rem)] font-semibold leading-none tracking-[-0.04em]">{money(r.total)}</p>

        <div className="mt-8 flex h-2.5 overflow-hidden rounded-full bg-white/10">
          {parts.map((p) => (
            <div key={p.label} className={`${p.color} transition-[width] duration-500`} style={{ width: `${(p.value / r.total) * 100}%` }} />
          ))}
        </div>

        <ul className="mt-6 space-y-3.5">
          {parts.map((p) => (
            <li key={p.label} className="flex items-center justify-between text-[15px]">
              <span className="flex items-center gap-2.5 text-white/75">
                <span className={`h-2.5 w-2.5 rounded-full ${p.color}`} />
                {p.label}
              </span>
              <span className="num font-medium">{money(p.value)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-sm">
          <div>
            <p className="text-white/50">Loan amount</p>
            <p className="num mt-1 text-lg font-medium">{money(r.loan)}</p>
          </div>
          <div>
            <p className="text-white/50">Cash at closing (down)</p>
            <p className="num mt-1 text-lg font-medium">{money(r.down)}</p>
          </div>
        </div>
        <p className="mt-auto pt-8 text-xs leading-relaxed text-white/40">
          Estimates only. Your actual rate and payment depend on your lender, credit and loan program. PMI is
          estimated at 0.6% of the loan per year when the down payment is under 20%.
        </p>
      </div>
    </div>
  );
}
