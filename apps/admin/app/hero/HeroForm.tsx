"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ImageIcon, AlertCircle } from 'lucide-react';
import { createHeroSlideAction, updateHeroSlideAction } from './actions';
import { HeroSlideRecord } from '@vavaw/db';

export interface MediaAssetOption {
  id: string;
  site_key: string;
  type: string;
  url: string;
  alt_text?: string;
}

interface HeroFormProps {
  initialData?: HeroSlideRecord;
  businesses: Array<{ id: string; name: string }>;
  mediaAssets?: MediaAssetOption[];
  isEdit?: boolean;
}

export function HeroForm({ initialData, businesses, mediaAssets = [], isEdit = false }: HeroFormProps) {
  const router = useRouter();

  const [businessEntryId, setBusinessEntryId] = useState(initialData?.business_entry_id || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [backgroundMediaId, setBackgroundMediaId] = useState(initialData?.background_media_id || '');
  const [previewMediaId, setPreviewMediaId] = useState(initialData?.preview_media_id || '');
  const [ctaLabel, setCtaLabel] = useState(initialData?.cta_label || '');
  const [redirectPath, setRedirectPath] = useState(initialData?.redirect_path || '');
  const [status, setStatus] = useState<'active' | 'draft'>(initialData?.status || 'active');
  const [sortOrder, setSortOrder] = useState<number>(initialData?.sort_order ?? 0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedBgMedia = mediaAssets.find((m) => m.id === backgroundMediaId);
  const selectedPreviewMedia = mediaAssets.find((m) => m.id === previewMediaId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title) {
      setError('Title is required.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      business_entry_id: businessEntryId || undefined,
      title,
      subtitle: subtitle || undefined,
      description: description || undefined,
      background_media_id: backgroundMediaId || undefined,
      preview_media_id: previewMediaId || undefined,
      cta_label: ctaLabel || undefined,
      redirect_path: redirectPath || undefined,
      status,
      sort_order: Number(sortOrder),
    };

    let result;
    if (isEdit && initialData?.id) {
      result = await updateHeroSlideAction(initialData.id, payload);
    } else {
      result = await createHeroSlideAction(payload);
    }

    if (!result.success) {
      setError(result.error || 'Form submission failed');
      setIsSubmitting(false);
    } else {
      router.push('/hero');
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
            <span>No media assets registered in database yet. Upload media first in Media Library to enable image selection.</span>
          </div>
          <Link href="/media" className="text-amber-900 font-semibold underline hover:text-amber-700">
            Go to Media
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Associated Business Entry</label>
          <select
            value={businessEntryId}
            onChange={(e) => setBusinessEntryId(e.target.value)}
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm bg-white"
          >
            <option value="">-- None / General --</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Slide Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Subtitle</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">CTA Label</label>
          <input
            type="text"
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Redirect Path</label>
          <input
            type="text"
            value={redirectPath}
            onChange={(e) => setRedirectPath(e.target.value)}
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
            placeholder="/go/cosmetic"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Status *</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'active' | 'draft')}
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm bg-white"
          >
            <option value="active">active</option>
            <option value="draft">draft</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Sort Order *</label>
          <input
            type="number"
            required
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
          />
        </div>
      </div>

      {/* Media Selection Section */}
      <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Background Media Asset</label>
          {mediaAssets.length > 0 ? (
            <select
              value={backgroundMediaId}
              onChange={(e) => setBackgroundMediaId(e.target.value)}
              className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm bg-white"
            >
              <option value="">-- No media selected --</option>
              {mediaAssets.map((m) => (
                <option key={m.id} value={m.id}>
                  [{m.site_key}] {m.type} - {m.alt_text || m.url.slice(-25)}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={backgroundMediaId}
              onChange={(e) => setBackgroundMediaId(e.target.value)}
              placeholder="Media Asset ID or path"
              className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
            />
          )}

          {selectedBgMedia && (
            <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-md flex items-center gap-3">
              <div className="w-12 h-12 relative bg-slate-200 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                {selectedBgMedia.url.startsWith('http') || selectedBgMedia.url.startsWith('/') ? (
                  <img src={selectedBgMedia.url} alt={selectedBgMedia.alt_text || 'BG Preview'} className="object-cover w-full h-full" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-slate-400" />
                )}
              </div>
              <div className="text-xs text-slate-600 truncate">
                <span className="font-semibold block text-slate-900">{selectedBgMedia.alt_text || 'Background Asset'}</span>
                <span className="truncate block font-mono text-[10px] text-slate-500">{selectedBgMedia.url}</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Preview Media Asset</label>
          {mediaAssets.length > 0 ? (
            <select
              value={previewMediaId}
              onChange={(e) => setPreviewMediaId(e.target.value)}
              className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm bg-white"
            >
              <option value="">-- No media selected --</option>
              {mediaAssets.map((m) => (
                <option key={m.id} value={m.id}>
                  [{m.site_key}] {m.type} - {m.alt_text || m.url.slice(-25)}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={previewMediaId}
              onChange={(e) => setPreviewMediaId(e.target.value)}
              placeholder="Media Asset ID or path"
              className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
            />
          )}

          {selectedPreviewMedia && (
            <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-md flex items-center gap-3">
              <div className="w-12 h-12 relative bg-slate-200 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                {selectedPreviewMedia.url.startsWith('http') || selectedPreviewMedia.url.startsWith('/') ? (
                  <img src={selectedPreviewMedia.url} alt={selectedPreviewMedia.alt_text || 'Preview'} className="object-cover w-full h-full" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-slate-400" />
                )}
              </div>
              <div className="text-xs text-slate-600 truncate">
                <span className="font-semibold block text-slate-900">{selectedPreviewMedia.alt_text || 'Preview Asset'}</span>
                <span className="truncate block font-mono text-[10px] text-slate-500">{selectedPreviewMedia.url}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
        />
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Hero Slide' : 'Create Hero Slide'}
        </button>
        <Link
          href="/hero"
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-md transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
