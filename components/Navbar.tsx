"use client";

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
              AI Web Search
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/search"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/search' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`}
                >
                  Search
                </Link>
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`}
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/search"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/search' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`}
                >
                  Search
                </Link>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;