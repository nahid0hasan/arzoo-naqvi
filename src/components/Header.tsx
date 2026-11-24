import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, ChevronDown, Phone } from 'lucide-react';
import { Logo } from './Logo';
import { Link, useRouter } from '../utils/router';
import { SITE } from '../config/site';
import { IMAGES } from '../data/siteData';
import { BUYING_LINKS, SELLING_LINKS } from '../data/navigation';

const NAV = [
  { label: 'Buy', to: '/buy' },
  { label: 'Sell', to: '/sell' },
  { label: 'Chicago', to: '/chicago' },
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
] as const;

export function Header() {
  const { pathname, route } = useRouter();
  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);
  const reducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<'/buy' | '/sell' | null>(null);
  const [pinnedMenu, setPinnedMenu] = useState<'/buy' | '/sell' | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<'/buy' | '/sell' | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const buyGroupRef = useRef<HTMLDivElement>(null);
  const sellGroupRef = useRef<HTMLDivElement>(null);
  const buyToggleRef = useRef<HTMLButtonElement>(null);
  const sellToggleRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressFocusOpen = useRef(false);

  const groupRef = (to: '/buy' | '/sell') => (to === '/buy' ? buyGroupRef : sellGroupRef);
  const clearCloseTimer = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const closeAfterPointerLeaves = (to: '/buy' | '/sell') => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => {
      if (pinnedMenu !== to && !groupRef(to).current?.contains(document.activeElement)) {
        setOpenMenu((current) => (current === to ? null : current));
      }
    }, 160);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
    setPinnedMenu(null);
    setMobileExpanded(null);
  }, [pathname]);

  useEffect(() => () => clearCloseTimer(), []);

  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      const toggle = openMenu === '/buy' ? buyToggleRef.current : sellToggleRef.current;
      setOpenMenu(null);
      setPinnedMenu(null);
      if (toggle && document.activeElement !== toggle) {
        suppressFocusOpen.current = true;
        toggle.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.target instanceof Node && !navRef.current?.contains(e.target)) {
        setOpenMenu(null);
        setPinnedMenu(null);
      }
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [openMenu]);

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

          <nav ref={navRef} aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const active = isActive(item.to);
              const menuTo = item.to === '/buy' || item.to === '/sell' ? item.to : null;
              const menuLinks = menuTo === '/buy' ? BUYING_LINKS : menuTo === '/sell' ? SELLING_LINKS : null;
              if (menuTo && menuLinks) {
                const menuOpen = openMenu === menuTo;
                const menuRef = menuTo === '/buy' ? buyGroupRef : sellGroupRef;
                const toggleRef = menuTo === '/buy' ? buyToggleRef : sellToggleRef;
                const menuId = `desktop-${menuTo.slice(1)}-menu`;
                return (
                  <div
                    key={item.to}
                    ref={menuRef}
                    className="relative"
                    onPointerEnter={() => {
                      clearCloseTimer();
                      setPinnedMenu(null);
                      setOpenMenu(menuTo);
                    }}
                    onPointerLeave={() => closeAfterPointerLeaves(menuTo)}
                    onFocus={() => {
                      if (suppressFocusOpen.current) {
                        suppressFocusOpen.current = false;
                        return;
                      }
                      clearCloseTimer();
                      setPinnedMenu(null);
                      setOpenMenu(menuTo);
                    }}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                        closeAfterPointerLeaves(menuTo);
                      }
                    }}
                  >
                    <Link
                      to={item.to}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => {
                        setOpenMenu(null);
                        setPinnedMenu(null);
                      }}
                      className={`relative rounded-full py-2 pl-4 pr-9 text-[15px] font-medium transition-colors ${
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
                    <button
                      ref={toggleRef}
                      type="button"
                      aria-label={`${menuOpen ? 'Close' : 'Open'} ${item.label} menu`}
                      aria-expanded={menuOpen}
                      aria-controls={menuId}
                      onClick={() => {
                        clearCloseTimer();
                        if (pinnedMenu === menuTo) {
                          setOpenMenu(null);
                          setPinnedMenu(null);
                        } else {
                          setOpenMenu(menuTo);
                          setPinnedMenu(menuTo);
                        }
                      }}
                      className={`absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full transition-colors ${
                        light ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-ink/55 hover:bg-ink/5 hover:text-ink'
                      }`}
                    >
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 motion-reduce:transition-none ${menuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {menuOpen && (
                        <motion.div
                          id={menuId}
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute left-0 top-full z-[60] w-[280px] pt-2"
                        >
                          <div
                            className={`rounded-2xl border p-2 shadow-[0_18px_50px_-24px_rgb(0_0_0/0.55)] backdrop-blur-[24px] backdrop-saturate-[170%] ${
                              light
                                ? 'border-white/55 bg-paper/88 supports-[backdrop-filter]:bg-paper/80'
                                : 'border-white/20 bg-night/95 text-white supports-[backdrop-filter]:bg-night/78'
                            }`}
                          >
                            {menuLinks.map((link) => (
                              <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => {
                                  setOpenMenu(null);
                                  setPinnedMenu(null);
                                }}
                                className={`group flex min-h-11 items-center justify-between gap-3 rounded-lg px-4 py-3 text-[15px] font-medium transition-colors duration-150 ${
                                  light
                                    ? 'text-ink/85 hover:bg-white/60 hover:text-bronze'
                                    : 'text-white/90 hover:bg-white/10 hover:text-bronze-light'
                                }`}
                              >
                                {link.label}
                                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 -translate-x-0.5 opacity-0 transition-all duration-150 motion-reduce:transition-none group-hover:translate-x-0 group-hover:opacity-70" aria-hidden="true" />
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    setOpenMenu(null);
                    setPinnedMenu(null);
                  }}
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
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-night text-white lg:hidden"
          >
            <img src={IMAGES.chicagoNight} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/85 to-night" />
            <div className="wrap relative flex min-h-full flex-col pb-10 pt-28">
              <nav aria-label="Mobile" className="flex flex-col">
                {[{ label: 'Home', to: '/' as const }, ...NAV].map((item, i) => {
                  const menuTo = item.to === '/buy' || item.to === '/sell' ? item.to : null;
                  const menuLinks = menuTo === '/buy' ? BUYING_LINKS : menuTo === '/sell' ? SELLING_LINKS : null;
                  if (menuTo && menuLinks) {
                    const expanded = mobileExpanded === menuTo;
                    const menuId = `mobile-${menuTo.slice(1)}-menu`;
                    return (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 + i * 0.04, duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="border-b border-white/10"
                      >
                        <div className="flex items-center">
                          <Link
                            to={item.to}
                            onClick={() => setOpen(false)}
                            className="flex flex-1 items-center justify-between py-4 text-[2rem] font-medium tracking-[-0.03em]"
                          >
                            {item.label}
                            <ArrowUpRight className={`mr-3 h-6 w-6 ${isActive(item.to) ? 'text-bronze-light' : 'text-white/30'}`} />
                          </Link>
                          <button
                            type="button"
                            aria-label={`${expanded ? 'Collapse' : 'Expand'} ${item.label} submenu`}
                            aria-expanded={expanded}
                            aria-controls={menuId}
                            onClick={() => setMobileExpanded(expanded ? null : menuTo)}
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white/65 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-white"
                          >
                            <ChevronDown className={`h-5 w-5 transition-transform duration-200 motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                        <AnimatePresence initial={false}>
                          {expanded && (
                            <motion.div
                              id={menuId}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="mb-4 ml-4 rounded-xl border border-white/15 bg-white/[0.06] p-2 backdrop-blur-xl backdrop-saturate-150">
                                {menuLinks.map((link) => (
                                  <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setOpen(false)}
                                    className="flex min-h-11 items-center rounded-lg px-4 py-2.5 text-[15px] font-medium text-white/80 transition-colors motion-reduce:transition-none hover:bg-white/10 hover:text-white"
                                  >
                                    {link.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  }
                  return (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.04, duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between border-b border-white/10 py-4 text-[2rem] font-medium tracking-[-0.03em]"
                      >
                        {item.label}
                        <ArrowUpRight className={`h-6 w-6 ${isActive(item.to) ? 'text-bronze-light' : 'text-white/30'}`} />
                      </Link>
                    </motion.div>
                  );
                })}
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
