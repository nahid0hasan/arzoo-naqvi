import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { submitInquiry } from '../utils/forms';
import { buttonClass, calculatorInputClass, Choice, Field } from './ui';
import { opts, Select } from './Select';

const TYPES = ['House', 'Condo', 'Townhome', 'Multi-unit'] as const;
const CONDITION = ['Needs work', 'Good', 'Updated', 'Fully renovated'] as const;
const TIMELINE = ['ASAP', '1–3 months', '3–6 months', 'Just curious'] as const;

const STEPS = ['Property', 'Details', 'Contact'];

/** Three-step "What's my home worth?" request. */
export function ValuationForm({ initialAddress = '' }: { initialAddress?: string }) {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState(initialAddress);
  const [unit, setUnit] = useState('');
  const [type, setType] = useState<(typeof TYPES)[number]>('House');
  const [beds, setBeds] = useState('3');
  const [baths, setBaths] = useState('2');
  const [sqft, setSqft] = useState('');
  const [condition, setCondition] = useState<(typeof CONDITION)[number]>('Good');
  const [timeline, setTimeline] = useState<(typeof TIMELINE)[number]>('1–3 months');
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) return setStep(step + 1);
    setState('sending');
    submitInquiry('Home valuation request', {
      address: unit ? `${address}, ${unit}` : address,
      type,
      beds,
      baths,
      sqft,
      condition,
      timeline,
      ...contact,
    })
      .then(() => setState('done'))
      .catch(() => setState('idle'));
  };

  if (state === 'done') {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-2" role="status">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bronze text-white">
          <Check className="h-6 w-6" />
        </span>
        <p className="h-card mt-6">Your request is in.</p>
        <p className="mt-2 leading-relaxed text-muted">
          Arzoo will review recent sales near <span className="text-ink">{address}</span> and send you a valuation
          within 24 hours. No obligation, no automated estimate.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={next}>
      <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s}>
            <div className={`h-1 rounded-full transition-colors duration-500 ${i <= step ? 'bg-ink' : 'bg-stone'}`} />
            <p className={`mt-2 text-xs font-medium ${i <= step ? 'text-ink' : 'text-muted'}`}>
              {i + 1}. {s}
            </p>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
          className="grid gap-5"
        >
          {step === 0 && (
            <>
              <Field label="Property address">
                <input
                  required
                  autoFocus
                  autoComplete="street-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={calculatorInputClass}
                  placeholder="1234 N Example St, Chicago"
                />
              </Field>
              <Field label="Unit (optional)">
                <input value={unit} onChange={(e) => setUnit(e.target.value)} className={calculatorInputClass} placeholder="Unit 3B" />
              </Field>
              <Field label="Property type">
                <Choice options={TYPES} value={type} onChange={setType} name="Property type" />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <Select showLabel label="Beds" value={beds} onChange={setBeds} options={opts(['1', '2', '3', '4', '5', '6+'])} />
                <Select showLabel label="Baths" value={baths} onChange={setBaths} options={opts(['1', '1.5', '2', '2.5', '3', '3.5', '4+'])} />
                <label className="flex h-14 flex-col justify-center rounded-xl border border-stone bg-white px-4 focus-within:border-ink">
                  <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">Sq ft</span>
                  <input
                    inputMode="numeric"
                    value={sqft}
                    onChange={(e) => setSqft(e.target.value.replace(/\D/g, ''))}
                    className="mt-0.5 w-full bg-transparent text-[15px] font-medium placeholder:font-normal placeholder:text-muted/60 focus:outline-none"
                    placeholder="1,800"
                  />
                </label>
              </div>
              <Field label="Condition">
                <Choice options={CONDITION} value={condition} onChange={setCondition} name="Condition" />
              </Field>
              <Field label="When are you thinking of selling?">
                <Choice options={TIMELINE} value={timeline} onChange={setTimeline} name="Timeline" />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Full name">
                <input required autoFocus autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className={calculatorInputClass} />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Email">
                  <input required type="email" autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className={calculatorInputClass} />
                </Field>
                <Field label="Phone">
                  <input type="tel" autoComplete="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className={calculatorInputClass} />
                </Field>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center gap-3">
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className={buttonClass('outline', 'px-4')} aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <button type="submit" disabled={state === 'sending'} className={buttonClass('dark', 'flex-1 sm:flex-none')}>
          {state === 'sending' && <Loader2 className="h-4 w-4 animate-spin" />}
          {step < 2 ? 'Continue' : state === 'sending' ? 'Sending…' : 'Get my home value'}
        </button>
      </div>
    </form>
  );
}
