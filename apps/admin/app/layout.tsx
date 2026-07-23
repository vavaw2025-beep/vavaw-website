import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { 
  LayoutDashboard, 
  Building2, 
  Image as ImageIcon, 
  Search, 
  Link as LinkIcon, 
  FileText, 
  Settings,
  Presentation,
  Users,
  Mail
} from 'lucide-react';

import { getCurrentAdminProfile } from '../lib/admin-profile';
import { SidebarNav } from '../components/SidebarNav';
import { LogoutButton } from '../components/LogoutButton';

export const metadata: Metadata = {
  title: 'VAVAW Admin',
  description: 'Internal admin dashboard for VAVAW.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentAdminProfile();

  return (
    <html lang="en">
      <body className="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b border-slate-200">
            <span className="text-xl font-bold tracking-tight text-slate-900">VAVAW Admin</span>
          </div>
          <SidebarNav role={profile?.role} />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200">
            <h1 className="text-lg font-semibold text-slate-800">Workspace</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 font-medium capitalize">
                {profile?.role || 'Admin User'}
              </span>
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs uppercase text-slate-600">
                {profile?.role?.[0] || 'U'}
              </div>
              <LogoutButton />
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
