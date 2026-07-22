import { 
  businessEntries, 
  getActiveBusinessEntries, 
  getComingSoonBusinessEntries, 
  getExternalBusinessEntries, 
  getInternalBusinessEntries 
} from '@vavaw/brand-config';
import { Building2, Globe, Rocket, Link2, MonitorPlay, Pencil } from 'lucide-react';

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
