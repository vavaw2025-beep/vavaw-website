import {
  businessEntries,
  getActiveBusinessEntries,
  getComingSoonBusinessEntries,
  getExternalBusinessEntries,
  getInternalBusinessEntries
} from '@vavaw/brand-config';
import { MOCK_ADMIN_USER } from '@vavaw/auth';
import { Building2, Globe, Rocket, Link2, MonitorPlay, Pencil, Shield, Database, Cloud, HardDrive } from 'lucide-react';

export default function DashboardPage() {
  const total = businessEntries.length;
  const active = getActiveBusinessEntries().length;
  const comingSoon = getComingSoonBusinessEntries().length;
  const draft = businessEntries.filter((e) => e.status === 'draft').length;
  const external = getExternalBusinessEntries().length;
  const internal = getInternalBusinessEntries().length;

  const stats = [
    { name: 'Total Businesses', value: total, icon: Building2 },
    { name: 'Active Entries', value: active, icon: Rocket },
    { name: 'Coming Soon', value: comingSoon, icon: MonitorPlay },
    { name: 'Draft Entries', value: draft, icon: Pencil },
    { name: 'Internal Apps', value: internal, icon: Globe },
    { name: 'External Apps', value: external, icon: Link2 },
  ];

  const authStatus = [
    { label: 'Auth Mode', value: 'Mock UI', icon: Shield, badge: 'Mock', badgeColor: 'bg-amber-100 text-amber-800' },
    { label: 'Current Role', value: `${MOCK_ADMIN_USER.role.charAt(0).toUpperCase() + MOCK_ADMIN_USER.role.slice(1)} / Mock`, icon: Shield, badge: 'Mock', badgeColor: 'bg-purple-100 text-purple-800' },
    { label: 'Database', value: 'Not connected', icon: Database, badge: 'Offline', badgeColor: 'bg-slate-100 text-slate-600' },
    { label: 'Storage', value: 'Not connected', icon: Cloud, badge: 'Offline', badgeColor: 'bg-slate-100 text-slate-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">VAVAW Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Manage the VAVAW brand ecosystem</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden border border-slate-200">
            <dt>
              <div className="absolute bg-blue-500 rounded-md p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-slate-500 truncate">{item.name}</p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
            </dd>
          </div>
        ))}
      </div>

      {/* Auth Status Card */}
      <div className="bg-white shadow rounded-lg border border-slate-200">
        <div className="px-4 py-5 sm:px-6 border-b border-slate-200 flex items-center gap-3">
          <div className="bg-amber-50 p-2 rounded-lg">
            <HardDrive className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-slate-900">Backend &amp; Auth Status</h3>
            <p className="text-sm text-slate-500">Current infrastructure connection state</p>
          </div>
        </div>
        <ul role="list" className="divide-y divide-slate-200">
          {authStatus.map((item, idx) => (
            <li key={idx} className="px-4 py-3 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.value}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.badgeColor}`}>
                {item.badge}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Overview */}
      <div className="bg-white shadow rounded-lg border border-slate-200">
        <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
          <h3 className="text-lg leading-6 font-medium text-slate-900">Quick Overview</h3>
        </div>
        <ul role="list" className="divide-y divide-slate-200">
          {businessEntries.map((entry) => (
            <li key={entry.id} className="px-4 py-4 sm:px-6 hover:bg-slate-50">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-blue-600 truncate">{entry.name}</p>
                <div className="ml-2 flex-shrink-0 flex space-x-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    entry.status === 'active' ? 'bg-green-100 text-green-800' :
                    entry.status === 'coming-soon' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {entry.status}
                  </span>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {entry.navigationType}
                  </span>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-slate-500">
                    Redirect Path: <code className="ml-1 text-slate-700 bg-slate-100 px-1 rounded">{entry.redirectPath}</code>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
