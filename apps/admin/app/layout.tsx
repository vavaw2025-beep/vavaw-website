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
  Users
} from 'lucide-react';

import { LogoutButton } from '../components/LogoutButton';

export const metadata: Metadata = {
  title: 'VAVAW Admin',
  description: 'Internal admin dashboard for VAVAW.',
  robots: {
    index: false,
    follow: false,
  },
};

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Business', href: '/business', icon: Building2 },
  { name: 'Hero', href: '/hero', icon: Presentation },
  { name: 'Media', href: '/media', icon: ImageIcon },
  { name: 'SEO', href: '/seo', icon: Search },
  { name: 'Redirects', href: '/redirects', icon: LinkIcon },
  { name: 'Content', href: '/content', icon: FileText },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b border-slate-200">
            <span className="text-xl font-bold tracking-tight text-slate-900">VAVAW Admin</span>
          </div>
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors group"
              >
                <item.icon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" aria-hidden="true" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200">
            <h1 className="text-lg font-semibold text-slate-800">Workspace</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">Admin User</span>
              <div className="h-8 w-8 rounded-full bg-slate-200"></div>
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
