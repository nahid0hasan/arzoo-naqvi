import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown } from 'lucide-react';

export interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  /** Small caption shown above the value (hero / pill style) or as the accessible name. */
  label: string;
  /**
   * - `hero`: borderless, caption above the value (for the big search bar)
   * - `field`: bordered 48px control matching text inputs
   * - `pill`: compact rounded control for toolbars (sort, etc.)
   */
  variant?: 'hero' | 'field' | 'pill';
  icon?: React.ReactNode;
  className?: string;
  /** Show the caption inside a `field` control too. */
  showLabel?: boolean;
}

/** Custom dropdown that replaces the native <select> look. */
export function Select({ value, options, onChange, label, variant = 'field', icon, className = '', showLabel = false }: SelectProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [dropUp, setDropUp] = useState(false);

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  // Open upward when there isn't room below.
  useLayoutEffect(() => {
    if (!open || !root.current) return;
    const rect = root.current.getBoundingClientRect();
    const needed = Math.min(options.length * 44 + 16, 320);
    setDropUp(window.innerHeight - rect.bottom < needed && rect.top > needed);
    setActive(selectedIndex);
  }, [open, options.length, selectedIndex]);

  // Keep the highlighted option in view.
  useEffect(() => {
    if (!open) return;
    list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const choose = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(options.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(options.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(active);
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      setOpen(false);
    }
  };

  const triggerStyle = {
    hero: 'h-14 w-full rounded-xl px-3 text-left hover:bg-sand/70 sm:h-16 sm:px-4',
    field: `w-full rounded-xl border bg-white px-4 text-left ${showLabel ? 'h-14' : 'h-12'} ${open ? 'border-ink' : 'border-stone hover:border-ink/40'}`,
    pill: `h-10 rounded-full border bg-white pl-4 pr-3 text-sm ${open ? 'border-ink' : 'border-stone hover:border-ink/40'}`,
  }[variant];

  const stacked = variant === 'hero' || (variant === 'field' && showLabel);

  return (
    <div ref={root} className={`relative ${className}`}>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`${label}: ${selected?.label ?? ''}`}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className={`flex items-center gap-3 text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze/50 ${triggerStyle}`}
      >
        {icon && <span className="shrink-0 text-bronze">{icon}</span>}
        <span className="min-w-0 flex-1">
          {stacked && <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-muted">{label}</span>}
          <span className={`block truncate ${variant === 'pill' ? 'font-medium' : 'text-[15px] font-medium'} ${stacked ? 'mt-0.5' : ''}`}>
            {variant === 'pill' && <span className="mr-1 font-normal text-muted">{label}:</span>}
            {selected?.label}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={list}
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute left-0 z-50 max-h-80 min-w-full overflow-y-auto rounded-2xl bg-white p-1.5 text-ink shadow-[0_24px_50px_-12px_rgb(0_0_0/0.28)] ring-1 ring-black/5 no-scrollbar ${
              dropUp ? 'bottom-full mb-2 origin-bottom' : 'top-full mt-2 origin-top'
            } ${variant === 'pill' ? 'right-0 left-auto w-max' : 'w-max max-w-[min(320px,calc(100vw-40px))]'}`}
          >
            {options.map((o, i) => {
              const isSelected = o.value === value;
              return (
                <li
                  key={o.value}
                  id={`${id}-opt-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={isSelected}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                  className={`flex min-h-11 cursor-pointer items-center justify-between gap-6 rounded-xl px-3.5 text-[15px] transition-colors ${
                    i === active ? 'bg-sand' : ''
                  } ${isSelected ? 'font-medium' : ''}`}
                >
                  <span className="whitespace-nowrap">{o.label}</span>
                  <Check className={`h-4 w-4 shrink-0 text-bronze ${isSelected ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Helper to build options from plain strings. */
export const opts = (values: (string | number)[], format: (v: string) => string = (v) => v): Option[] =>
  values.map((v) => ({ value: String(v), label: format(String(v)) }));
