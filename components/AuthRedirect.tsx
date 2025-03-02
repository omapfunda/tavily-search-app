"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;

    const publicPaths = ['/', '/auth/login', '/auth/register'];
    const isPublicPath = publicPaths.includes(pathname);

    if (session && isPublicPath) {
      router.push('/search');
    }
  }, [session, status, router, pathname]);

  return <>{children}</>;
}