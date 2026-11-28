'use client';

import React from 'react';
import NextLink from 'next/link';
import { useRouter as useNextRouter, usePathname as useNextPathname, useParams as useNextParams } from 'next/navigation';

export function Link({ to, href, children, ...props }) {
  const target = href || to || '#';
  return (
    <NextLink href={target} {...props}>
      {children}
    </NextLink>
  );
}

export function useNavigate() {
  const router = useNextRouter();
  return (to, options) => {
    if (typeof to === 'number') {
      if (to === -1) window.history.back();
      return;
    }
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
}

export function useLocation() {
  const pathname = useNextPathname() || '/';
  let search = '';
  try {
    if (typeof window !== 'undefined') {
      search = window.location.search || '';
    }
  } catch {}
  const hash = typeof window !== 'undefined' ? window.location.hash : '';

  return {
    pathname,
    search,
    hash,
    state: null,
    key: 'default',
  };
}

export function useSearchParams() {
  const router = useNextRouter();
  const pathname = useNextPathname();

  // Read params safely from window.location in browser without triggering SSR dynamic bailouts
  const getParams = () => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  };

  const [params, setParams] = React.useState(getParams);

  React.useEffect(() => {
    setParams(getParams());
  }, [pathname]);

  const setSearchParams = (nextParams) => {
    const p = new URLSearchParams(nextParams);
    router.push(`${pathname}?${p.toString()}`);
    setParams(p);
  };

  return [params, setSearchParams];
}

export function useParams() {
  const params = useNextParams();
  return params || {};
}

export function Navigate({ to, replace }) {
  const router = useNextRouter();
  React.useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);

  return null;
}

export function Outlet() {
  return null;
}
