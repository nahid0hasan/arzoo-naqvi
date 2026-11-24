import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Mail, MessageCircle, MessageSquareText, Phone, X } from 'lucide-react';
import { SITE } from '../config/site';
import { IMAGES } from '../data/siteData';
import { Link, useRouter } from '../utils/router';

/** Floating "talk to Arzoo" button with quick contact options. */
export function ContactDock() {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  if (pathname === '/dashboard') return null;

  const actions = [
    { icon: MessageSquareText, label: 'Text me', sub: SITE.phone, href: SITE.smsHref },
    { icon: Phone, label: 'Call', sub: SITE.phone, href: SITE.phoneHref },
    { icon: Mail, label: 'Email', sub: SITE.email, href: `mailto:${SITE.email}` },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[72px] right-0 w-[min(340px,calc(100vw-40px))] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-12px_rgb(0_0_0/0.3)] ring-1 ring-black/5"
          >
            <div className="flex items-center gap-3 bg-ink p-5 text-white">
              {/* <img src={IMAGES.portrait} alt="" className="h-12 w-12 rounded-full object-cover object-top" /> */}
              <img src={IMAGES.ArzooNaqviHome} alt="" className="h-12 w-12 rounded-full object-cover object-center" />
              <div>
                <p className="font-medium">Arzoo Naqvi</p>
                <p className="text-sm text-white/60">Call, text or email anytime</p>
              </div>
            </div>
            <div className="p-2">
              {actions.map(({ icon: Icon, label, sub, href }) => (
                <a key={label} href={href} className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-sand">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sand text-ink">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-medium text-ink">{label}</span>
                    <span className="block text-sm text-muted">{sub}</span>
                  </span>
                </a>
              ))}
              <Link
                to="/contact"
                className="mt-1 flex h-12 items-center justify-center rounded-xl bg-ink text-[15px] font-medium text-white hover:bg-ink-soft"
              >
                Send a message
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close contact options' : 'Contact Arzoo'}
        aria-expanded={open}
        initial={false}
        animate={{ opacity: visible || open ? 1 : 0, scale: visible || open ? 1 : 0.8, pointerEvents: visible || open ? 'auto' : 'none' }}
        className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-ink text-white shadow-[0_12px_30px_-6px_rgb(0_0_0/0.4)] transition-colors hover:bg-ink-soft"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
