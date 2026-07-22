"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createHeroSlideAction, updateHeroSlideAction } from './actions';
import { HeroSlideRecord } from '@vavaw/db';

interface HeroFormProps {
  initialData?: HeroSlideRecord;
  businesses: Array<{ id: string; name: string }>;
  isEdit?: boolean;
}

export function HeroForm({ initialData, businesses, isEdit = false }: HeroFormProps) {
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

        <div>
          <label className="block text-sm font-medium text-slate-700">Background Media ID / Path</label>
          <input
            type="text"
            value={backgroundMediaId}
            onChange={(e) => setBackgroundMediaId(e.target.value)}
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Preview Media ID / Path</label>
          <input
            type="text"
            value={previewMediaId}
            onChange={(e) => setPreviewMediaId(e.target.value)}
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
          />
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
