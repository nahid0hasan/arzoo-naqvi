import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

/**
 * Tiny client-side router. Each route maps 1:1 to a WordPress template
 * (see App.tsx), so the mockup converts cleanly into a theme.
 */

export interface RouteMatch {
  name:
    | 'home'
    | 'about'
    | 'buy'
    | 'sell'
    | 'chicago'
    | 'neighborhood'
    | 'property'
    | 'blog'
    | 'post'
    | 'contact'
    | 'privacy'
    | 'dashboard'
    | 'notFound';
  param?: string;
}

const STATIC: Record<string, RouteMatch['name']> = {
  '/': 'home',
  '/about': 'about',
  '/buy': 'buy',
  '/sell': 'sell',
  '/chicago': 'chicago',
  '/blog': 'blog',
  '/contact': 'contact',
  '/privacy': 'privacy',
  '/dashboard': 'dashboard',
};

const DYNAMIC: [RegExp, RouteMatch['name']][] = [
  [/^\/property\/([\w-]+)$/, 'property'],
  [/^\/chicago\/([\w-]+)$/, 'neighborhood'],
  [/^\/blog\/([\w-]+)$/, 'post'],
];

const clean = (path: string) => (path.split(/[?#]/)[0] || '/').replace(/(.)\/+$/, '$1');

export function matchRoute(path: string): RouteMatch {
  const p = clean(path);
  if (STATIC[p]) return { name: STATIC[p] };
  for (const [re, name] of DYNAMIC) {
    const m = p.match(re);
    if (m) return { name, param: m[1] };
  }
  return { name: 'notFound' };
}

/** Sets the document title / meta description for the current page. */
export function useSeo(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute('href', `https://arzoonaqvi.com${clean(window.location.pathname)}`);
  }, [title, description]);
}

function scrollToHash(hash: string) {
  if (!hash) return;
  let tries = 0;
  const attempt = () => {
    const el = document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else if (tries++ < 20) setTimeout(attempt, 50);
  };
  setTimeout(attempt, 80);
}

interface RouterValue {
  pathname: string;
  route: RouteMatch;
  searchParams: URLSearchParams;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterValue>({
  pathname: '/',
  route: { name: 'home' },
  searchParams: new URLSearchParams(),
  navigate: () => {},
});

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [loc, setLoc] = useState(() => ({
    pathname: clean(window.location.pathname),
    search: window.location.search,
  }));

  useEffect(() => {
    const onPop = () => setLoc({ pathname: clean(window.location.pathname), search: window.location.search });
    window.addEventListener('popstate', onPop);
    scrollToHash(window.location.hash.slice(1));
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    const [beforeHash, hash = ''] = to.split('#');
    const [rawPath, query] = beforeHash.split('?');
    const current = clean(window.location.pathname);
    const pathname = rawPath ? clean(rawPath) : current;
    const search = query ? `?${query}` : '';
    const samePage = pathname === current;

    window.history.pushState({}, '', `${pathname}${search}${hash ? `#${hash}` : ''}`);
    setLoc({ pathname, search });

    if (hash) scrollToHash(hash);
    else if (!samePage || !search) window.scrollTo({ top: 0, behavior: samePage ? 'smooth' : 'instant' });
  }, []);

  return (
    <RouterContext.Provider
      value={{
        pathname: loc.pathname,
        route: matchRoute(loc.pathname),
        searchParams: new URLSearchParams(loc.search),
        navigate,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

/** Internal link that uses client-side navigation. */
export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
