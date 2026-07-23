'use client';

import React from 'react';
import Link from 'next/link';
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
  Mail,
  ShieldCheck,
  Map
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Business', href: '/business', icon: Building2 },
  { name: 'Hero', href: '/hero', icon: Presentation },
  { name: 'Media', href: '/media', icon: ImageIcon },
  { name: 'SEO', href: '/seo', icon: Search },
  { name: 'Redirects', href: '/redirects', icon: LinkIcon },
  { name: 'Content', href: '/content', icon: FileText },
  { name: 'Preview', href: '/preview', icon: Search },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Leads', href: '/leads', icon: Mail },
  { name: 'Audit Logs', href: '/audit', icon: ShieldCheck, roles: ['owner', 'admin'] },
  { name: 'Feature Map', href: '/features', icon: Map },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function SidebarNav({ role }: { role?: string }) {
  const allowedNav = navigation.filter((item) => {
    if (!item.roles) return true;
    if (!role) return false;
    return item.roles.includes(role);
  });

  return (
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      {allowedNav.map((item) => (
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
  );
}
