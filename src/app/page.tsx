'use client'; // Required for useRouter hook

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the Dashboard page on component mount
    router.push('/dashboard');
  }, [router]); // Dependency array ensures this runs only once

  // Render nothing or a loading indicator while redirecting
  return null;
  // Or: return <div>Loading...</div>;
}
