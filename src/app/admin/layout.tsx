import React from 'react';
import Link from 'next/link';
import { ReactNode } from 'react';

// This layout provides a consistent navigation structure (sidebar and header)
// for all routes under /admin. It is a Server Component by default.

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar - Fixed for Desktop, Collapsible for Mobile */}
      <nav className="w-full md:w-64 bg-gray-800 text-white p-4 shadow-xl flex-shrink-0">
        <div className="text-2xl font-bold mb-8">Admin Panel</div>
        <ul className="space-y-4">
          <li>
            {/* Navigates to /admin/dashboard */}
            <Link href="/admin/dashboard" className="block p-2 rounded-lg hover:bg-gray-700 transition duration-150">
              Dashboard
            </Link>
          </li>
          <li>
            {/* Navigates to /admin/create_users, linking to your existing page */}
            <Link href="/admin/create_users" className="block p-2 rounded-lg hover:bg-gray-700 transition duration-150">
              Create Users
            </Link>
          </li>
          <li>
            <Link href="/admin/settings" className="block p-2 rounded-lg hover:bg-gray-700 transition duration-150">
              Settings
            </Link>
          </li>
          <li>
            <Link href="/" className="block p-2 rounded-lg text-red-400 hover:bg-gray-700 transition duration-150">
              Logout
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {/* Header/Top Bar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center flex-shrink-0">
          <h1 className="text-xl font-semibold text-gray-800">Welcome, Admin!</h1>
          <div className="text-sm text-gray-500">
            {/* Placeholder for user profile or notifications */}
            User: System Administrator
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="p-6 flex-grow">
          <div className="bg-white rounded-xl shadow-lg p-6 min-h-full">
            {/* The children prop renders the content of the specific route (e.g., dashboard/page.tsx) */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}