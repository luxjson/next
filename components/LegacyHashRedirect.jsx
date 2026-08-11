'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacyHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/')) {
      const target = hash.slice(1) || '/';
      router.replace(target);
      return;
    }

    if (window.location.search.includes('/insomnia')) {
      window.history.replaceState(null, '', '/insomnia');
      router.replace('/insomnia');
    }
  }, [router]);

  return null;
}
