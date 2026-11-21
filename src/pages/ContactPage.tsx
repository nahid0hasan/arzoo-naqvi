import React from 'react';
import { motion } from 'motion/react';
import { Clock, Mail, MapPin, MessageSquareText, Phone } from 'lucide-react';
import { SITE } from '../config/site';
import { IMAGES } from '../data/siteData';
import { Eyebrow, Reveal } from '../components/ui';
import { InquiryForm } from '../components/InquiryForm';

export function ContactPage() {
  const methods = [
    { Icon: Phone, label: 'Call', value: SITE.phone, href: SITE.phoneHref },
    { Icon: MessageSquareText, label: 'Text', value: SITE.phone, href: SITE.smsHref },
    { Icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-night pb-16 pt-36 text-white sm:pb-20 sm:pt-44">
        <img src={IMAGES.chicagoNight} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-night/30" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="wrap relative"
        >
          <Eyebrow light>Contact</Eyebrow>
          <h1 className="display max-w-3xl">Let’s talk.</h1>
          <p className="lead mt-6 max-w-xl text-white/75">
            Questions about buying, selling or a specific home? Send a note, call or text. I’ll get back to you the
            same day.
          </p>
        </motion.div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-7">
            <div className="rounded-3xl border border-stone bg-white p-6 sm:p-10">
              <h2 className="h-card">Send a message</h2>
              <p className="mt-1 text-muted">Tell me a bit about your plans and the best way to reach you.</p>
              <InquiryForm source="Contact page" showInterest submitLabel="Send message" />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="space-y-10 lg:col-span-5">
            <div className="space-y-3">
              {methods.map(({ Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="group flex items-center gap-5 rounded-2xl border border-stone p-5 transition-colors hover:border-ink"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand transition-colors group-hover:bg-ink group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm text-muted">{label}</span>
                    <span className="block text-lg font-medium tracking-[-0.01em]">{value}</span>
                  </span>
                </a>
              ))}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex gap-4">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-bronze" />
                <div>
                  <p className="font-medium">Hours</p>
                  <p className="mt-1 text-[15px] text-muted">
                    Mon–Fri 9am–7pm
                    <br />
                    Sat–Sun 10am–5pm, showings by appointment
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-bronze" />
                <div>
                  <p className="font-medium">Serving</p>
                  <p className="mt-1 text-[15px] text-muted">Chicago and the near suburbs</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-stone">
              <iframe
                title="Map of Chicago"
                src="https://www.google.com/maps?q=Chicago,+IL&z=11&output=embed"
                className="h-72 w-full grayscale-[0.6]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
