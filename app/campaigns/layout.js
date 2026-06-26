'use client';

import { useSession, signOut } from 'next-auth/react';

export default function CampaignsLayout({ children }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 px-6 py-4 flex items-center">
        <span className="font-bold text-orange-500">Jamloop</span>
        <div className="ml-auto flex items-center gap-4">
          {session?.user && (
            <span className="text-sm text-orange-500">Welcome {session.user.company}</span>
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
