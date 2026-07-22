import { businessEntries } from '@vavaw/brand-config';
import { Info, Image as ImageIcon, ImagePlus, MonitorPlay } from 'lucide-react';

export default function MediaPage() {
  const groups = [
    {
      title: 'Hero Images',
      icon: ImageIcon,
      description: 'Main background images used in hero sections',
      items: businessEntries.map(e => ({ name: e.name, path: e.media.backgroundImage, type: 'image/jpeg' }))
    },
    {
      title: 'Preview Images',
      icon: ImagePlus,
      description: 'Thumbnail images used for cards and previews',
      items: businessEntries.map(e => ({ name: e.name, path: e.media.previewImage, type: 'image/jpeg' }))
    },
    {
      title: 'Open Graph Images',
      icon: ImagePlus,
      description: 'Images used when sharing links on social media',
      items: businessEntries.map(e => ({ name: e.name, path: e.media.ogImage, type: 'image/jpeg' }))
    },
    {
      title: 'Intro Videos',
      icon: MonitorPlay,
      description: 'Promotional video background loops',
      items: businessEntries.filter(e => e.media.introVideo).map(e => ({ name: e.name, path: e.media.introVideo!, type: 'video/mp4' }))
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
        <p className="mt-1 text-sm text-slate-500">View and manage visual assets across the ecosystem.</p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Static media registry.</strong> Upload management will be added in a later CMS phase.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.title} className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
            <div className="px-4 py-5 border-b border-slate-200 sm:px-6 flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-md">
                <group.icon className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-slate-900">{group.title}</h3>
                <p className="max-w-2xl text-sm text-slate-500">{group.description}</p>
              </div>
            </div>
            
            <div className="border-t border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Business</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">File Path</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {group.items.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-slate-500 italic">No assets configured</td>
                    </tr>
                  ) : (
                    group.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          <code className="bg-slate-100 text-slate-700 px-2 py-1 rounded">{item.path}</code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            {item.type}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
