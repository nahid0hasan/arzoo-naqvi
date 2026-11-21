import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Phone } from 'lucide-react';
import { Logo } from './Logo';
import { Link, useRouter } from '../utils/router';
import { SITE } from '../config/site';
import { IMAGES } from '../data/siteData';

const NAV = [
  { label: 'Buy', to: '/buy' },
  { label: 'Sell', to: '/sell' },
  { label: 'Chicago', to: '/chicago' },
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export function Header() {
  const { pathname, route } = useRouter();
  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (pathname === '/dashboard') return null;

  // Pages without a dark hero image get a solid header from the start.
  const solid = (scrolled || route.name === 'property') && !open;
  const light = !solid; // light text over hero imagery or the open menu

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,height] duration-300 ${
          solid ? 'h-[68px] bg-paper/90 shadow-[0_1px_0_rgb(0_0_0/0.06)] backdrop-blur-xl' : 'h-[84px] bg-transparent'
        }`}
      >
        <div className="wrap flex h-full items-center justify-between gap-6">
          <Link to="/" aria-label="Arzoo Naqvi, home" className="relative z-10">
            <Logo light={light} />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={`relative rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                    light ? 'text-white/85 hover:text-white' : 'text-ink/70 hover:text-ink'
                  } ${active ? (light ? '!text-white' : '!text-ink') : ''}`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-dot"
                      className={`absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${light ? 'bg-white' : 'bg-bronze'}`}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="relative z-10 flex items-center gap-2">
            <a
              href={SITE.phoneHref}
              className={`hidden h-11 items-center gap-2 rounded-full px-5 text-[15px] font-medium transition-colors sm:inline-flex ${
                light ? 'bg-white/12 text-white ring-1 ring-white/30 backdrop-blur hover:bg-white hover:text-ink' : 'bg-ink text-paper hover:bg-ink-soft'
              }`}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {SITE.phone}
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={`flex h-11 items-center gap-3 rounded-full pl-4 pr-3 text-[15px] font-medium lg:hidden ${
                light ? 'text-white' : 'text-ink'
              }`}
            >
              {open ? 'Close' : 'Menu'}
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span
                  className={`absolute left-0 h-[1.5px] w-5 bg-current transition-transform duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'}`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] w-5 bg-current transition-transform duration-300 ${open ? 'top-1.5 -rotate-45' : 'top-3'}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-night text-white lg:hidden"
          >
            <img src={IMAGES.chicagoNight} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/85 to-night" />
            <div className="wrap relative flex min-h-full flex-col pb-10 pt-28">
              <nav aria-label="Mobile" className="flex flex-col">
                {[{ label: 'Home', to: '/' }, ...NAV].map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={item.to}
                      className="flex items-center justify-between border-b border-white/10 py-4 text-[2rem] font-medium tracking-[-0.03em]"
                    >
                      {item.label}
                      <ArrowUpRight className={`h-6 w-6 ${isActive(item.to) ? 'text-bronze-light' : 'text-white/30'}`} />
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto grid gap-3 pt-10">
                <a href={SITE.phoneHref} className="flex h-14 items-center justify-center gap-2 rounded-full bg-white font-medium text-ink">
                  <Phone className="h-4 w-4" /> Call {SITE.phone}
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex h-14 items-center justify-center rounded-full border border-white/25 font-medium text-white"
                >
                  {SITE.email}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
