import React from 'react';
import { motion } from 'motion/react';
import { IMAGES } from '../data/siteData';
import { SITE } from '../config/site';
import { ButtonLink, Eyebrow, Img, Reveal, SectionHead } from '../components/ui';
import { ClosingCta } from '../components/Sections';

const VALUES = [
  {
    title: 'Honest advice',
    text: 'I’ll tell you when a home is overpriced, when to walk away and when to move fast, even if it’s not what you want to hear.',
  },
  {
    title: 'Local knowledge',
    text: 'Which blocks flood, which buildings have special assessments coming, which schools families line up for. The details that matter.',
  },
  {
    title: 'Real availability',
    text: 'Evenings and weekends included. You’ll always know where things stand and what happens next.',
  },
];

export function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-night pb-20 pt-32 text-white sm:pb-28 sm:pt-40">
        <div className="wrap grid items-end gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 lg:pb-8"
          >
            <Eyebrow light>About</Eyebrow>
            <h1 className="display">
              Hi, I’m Arzoo.
              <span className="block text-white/45">Your Chicago realtor.</span>
            </h1>
            <p className="lead mt-8 max-w-xl text-white/75">
              I started in real estate because I love this city and the people in it. Today I help buyers and
              sellers make one of the biggest decisions of their lives with clarity and confidence.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink to="/contact" variant="light">Work with me</ButtonLink>
              <ButtonLink to={SITE.phoneHref} variant="outline-light" arrow={false}>
                {SITE.phone}
              </ButtonLink>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-3xl">
              {/* <img src={IMAGES.portrait} alt="Arzoo Naqvi" className="h-full w-full object-cover object-top" /> */}
              <img src={IMAGES.ArzooNaqviAboutMe} alt="Arzoo Naqvi" className="h-full w-full object-cover object-top" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-4">
            <Eyebrow>My story</Eyebrow>
            <h2 className="h-section">Real estate is personal.</h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-6 text-[17px] leading-[1.75] text-ink/80 lg:col-span-8">
            {/* TODO: replace with Arzoo's own bio */}
            <p>
              Buying or selling a home is rarely just about the house. It’s a new job, a growing family, a fresh
              start, or the next chapter after many years in one place. My job is to understand what’s driving
              your move and build the plan around it.
            </p>
            <p>
              I work across Chicago’s North Side, downtown and the near suburbs, with deep roots in Lincoln Park,
              Lakeview, the West Loop and Gold Coast. I know these neighborhoods from the inside: the buildings,
              the blocks and the people.
            </p>
            <p>
              Clients tell me the thing they value most is that I’m straight with them. I’ll give you the real
              numbers, a clear recommendation and the space to make your own decision.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <Img src={IMAGES.lincolnParkWalk} alt="Walking a tree-lined Chicago street" className="h-full w-full object-cover" />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <Img src={IMAGES.chicagoRiver} alt="The Chicago River downtown" className="h-full w-full object-cover" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand py-20 sm:py-28">
        <div className="wrap">
          <SectionHead eyebrow="How I work" title="What you can count on." className="mb-14" />
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06} className="border-t border-ink pt-6">
                <h3 className="h-card">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="grid grid-cols-2 gap-4">
            <Img src={IMAGES.westLoopLoft} alt="West Loop loft" className="aspect-[3/4] w-full rounded-2xl object-cover" />
            <Img src={IMAGES.penthouseSkyline} alt="River North living room" className="mt-10 aspect-[3/4] w-full rounded-2xl object-cover" />
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow>Areas I serve</Eyebrow>
            <h2 className="h-section">Chicago and the near suburbs.</h2>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-[17px]">
              {['Lincoln Park', 'Lakeview', 'West Loop', 'River North', 'Gold Coast', 'Logan Square', 'Bucktown', 'Wicker Park', 'Old Town', 'South Loop', 'Streeterville', 'Oak Park'].map((n) => (
                <li key={n} className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-bronze" /> {n}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink to="/chicago">Neighborhood guide</ButtonLink>
              {SITE.zillowReviews && (
                <ButtonLink to={SITE.zillowReviews} variant="outline">
                  Client reviews
                </ButtonLink>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
