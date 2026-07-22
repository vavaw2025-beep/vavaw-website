"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Code, HelpCircle } from 'lucide-react';
import { createContentBlockAction, updateContentBlockAction } from './actions';
import { ContentBlockRecord } from '@vavaw/db';

const BLOCK_TYPES = [
  'hero',
  'rich_text',
  'feature_grid',
  'product_highlights',
  'quality_promise',
  'gallery',
  'faq',
  'cta',
  'custom_json'
];

const SITE_KEYS = [
  'main',
  'cosmetic',
  'beauty',
  'franchise',
  'shared'
];

interface ContentBlockFormProps {
  initialData?: ContentBlockRecord;
  isEdit?: boolean;
}

export function ContentBlockForm({ initialData, isEdit = false }: ContentBlockFormProps) {
  const router = useRouter();

  const [siteKey, setSiteKey] = useState(initialData?.site_key || 'main');
  const [pagePath, setPagePath] = useState(initialData?.page_path || '/');
  const [blockType, setBlockType] = useState(initialData?.block_type || 'rich_text');
  
  // Format initial content nicely if it exists
  const initialContentString = initialData?.content 
    ? JSON.stringify(initialData.content, null, 2) 
    : '{\n  \n}';
    
  const [contentString, setContentString] = useState(initialContentString);
  const [sortOrder, setSortOrder] = useState<number>(initialData?.sort_order ?? 0);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContentString(val);
    
    // Try to parse to provide immediate feedback
    if (val.trim() === '') {
      setJsonError('Content cannot be empty');
      return;
    }
    
    try {
      JSON.parse(val);
      setJsonError(null);
    } catch (err: any) {
      setJsonError(`Invalid JSON: ${err.message}`);
    }
  };

  const insertExample = (example: string) => {
    setContentString(example);
    setJsonError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!siteKey.trim()) {
      setError('Site Key is required.');
      return;
    }
    if (!pagePath.trim()) {
      setError('Page Path is required.');
      return;
    }
    if (!blockType.trim()) {
      setError('Block Type is required.');
      return;
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(contentString);
    } catch (err: any) {
      setError(`Invalid JSON content: ${err.message}`);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      site_key: siteKey.trim(),
      page_path: pagePath.trim(),
      block_type: blockType.trim(),
      content: parsedContent,
      sort_order: sortOrder,
      is_active: isActive,
    };

    let result;
    if (isEdit && initialData?.id) {
      result = await updateContentBlockAction(initialData.id, payload);
    } else {
      result = await createContentBlockAction(payload as any);
    }

    if (!result.success) {
      setError(result.error || 'Form submission failed.');
      setIsSubmitting(false);
    } else {
      router.push('/content');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 shadow rounded-lg border border-slate-200">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md flex items-start gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Basic Settings */}
      <div>
        <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2 mb-4">Location & Identity</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Site Key <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={siteKey}
              onChange={(e) => setSiteKey(e.target.value)}
              className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm bg-white"
            >
              {SITE_KEYS.map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
              <option value="other">Other (Custom)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Page Path <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={pagePath}
              onChange={(e) => setPagePath(e.target.value)}
              placeholder="/about"
              className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm font-mono"
            />
            <p className="mt-1 text-xs text-slate-500">Must start with "/"</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Block Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={blockType}
              onChange={(e) => setBlockType(e.target.value)}
              className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm bg-white font-mono"
            >
              {BLOCK_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4">
          <h3 className="text-lg font-medium text-slate-900">JSON Content Data</h3>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <HelpCircle className="h-3 w-3" /> Examples:
            </span>
            <button 
              type="button" 
              onClick={() => insertExample('{\n  "eyebrow": "Brand Story",\n  "title": "Clean beauty inspired by Korean skincare",\n  "body": "Write section content here."\n}')}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
            >
              rich_text
            </button>
            <button 
              type="button" 
              onClick={() => insertExample('{\n  "items": [\n    {\n      "title": "Gentle Formula",\n      "description": "Suitable for daily care."\n    }\n  ]\n}')}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
            >
              feature_grid
            </button>
            <button 
              type="button" 
              onClick={() => insertExample('{\n  "title": "Ready to explore VAVAW?",\n  "description": "Start your beauty journey today.",\n  "buttonLabel": "Contact us",\n  "buttonHref": "/contact"\n}')}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
            >
              cta
            </button>
          </div>
        </div>

        <div>
          <div className={`border rounded-md overflow-hidden ${jsonError ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-300'}`}>
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-2 text-xs text-slate-600 font-medium">
              <Code className="h-4 w-4" />
              <span>content (JSON)</span>
            </div>
            <textarea
              required
              rows={12}
              value={contentString}
              onChange={handleJsonChange}
              className="block w-full p-3 text-sm font-mono focus:outline-none focus:ring-0 border-0"
              spellCheck={false}
            />
          </div>
          {jsonError && (
            <p className="mt-2 text-xs text-red-600 font-medium">{jsonError}</p>
          )}
        </div>
      </div>

      {/* Display & Ordering */}
      <div>
        <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2 mb-4">Display Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Sort Order</label>
            <input
              type="number"
              required
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value, 10))}
              className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
            />
            <p className="mt-1 text-xs text-slate-500">Lower numbers appear first on the page.</p>
          </div>

          <div className="flex items-center mt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">
                Active (render on public site)
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={isSubmitting || !!jsonError}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Content Block' : 'Create Content Block'}
        </button>
        <Link
          href="/content"
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-md transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
