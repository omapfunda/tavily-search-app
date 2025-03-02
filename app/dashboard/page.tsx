"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

interface UsageStats {
  currentUsage: number;
  usageLimit: number;
  plan: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    const fetchUsageStats = async () => {
      try {
        const response = await fetch('/api/usage');
        const data = await response.json();
        setUsageStats(data);
      } catch (error) {
        console.error('Failed to fetch usage stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsageStats();
  }, [session, router]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {/* Usage Stats Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Usage Statistics</h3>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Current Usage</span>
                    <span>{usageStats?.currentUsage || 0} searches</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${((usageStats?.currentUsage || 0) / (usageStats?.usageLimit || 100)) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Limit</span>
                    <span>{usageStats?.usageLimit || 100} searches</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Details Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Current Plan</h3>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {usageStats?.plan || 'FREE'}
                  </p>
                  <button 
                    className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => router.push('/dashboard/subscription')}
                  >
                    Manage Subscription
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}