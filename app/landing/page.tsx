"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page since we've moved the landing page content there
    router.replace('/');
  }, [router]);

  // Return a minimal loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}