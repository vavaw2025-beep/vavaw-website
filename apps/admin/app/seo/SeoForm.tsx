"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ImageIcon, AlertCircle } from 'lucide-react';
import { createSeoSettingAction, updateSeoSettingAction } from './actions';
import { SeoSettingRecord } from '@vavaw/db';

export interface MediaAssetOption {
  id: string;
  site_key: string;
  type: string;
  url: string;
  alt_text?: string;
}

interface SeoFormProps {
  initialData?: SeoSettingRecord;
  mediaAssets?: MediaAssetOption[];
  isEdit?: boolean;
}

export function SeoForm({ initialData, mediaAssets = [], isEdit = false }: SeoFormProps) {
  const router = useRouter();

  const [siteKey, setSiteKey] = useState(initialData?.site_key || '');
  const [path, setPath] = useState(initialData?.path || '/');
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [keywordsRaw, setKeywordsRaw] = useState(
    initialData?.keywords ? initialData.keywords.join(', ') : ''
  );
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonical_url || '');
  const [ogMediaId, setOgMediaId] = useState(initialData?.og_media_id || '');
  const [robotsIndex, setRobotsIndex] = useState(initialData?.robots_index ?? true);
  const [robotsFollow, setRobotsFollow] = useState(initialData?.robots_follow ?? true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedOgMedia = mediaAssets.find((m) => m.id === ogMediaId);

  // Filter OG-suitable media assets
  const ogMediaOptions = mediaAssets.filter((m) =>
    ['og-image', 'image', 'hero-image', 'preview-image'].includes(m.type)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!siteKey.trim()) {
      setError('Site Key is required.');
      return;
    }
    if (!path.trim()) {
      setError('Path is required.');
      return;
    }
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    // Validate canonical URL if provided
    if (canonicalUrl.trim()) {
      try {
        new URL(canonicalUrl.trim());
      } catch {
        setError('Canonical URL must be a valid absolute URL (e.g. https://vavaw.vn/page).');
        return;
      }
    }

    setIsSubmitting(true);

    // Parse keywords: split by comma, trim whitespace, filter empty
    const keywords = keywordsRaw
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const payload = {
      site_key: siteKey.trim(),
      path: path.trim(),
      title: title.trim(),
      description: description.trim() || undefined,
      keywords,
      canonical_url: canonicalUrl.trim() || undefined,
      og_media_id: ogMediaId || undefined,
      robots_index: robotsIndex,
      robots_follow: robotsFollow,
    };

    let result;
    if (isEdit && initialData?.id) {
      result = await updateSeoSettingAction(initialData.id, payload);
    } else {
      result = await createSeoSettingAction(payload as any);
    }

    if (!result.success) {
      setError(result.error || 'Form submission failed.');
      setIsSubmitting(false);
    } else {
      router.push('/seo');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow rounded-lg border border-slate-200">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      {mediaAssets.length === 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <span>No media assets registered. Upload OG images in Media Library to enable OG image selection.</span>
          </div>
          <Link href="/media" className="text-amber-900 font-semibold underline hover:text-amber-700">
            Go to Media
          </Link>
        </div>
      )}

      {/* Site Key + Path */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Site Key <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={siteKey}
            onChange={(e) => setSiteKey(e.target.value)}
            placeholder="main"
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
          />
          <p className="mt-1 text-xs text-slate-500">e.g. main, beauty, franchise, admin</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Path <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/"
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm font-mono"
          />
          <p className="mt-1 text-xs text-slate-500">Must start with "/" e.g. / or /cosmetic</p>
        </div>
      </div>

      {/* Title + Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Page Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VAVAW | Brand Ecosystem"
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
          />
          <p className="mt-1 text-xs text-slate-500">{title.length} / 60 chars recommended</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Meta Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short, compelling description for search engines…"
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
          />
          <p className="mt-1 text-xs text-slate-500">{description.length} / 160 chars recommended</p>
        </div>
      </div>

      {/* Keywords + Canonical */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Keywords</label>
          <input
            type="text"
            value={keywordsRaw}
            onChange={(e) => setKeywordsRaw(e.target.value)}
            placeholder="vavaw, cosmetic, beauty, skincare"
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
          />
          <p className="mt-1 text-xs text-slate-500">Comma-separated. Stored as text array.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Canonical URL</label>
          <input
            type="url"
            value={canonicalUrl}
            onChange={(e) => setCanonicalUrl(e.target.value)}
            placeholder="https://vavaw.vn/page"
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm font-mono"
          />
          <p className="mt-1 text-xs text-slate-500">Optional. Must be a valid absolute URL.</p>
        </div>
      </div>

      {/* Robots */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-3">Robots Directives</label>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={robotsIndex}
              onChange={(e) => setRobotsIndex(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">
              <strong>index</strong> — Allow search engines to index this page
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={robotsFollow}
              onChange={(e) => setRobotsFollow(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">
              <strong>follow</strong> — Allow search engines to follow links on this page
            </span>
          </label>
        </div>
      </div>

      {/* OG Image Selection */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-1">OG Image (og_media_id)</label>
        {ogMediaOptions.length > 0 ? (
          <select
            value={ogMediaId}
            onChange={(e) => setOgMediaId(e.target.value)}
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm bg-white"
          >
            <option value="">-- No OG image selected --</option>
            {ogMediaOptions.map((m) => (
              <option key={m.id} value={m.id}>
                [{m.site_key}] {m.type} — {m.alt_text || m.url.slice(-30)}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={ogMediaId}
            onChange={(e) => setOgMediaId(e.target.value)}
            placeholder="Media Asset UUID (optional)"
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm font-mono"
          />
        )}

        {selectedOgMedia && (
          <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-md flex items-center gap-3">
            <div className="w-16 h-10 relative bg-slate-200 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
              {selectedOgMedia.url.startsWith('http') || selectedOgMedia.url.startsWith('/') ? (
                <img
                  src={selectedOgMedia.url}
                  alt={selectedOgMedia.alt_text || 'OG Preview'}
                  className="object-cover w-full h-full"
                />
              ) : (
                <ImageIcon className="h-5 w-5 text-slate-400" />
              )}
            </div>
            <div className="text-xs text-slate-600 truncate">
              <span className="font-semibold block text-slate-900">{selectedOgMedia.alt_text || 'OG Image'}</span>
              <span className="truncate block font-mono text-[10px] text-slate-500">{selectedOgMedia.url}</span>
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update SEO Setting' : 'Create SEO Setting'}
        </button>
        <Link
          href="/seo"
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-md transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
