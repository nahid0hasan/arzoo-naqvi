import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '../utils/router';

/* ------------------------------- Buttons ---------------------------------- */

type Variant = 'dark' | 'light' | 'outline' | 'outline-light';

const VARIANTS: Record<Variant, string> = {
  dark: 'bg-ink text-paper hover:bg-ink-soft',
  light: 'bg-paper text-ink hover:bg-white',
  outline: 'border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper',
  'outline-light': 'border border-white/40 text-white hover:bg-white hover:text-ink',
};

export const buttonClass = (variant: Variant = 'dark', extra = '') =>
  `group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium tracking-[-0.01em] transition-colors duration-200 disabled:opacity-50 ${VARIANTS[variant]} ${extra}`;

interface ButtonLinkProps {
  to: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  arrow?: boolean;
  external?: boolean;
}

export function ButtonLink({ to, variant = 'dark', className = '', children, arrow = true, external }: ButtonLinkProps) {
  const content = (
    <>
      {children}
      {arrow && (
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      )}
    </>
  );
  if (external || /^(https?:|mailto:|tel:|sms:)/.test(to)) {
    return (
      <a
        href={to}
        className={buttonClass(variant, className)}
        {...(to.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link to={to} className={buttonClass(variant, className)}>
      {content}
    </Link>
  );
}

/** Text link with an underline that grows on hover. */
export function TextLink({ to, children, light = false }: { to: string; children: React.ReactNode; light?: boolean }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-1.5 text-[15px] font-medium ${light ? 'text-white' : 'text-ink'}`}
    >
      <span className="relative">
        {children}
        <span
          className={`absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-100 transition-transform duration-300 group-hover:scale-x-0 ${light ? 'bg-white/50' : 'bg-ink/30'}`}
        />
      </span>
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

/* ------------------------------- Motion ----------------------------------- */

export function Reveal({
  children,
  delay = 0,
  className = '',
  y = 24,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------- Images ----------------------------------- */

/** Image that fades in once loaded, on a warm placeholder. */
export function Img({
  src,
  alt,
  className = '',
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={`bg-stone transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
    />
  );
}

/* ------------------------------ Typography -------------------------------- */

export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`mb-5 flex items-center gap-2.5 text-sm font-medium ${light ? 'text-white/70' : 'text-muted'}`}>
      <span className={`h-px w-6 ${light ? 'bg-bronze-light' : 'bg-bronze'}`} />
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  text,
  light = false,
  action,
  className = '',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  light?: boolean;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${className}`}>
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
        <h2 className={`h-section ${light ? 'text-white' : 'text-ink'}`}>{title}</h2>
        {text && <p className={`lead mt-5 max-w-xl ${light ? 'text-white/70' : 'text-muted'}`}>{text}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}

/* -------------------------------- Forms ----------------------------------- */

export const inputClass =
  'h-12 w-full rounded-xl border border-stone bg-white px-4 text-[15px] text-ink placeholder:text-muted/60 transition-colors focus:border-ink focus:outline-none';

export function Field({
  label,
  children,
  hint,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

/** Pill-style single choice selector. */
export function Choice<T extends string>({
  options,
  value,
  onChange,
  name,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  name: string;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={`h-10 rounded-full border px-4 text-sm font-medium transition-colors ${
            value === o ? 'border-ink bg-ink text-paper' : 'border-stone bg-white text-ink hover:border-ink/40'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
