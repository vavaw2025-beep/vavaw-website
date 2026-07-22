"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBusinessEntryAction, updateBusinessEntryAction } from './actions';
import { BusinessEntryRecord } from '@vavaw/db';

interface BusinessFormProps {
  initialData?: BusinessEntryRecord;
  isEdit?: boolean;
}

export function BusinessForm({ initialData, isEdit = false }: BusinessFormProps) {
  const router = useRouter();

  const [slug, setSlug] = useState(initialData?.slug || '');
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [navigationType, setNavigationType] = useState<'internal' | 'external-app'>(
    initialData?.navigation_type || 'internal'
  );
  const [href, setHref] = useState(initialData?.href || '');
  const [redirectPath, setRedirectPath] = useState(initialData?.redirect_path || '');
  const [status, setStatus] = useState<'active' | 'coming-soon' | 'draft'>(
    initialData?.status || 'active'
  );
  const [sortOrder, setSortOrder] = useState<number>(initialData?.sort_order ?? 0);
  const [ctaLabel, setCtaLabel] = useState(initialData?.cta_label || '');

  const [themeJson, setThemeJson] = useState(
    JSON.stringify(
      initialData?.theme || {
        primary: '#000000',
        secondary: '#000000',
        background: '#000000',
        text: '#ffffff',
        accent: '#000000',
      },
      null,
      2
    )
  );

  const [mediaJson, setMediaJson] = useState(
    JSON.stringify(
      initialData?.media || {
        backgroundImage: '',
        previewImage: '',
        ogImage: '',
      },
      null,
      2
    )
  );

  const [seoJson, setSeoJson] = useState(
    JSON.stringify(
      initialData?.seo || {
        title: '',
        description: '',
        keywords: [],
        canonicalUrl: '',
      },
      null,
      2
    )
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let parsedTheme = {};
    let parsedMedia = {};
    let parsedSeo = {};

    try {
      parsedTheme = JSON.parse(themeJson);
    } catch {
      setError('Theme JSON is invalid.');
      return;
    }

    try {
      parsedMedia = JSON.parse(mediaJson);
    } catch {
      setError('Media JSON is invalid.');
      return;
    }

    try {
      parsedSeo = JSON.parse(seoJson);
    } catch {
      setError('SEO JSON is invalid.');
      return;
    }

    if (!slug || !name || !title || !href || !redirectPath) {
      setError('Slug, Name, Title, Href, and Redirect Path are required.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      slug,
      name,
      category,
      title,
      subtitle: subtitle || undefined,
      description: description || undefined,
      navigation_type: navigationType,
      href,
      redirect_path: redirectPath,
      status,
      sort_order: Number(sortOrder),
      cta_label: ctaLabel || undefined,
      theme: parsedTheme,
      media: parsedMedia,
      seo: parsedSeo,
    };

    let result;
    if (isEdit && initialData?.id) {
      result = await updateBusinessEntryAction(initialData.id, payload);
    } else {
      result = await createBusinessEntryAction(payload);
    }

    if (!result.success) {
      setError(result.error || 'Form submission failed');
      setIsSubmitting(false);
    } else {
      router.push('/business');
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
          <label className="block text-sm font-medium text-slate-700">Slug *</label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
            placeholder="e.g. cosmetic"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Business Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
            placeholder="e.g. VAVAW Cosmetic"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Category *</label>
          <input
            type="text"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
            placeholder="e.g. Cosmetic"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Title *</label>
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
            placeholder="e.g. Explore Cosmetic"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Navigation Type *</label>
          <select
            value={navigationType}
            onChange={(e) => setNavigationType(e.target.value as 'internal' | 'external-app')}
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm bg-white"
          >
            <option value="internal">internal</option>
            <option value="external-app">external-app</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Href *</label>
          <input
            type="text"
            required
            value={href}
            onChange={(e) => setHref(e.target.value)}
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
            placeholder="/cosmetic or https://beauty.vavaw.vn"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Redirect Path *</label>
          <input
            type="text"
            required
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
            onChange={(e) => setStatus(e.target.value as 'active' | 'coming-soon' | 'draft')}
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm bg-white"
          >
            <option value="active">active</option>
            <option value="coming-soon">coming-soon</option>
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

      <div>
        <label className="block text-sm font-medium text-slate-700">Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border border-slate-300 rounded-md p-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Theme JSON</label>
          <textarea
            rows={5}
            value={themeJson}
            onChange={(e) => setThemeJson(e.target.value)}
            className="mt-1 block w-full font-mono text-xs border border-slate-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Media JSON</label>
          <textarea
            rows={5}
            value={mediaJson}
            onChange={(e) => setMediaJson(e.target.value)}
            className="mt-1 block w-full font-mono text-xs border border-slate-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">SEO JSON</label>
          <textarea
            rows={5}
            value={seoJson}
            onChange={(e) => setSeoJson(e.target.value)}
            className="mt-1 block w-full font-mono text-xs border border-slate-300 rounded-md p-2"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Business' : 'Create Business'}
        </button>
        <Link
          href="/business"
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-md transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
