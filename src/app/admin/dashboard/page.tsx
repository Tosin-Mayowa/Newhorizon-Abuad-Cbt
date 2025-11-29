import React from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-black font-bold text-black-900 border-b pb-2 mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Users */}
        <DashboardCard title="Total Users" value="0" icon="👥" color="bg-blue-100 text-blue-800" />
        
        {/* Card 2: Pending Approvals */}
        <DashboardCard title="Pending Approvals" value="0" icon="⏳" color="bg-yellow-100 text-yellow-800" />
        
        {/* Card 3: Active Sessions */}
        <DashboardCard title="Active Sessions" value="0" icon="⚡" color="bg-green-100 text-green-800" />

      </div>

      <div className="mt-8">
        <h3 className="text-black font-semibold mb-4 text-black-800">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          {/* Link to your existing create_users page */}
          <QuickActionButton href="/admin/create_users" label="Create New User" />
          <QuickActionButton href="/admin/settings" label="Update System Settings" />
          <QuickActionButton href="#" label="View Logs" />

        </div>
      </div>
    </div>
  );
}

// --- Helper Components (Defined within the single file mandate) ---

// Component for the dashboard summary cards
const DashboardCard = ({ title, value, icon, color }: { title: string, value: string, icon: string, color: string }) => (
  <div className={`p-5 rounded-xl shadow-md flex items-center justify-between ${color}`}>
    <div>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-3xl font-extrabold mt-1">{value}</p>
    </div>
    <div className="text-4xl opacity-70">{icon}</div>
  </div>
);

// Component for quick action buttons
const QuickActionButton = ({ href, label }: { href: string, label: string }) => (
    <Link href={href} className="inline-block">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition transform hover:scale-[1.02] active:scale-95 duration-150">
            {label}
        </button>
    </Link>
);