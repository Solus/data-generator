'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Use router.replace() to redirect without adding the root page to browser history
    router.replace('/iban');
  }, [router]);

  // You can optionally return a loading indicator here
  return <p>Redirecting...</p>;
}
