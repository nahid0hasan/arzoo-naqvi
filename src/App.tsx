import React from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { RouteMatch, RouterProvider, useRouter, useSeo } from './utils/router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ContactDock } from './components/ContactDock';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { BuyPage } from './pages/BuyPage';
import { SellPage } from './pages/SellPage';
import { ChicagoPage } from './pages/ChicagoPage';
import { NeighborhoodPage } from './pages/NeighborhoodPage';
import { PropertyPage } from './pages/PropertyPage';
import { BlogPage } from './pages/BlogPage';
import { PostPage } from './pages/PostPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

/**
 * Route → page. Suggested WordPress templates:
 *   home          front-page.php
 *   about/buy/sell/chicago/contact/privacy   page-{slug}.php
 *   property      single-property.php   (CPT "property", archive on /buy)
 *   neighborhood  single-neighborhood.php (CPT "neighborhood", archive on /chicago)
 *   blog          home.php / archive.php
 *   post          single.php
 *   notFound      404.php
 */
function render(route: RouteMatch) {
  switch (route.name) {
    case 'home':
      return <HomePage />;
    case 'about':
      return <AboutPage />;
    case 'buy':
      return <BuyPage />;
    case 'sell':
      return <SellPage />;
    case 'chicago':
      return <ChicagoPage />;
    case 'neighborhood':
      return <NeighborhoodPage id={route.param!} />;
    case 'property':
      return <PropertyPage id={route.param!} />;
    case 'blog':
      return <BlogPage />;
    case 'post':
      return <PostPage slug={route.param!} />;
    case 'contact':
      return <ContactPage />;
    case 'privacy':
      return <PrivacyPage />;
    case 'dashboard':
      return <DashboardPage />;
    default:
      return <NotFoundPage />;
  }
}

const STATIC_SEO: Partial<Record<RouteMatch['name'], [string, string]>> = {
  home: [
    'Arzoo Naqvi | Chicago Realtor',
    'Arzoo Naqvi is a Chicago realtor helping buyers and sellers across Lincoln Park, Lakeview, West Loop, River North, Gold Coast and Logan Square.',
  ],
  about: ['About Arzoo Naqvi | Chicago Realtor', 'Meet Arzoo Naqvi, a Chicago realtor known for clear advice, local knowledge and steady negotiation.'],
  buy: ['Buy a Home in Chicago | Arzoo Naqvi', 'Search Chicago homes for sale, estimate your monthly mortgage payment and plan your purchase with Arzoo Naqvi.'],
  sell: ['Sell Your Chicago Home | Arzoo Naqvi', 'Find out what your Chicago home is worth, estimate your net proceeds and get a clear plan to sell.'],
  chicago: ['Chicago Neighborhood Guide | Arzoo Naqvi', 'A realtor’s guide to Lincoln Park, Lakeview, West Loop, River North, Gold Coast and Logan Square.'],
  contact: ['Contact Arzoo Naqvi | Chicago Realtor', 'Call, text or send a message to Arzoo Naqvi about buying or selling a home in Chicago.'],
  dashboard: ['Client Manager | Arzoo Naqvi', 'Private client manager.'],
};

/** Applies titles for static pages; dynamic pages set their own with useSeo. */
function StaticSeo({ name }: { name: RouteMatch['name'] }) {
  const [title, desc] = STATIC_SEO[name]!;
  useSeo(title, desc);
  return null;
}

function Page() {
  const { pathname, route } = useRouter();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {STATIC_SEO[route.name] && <StaticSeo name={route.name} />}
        {render(route)}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider>
        <Header />
        <main>
          <Page />
        </main>
        <Footer />
        <ContactDock />
      </RouterProvider>
    </MotionConfig>
  );
}
