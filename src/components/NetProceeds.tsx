import React, { useMemo, useState } from 'react';
import { money } from '../utils/format';
import { Slider } from './MortgageCalculator';
import { inputClass } from './ui';

export function NetProceedsCalculator() {
  const [price, setPrice] = useState(850000);
  const [payoff, setPayoff] = useState(420000);
  const [commission, setCommission] = useState(5);
  const [transfer, setTransfer] = useState(0.45);
  const [closing, setClosing] = useState(1);
  const [credits, setCredits] = useState(0);

  const r = useMemo(() => {
    const items = [
      { label: 'Mortgage payoff', value: payoff },
      { label: `Commission (${commission}%)`, value: (price * commission) / 100 },
      { label: `Transfer taxes (${transfer}%)`, value: (price * transfer) / 100 },
      { label: `Title, attorney & closing (${closing}%)`, value: (price * closing) / 100 },
      { label: 'Repairs or buyer credits', value: credits },
    ];
    const costs = items.reduce((s, i) => s + i.value, 0);
    return { items, costs, net: price - costs };
  }, [price, payoff, commission, transfer, closing, credits]);

  return (
    <div className="grid overflow-hidden rounded-3xl border border-stone bg-white lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-7 p-6 sm:p-10">
        <Slider label="Expected sale price" value={price} min={100000} max={5000000} step={5000} onChange={setPrice} display={money(price)} />
        <Slider label="Agent commission" value={commission} min={0} max={7} step={0.25} onChange={setCommission} display={`${commission}%`} />
        <Slider label="Transfer taxes" value={transfer} min={0} max={1.5} step={0.05} onChange={setTransfer} display={`${transfer.toFixed(2)}%`} />
        <Slider label="Title, attorney & other closing costs" value={closing} min={0} max={3} step={0.1} onChange={setClosing} display={`${closing.toFixed(1)}%`} />
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: 'Remaining mortgage balance', value: payoff, set: setPayoff },
            { label: 'Repairs or buyer credits', value: credits, set: setCredits },
          ].map((f) => (
            <label key={f.label} className="block">
              <span className="mb-2 block text-sm font-medium text-ink">{f.label}</span>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={f.value}
                  onChange={(e) => f.set(Math.max(0, Number(e.target.value)))}
                  className={`${inputClass} num pl-8`}
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col bg-sand p-6 sm:p-10">
        <p className="text-sm text-muted">Estimated net proceeds</p>
        <p className={`num mt-2 text-[clamp(2.75rem,6vw,4rem)] font-semibold leading-none tracking-[-0.04em] ${r.net < 0 ? 'text-red-700' : 'text-ink'}`}>
          {money(r.net)}
        </p>
        <ul className="mt-8 divide-y divide-stone border-y border-stone">
          <li className="flex justify-between py-3 text-[15px]">
            <span className="font-medium">Sale price</span>
            <span className="num font-medium">{money(price)}</span>
          </li>
          {r.items.map((i) => (
            <li key={i.label} className="flex justify-between py-3 text-[15px] text-ink/75">
              <span>{i.label}</span>
              <span className="num">−{money(i.value)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-auto pt-8 text-xs leading-relaxed text-muted">
          A starting estimate. Chicago, Cook County and Illinois transfer taxes, prorated property taxes and
          attorney fees vary by property. Arzoo will prepare an exact seller net sheet for your home.
        </p>
      </div>
    </div>
  );
}
