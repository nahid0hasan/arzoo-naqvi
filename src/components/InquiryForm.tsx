import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';
import { submitInquiry } from '../utils/forms';
import { buttonClass, Choice, Field, inputClass } from './ui';

const INTERESTS = ['Buying', 'Selling', 'Both', 'Just exploring'] as const;

interface InquiryFormProps {
  source: string;
  compact?: boolean;
  submitLabel?: string;
  defaultMessage?: string;
  defaultInterest?: (typeof INTERESTS)[number];
  showInterest?: boolean;
  dark?: boolean;
  /** Extra values sent along with the form (e.g. a chosen tour time). */
  extra?: Record<string, string>;
  children?: React.ReactNode;
}

export function InquiryForm({
  source,
  compact = false,
  submitLabel = 'Send message',
  defaultMessage = '',
  defaultInterest = 'Buying',
  showInterest = false,
  dark = false,
  extra = {},
  children,
}: InquiryFormProps) {
  const [values, setValues] = useState({ name: '', email: '', phone: '', message: defaultMessage });
  const [interest, setInterest] = useState<(typeof INTERESTS)[number]>(defaultInterest);
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    try {
      await submitInquiry(source, { ...extra, ...values, ...(showInterest ? { interest } : {}) });
      setState('done');
    } catch (err) {
      setError((err as Error).message);
      setState('error');
    }
  };

  const fieldClass = dark
    ? 'h-12 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-[15px] text-white placeholder:text-white/40 focus:border-white focus:outline-none'
    : inputClass;
  const labelTone = dark ? '[&_label>span]:text-white/80' : '';

  return (
    <AnimatePresence mode="wait">
      {state === 'done' ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 rounded-2xl p-6 ${dark ? 'bg-white/10 text-white' : 'bg-sand text-ink'}`}
          role="status"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bronze text-white">
            <Check className="h-5 w-5" />
          </span>
          <p className="mt-4 text-lg font-medium">Thanks, {values.name.split(' ')[0] || 'there'}.</p>
          <p className={`mt-1 text-[15px] ${dark ? 'text-white/70' : 'text-muted'}`}>
            Your message is in. Arzoo will get back to you shortly, usually the same day.
          </p>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={onSubmit} className={`mt-6 grid gap-4 ${labelTone}`}>
          {children}
          {showInterest && (
            <Field label="I’m interested in">
              <Choice options={INTERESTS} value={interest} onChange={setInterest} name="Interest" />
            </Field>
          )}
          <div className={`grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
            <Field label="Full name">
              <input required autoComplete="name" value={values.name} onChange={set('name')} className={fieldClass} placeholder="Jane Smith" />
            </Field>
            <Field label="Phone">
              <input type="tel" autoComplete="tel" value={values.phone} onChange={set('phone')} className={fieldClass} placeholder="(312) 000-0000" />
            </Field>
          </div>
          <Field label="Email">
            <input required type="email" autoComplete="email" value={values.email} onChange={set('email')} className={fieldClass} placeholder="you@email.com" />
          </Field>
          <Field label="Message">
            <textarea
              rows={compact ? 3 : 5}
              value={values.message}
              onChange={set('message')}
              className={`${fieldClass} h-auto resize-none py-3`}
              placeholder="Tell me a little about what you’re looking for."
            />
          </Field>
          {state === 'error' && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={state === 'sending'}
            className={buttonClass(dark ? 'light' : 'dark', 'mt-1 w-full sm:w-auto sm:justify-self-start')}
          >
            {state === 'sending' && <Loader2 className="h-4 w-4 animate-spin" />}
            {state === 'sending' ? 'Sending…' : submitLabel}
          </button>
          <p className={`text-xs ${dark ? 'text-white/40' : 'text-muted'}`}>
            Your details go only to Arzoo and are never shared.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
