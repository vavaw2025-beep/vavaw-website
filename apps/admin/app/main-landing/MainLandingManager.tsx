"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutTemplate,
  Presentation,
  Building2,
  Layers,
  Sparkles,
  Search,
  Eye,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Plus,
  Save,
  Trash2,
  ArrowUp,
  ArrowDown,
  Globe,
  ShieldCheck,
  FileCode2,
  Check,
  EyeOff,
  SlidersHorizontal,
  Loader2
} from 'lucide-react';
import { updateContentBlockAction, createContentBlockAction } from '../content/actions';
import { updateHeroSlideAction, createHeroSlideAction } from '../hero/actions';
import { updateBusinessEntryAction, createBusinessEntryAction } from '../business/actions';
import { updateSeoSettingAction, createSeoSettingAction } from '../seo/actions';

interface MainLandingManagerProps {
  initialBlocks: any[];
  initialHeroSlides: any[];
  initialBusinessEntries: any[];
  initialSeo: any;
  isSupabaseMode: boolean;
  role: string;
  queryError: string | null;
}

export function MainLandingManager({
  initialBlocks,
  initialHeroSlides,
  initialBusinessEntries,
  initialSeo,
  isSupabaseMode,
  role,
  queryError
}: MainLandingManagerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'hero' | 'ecosystem' | 'sections' | 'cta' | 'seo' | 'preview'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Status message state
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Local state copies
  const [blocks, setBlocks] = useState<any[]>(initialBlocks);
  const [heroSlides, setHeroSlides] = useState<any[]>(initialHeroSlides);
  const [businessEntries, setBusinessEntries] = useState<any[]>(initialBusinessEntries);
  const [seo, setSeo] = useState<any>(initialSeo || {
    site_key: 'main',
    path: '/',
    title: 'VAVAW Ecosystem | Premium Beauty & Cosmetic',
    description: 'Hệ sinh thái chăm sóc sắc đẹp, mỹ phẩm và mô hình hợp tác thương hiệu của VAVAW.',
    canonical_url: 'https://vavaw.vn/',
    robots_index: true,
    robots_follow: true
  });

  // Filter state for Sections tab
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'active' | 'hidden'>('all');
  const [togglingBlockId, setTogglingBlockId] = useState<string | null>(null);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('success', 'Đã làm mới dữ liệu từ server.');
    }, 600);
  };

  // Section Visibility Toggle Handler
  const handleToggleSectionVisibility = async (block: any) => {
    if (!isSupabaseMode) {
      showToast('error', 'Chế độ static fallback không hỗ trợ lưu dữ liệu.');
      return;
    }

    const nextIsActive = !block.is_active;
    setTogglingBlockId(block.id);

    // Optimistic UI update
    setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, is_active: nextIsActive } : b));

    const payload = {
      site_key: 'main',
      page_path: '/',
      block_type: block.block_type,
      sort_order: block.sort_order ?? 10,
      is_active: nextIsActive,
      content: block.content
    };

    let res;
    if (block.id && !block.id.startsWith('temp-')) {
      res = await updateContentBlockAction(block.id, payload);
    } else {
      res = await createContentBlockAction(payload);
    }

    setTogglingBlockId(null);

    if (res.success) {
      showToast('success', `Đã ${nextIsActive ? 'bật' : 'tắt'} hiển thị section ${block.block_type}!`);
      router.refresh();
    } else {
      // Revert optimistic UI on error
      setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, is_active: block.is_active } : b));
      showToast('error', res.error || 'Lỗi khi cập nhật trạng thái hiển thị.');
    }
  };

  // Bulk Visibility Handler
  const handleBulkToggleVisibility = async (nextIsActive: boolean) => {
    if (!isSupabaseMode) {
      showToast('error', 'Chế độ static fallback không hỗ trợ lưu dữ liệu.');
      return;
    }

    if (!nextIsActive) {
      const confirmHide = window.confirm(
        'Bạn chắc chắn muốn ẩn toàn bộ section trang chủ? Hero và Ecosystem cards vẫn không bị ảnh hưởng.'
      );
      if (!confirmHide) return;
    }

    setIsBulkLoading(true);
    let successCount = 0;

    const mainBlocks = blocks.filter(b => b.block_type.startsWith('main-'));

    for (const block of mainBlocks) {
      if (block.is_active === nextIsActive) continue;

      const payload = {
        site_key: 'main',
        page_path: '/',
        block_type: block.block_type,
        sort_order: block.sort_order ?? 10,
        is_active: nextIsActive,
        content: block.content
      };

      let res;
      if (block.id && !block.id.startsWith('temp-')) {
        res = await updateContentBlockAction(block.id, payload);
      } else {
        res = await createContentBlockAction(payload);
      }

      if (res.success) {
        successCount++;
      }
    }

    setIsBulkLoading(false);
    setBlocks(prev => prev.map(b => b.block_type.startsWith('main-') ? { ...b, is_active: nextIsActive } : b));
    showToast('success', `Đã ${nextIsActive ? 'hiển thị' : 'ẩn'} toàn bộ (${successCount}) section trang chủ!`);
    router.refresh();
  };

  // Find or default final CTA block
  const finalCtaBlock = blocks.find(b => b.block_type === 'main-final-cta') || {
    id: 'temp-final-cta',
    site_key: 'main',
    page_path: '/',
    block_type: 'main-final-cta',
    sort_order: 30,
    is_active: true,
    content: {
      eyebrow: 'VAVAW ECOSYSTEM',
      title: 'Bắt đầu hành trình cùng VAVAW',
      description: 'Khám phá hệ sinh thái chăm sóc sắc đẹp, mỹ phẩm và mô hình hợp tác thương hiệu của VAVAW.',
      primaryCtaLabel: 'Khám phá VAVAW Cosmetic',
      primaryCtaHref: '/cosmetic',
      secondaryCtaLabel: 'Liên hệ tư vấn',
      secondaryCtaHref: '/contact?type=general_inquiry&source=main_final_cta',
      trustPoints: [
        'Định hướng mỹ phẩm lâm sàng Hàn Quốc',
        'Hệ sinh thái sắc đẹp cao cấp',
        'Nền tảng thương hiệu sẵn sàng nhượng quyền'
      ]
    }
  };

  const [ctaForm, setCtaForm] = useState(finalCtaBlock.content);

  // Handle CTA Save
  const handleSaveCta = async () => {
    if (!isSupabaseMode) {
      showToast('error', 'Chế độ static fallback không hỗ trợ lưu dữ liệu.');
      return;
    }

    const payload = {
      site_key: 'main',
      page_path: '/',
      block_type: 'main-final-cta',
      sort_order: 30,
      is_active: true,
      content: ctaForm
    };

    let res;
    if (finalCtaBlock.id && !finalCtaBlock.id.startsWith('temp-')) {
      res = await updateContentBlockAction(finalCtaBlock.id, payload);
    } else {
      res = await createContentBlockAction(payload);
    }

    if (res.success) {
      showToast('success', 'Đã lưu cấu hình CTA cuối trang!');
      router.refresh();
    } else {
      showToast('error', res.error || 'Lỗi khi lưu CTA.');
    }
  };

  // Handle SEO Save
  const [seoForm, setSeoForm] = useState({
    title: seo.title || '',
    description: seo.description || '',
    keywords: Array.isArray(seo.keywords) ? seo.keywords.join(', ') : seo.keywords || 'vavaw, cosmetic, beauty, franchise',
    canonical_url: seo.canonical_url || 'https://vavaw.vn/',
    og_title: seo.og_title || '',
    og_description: seo.og_description || '',
    og_image_url: seo.og_image_url || ''
  });

  const handleSaveSeo = async () => {
    if (!isSupabaseMode) {
      showToast('error', 'Chế độ static fallback không hỗ trợ lưu dữ liệu.');
      return;
    }

    const payload = {
      site_key: 'main',
      path: '/',
      title: seoForm.title.trim(),
      description: seoForm.description.trim(),
      keywords: seoForm.keywords.trim() ? seoForm.keywords.split(',').map((k: string) => k.trim()) : [],
      canonical_url: seoForm.canonical_url.trim() || 'https://vavaw.vn/',
      og_title: seoForm.og_title.trim() || undefined,
      og_description: seoForm.og_description.trim() || undefined,
      og_image_url: seoForm.og_image_url.trim() || undefined,
      robots_index: true,
      robots_follow: true
    };

    let res;
    if (seo.id) {
      res = await updateSeoSettingAction(seo.id, payload);
    } else {
      res = await createSeoSettingAction(payload);
    }

    if (res.success) {
      showToast('success', 'Đã cập nhật cấu hình SEO trang chủ!');
      router.refresh();
    } else {
      showToast('error', res.error || 'Lỗi khi lưu SEO.');
    }
  };

  // Section Block Editor Component
  const [editingBlock, setEditingBlock] = useState<any | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleOpenBlockEdit = (block: any) => {
    setEditingBlock(block);
    setJsonText(JSON.stringify(block.content || {}, null, 2));
    setJsonError(null);
  };

  const handleSaveBlock = async () => {
    if (!editingBlock) return;
    if (!isSupabaseMode) {
      showToast('error', 'Chế độ static fallback không hỗ trợ lưu dữ liệu.');
      return;
    }

    let updatedContent = editingBlock.content;

    try {
      if (jsonText.trim()) {
        updatedContent = JSON.parse(jsonText);
      }
    } catch (e: any) {
      setJsonError(`Lỗi định dạng JSON: ${e.message}`);
      return;
    }

    const payload = {
      site_key: 'main',
      page_path: '/',
      block_type: editingBlock.block_type,
      sort_order: editingBlock.sort_order ?? 10,
      is_active: editingBlock.is_active ?? true,
      content: updatedContent
    };

    let res;
    if (editingBlock.id && !editingBlock.id.startsWith('temp-')) {
      res = await updateContentBlockAction(editingBlock.id, payload);
    } else {
      res = await createContentBlockAction(payload);
    }

    if (res.success) {
      showToast('success', `Đã lưu khối nội dung ${editingBlock.block_type}!`);
      setEditingBlock(null);
      router.refresh();
    } else {
      showToast('error', res.error || 'Lỗi khi lưu khối nội dung.');
    }
  };

  // Section Filtering Logic
  const filteredBlocks = blocks.filter(b => {
    if (visibilityFilter === 'active') return b.is_active;
    if (visibilityFilter === 'hidden') return !b.is_active;
    return true;
  });

  const activeBlocksCount = blocks.filter(b => b.is_active).length;
  const hiddenBlocksCount = blocks.filter(b => !b.is_active).length;
  const hiddenBlockTypes = blocks.filter(b => !b.is_active).map(b => b.block_type);

  const ecosystemBlock = blocks.find(b => b.block_type === 'main-ecosystem-intro');
  const ctaBlock = blocks.find(b => b.block_type === 'main-final-cta');

  // Checklist verification
  const checklist = [
    { label: 'Hero Slides đang hoạt động', ok: heroSlides.filter(s => s.status === 'active').length > 0 },
    { label: 'Business Entries đang hoạt động', ok: businessEntries.filter(b => b.status === 'active').length > 0 },
    {
      label: `Portfolio 3 thương hiệu: ${ecosystemBlock ? (ecosystemBlock.is_active ? 'Đang hiển thị' : 'Đang ẩn trên public') : 'Mặc định (Hiển thị)'}`,
      ok: true
    },
    {
      label: `Final CTA: ${ctaBlock ? (ctaBlock.is_active ? 'Đang hiển thị' : 'Đang ẩn trên public') : 'Mặc định (Hiển thị)'}`,
      ok: true
    },
    { label: 'Cấu hình SEO cho trang chủ tồn tại', ok: Boolean(seo && (seo.title || seo.id)) },
    { label: 'Không có liên kết CTA bị bỏ trống (#)', ok: !blocks.some(b => (b.content?.primaryCtaHref === '#' || b.content?.secondaryCtaHref === '#')) },
    { label: 'Tất cả khối hiển thị đều có tiêu đề hợp lệ', ok: blocks.every(b => !b.is_active || Boolean(b.content?.title || b.content?.eyebrow)) }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <LayoutTemplate className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">Main Landing Manager</h1>
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
              isSupabaseMode ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {isSupabaseMode ? 'Supabase CMS' : 'Static Fallback'}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý tập trung toàn bộ nội dung, banner hero, hệ sinh thái và SEO của trang chủ <span className="font-mono text-slate-700 font-medium">vavaw.vn</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Làm mới dữ liệu</span>
          </button>
          <a
            href="https://vavaw.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Xem trang Public</span>
          </a>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-rose-600" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Query Error Notice */}
      {queryError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-800 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-rose-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Lỗi kết nối dữ liệu Supabase:</p>
            <p className="font-mono text-xs mt-1">{queryError}</p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2">
        <nav className="flex space-x-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutTemplate },
            { id: 'hero', label: 'Hero Banner', icon: Presentation },
            { id: 'ecosystem', label: 'Ecosystem', icon: Building2 },
            { id: 'sections', label: 'Sections & Visibility', icon: Layers },
            { id: 'cta', label: 'Final CTA', icon: Sparkles },
            { id: 'seo', label: 'SEO Settings', icon: Search },
            { id: 'preview', label: 'Preview & Checklist', icon: Eye }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-1 border-b-2 font-medium text-xs flex items-center gap-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* TAB CONTENTS */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Trạng thái Trang chủ</span>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xl font-bold text-slate-900">vavaw.vn</span>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="mt-1 text-xs text-slate-500">Live & Ready</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hero Slides</span>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-900">
                  {heroSlides.filter(s => s.status === 'active').length} / {heroSlides.length}
                </span>
                <Presentation className="h-5 w-5 text-indigo-500" />
              </div>
              <p className="mt-1 text-xs text-slate-500">Banner đang chạy</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Business Entries</span>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-900">
                  {businessEntries.filter(b => b.status === 'active').length} / {businessEntries.length}
                </span>
                <Building2 className="h-5 w-5 text-blue-500" />
              </div>
              <p className="mt-1 text-xs text-slate-500">Trụ cột thương hiệu</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Homepage Sections</span>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-900">{activeBlocksCount} / {blocks.length}</span>
                <Layers className="h-5 w-5 text-purple-500" />
              </div>
              <p className="mt-1 text-xs text-slate-500">Đang hiển thị trên public</p>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Tổng quan Cấu hình Trang chủ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">SEO Title</span>
                <p className="font-medium text-slate-800 mt-1">{seo?.title || 'Chưa cấu hình (Đang dùng mặc định)'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Canonical Path</span>
                <code className="block text-xs font-mono text-blue-600 mt-1">{seo?.canonical_url || 'https://vavaw.vn/'}</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. HERO TAB */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">Danh sách Banner Hero Trang chủ</h2>
              <p className="text-xs text-slate-500">Được hiển thị trực tiếp trên slider của trang chính vavaw.vn</p>
            </div>
            <Link
              href="/hero/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm Banner Hero</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {heroSlides.map((slide, idx) => (
              <div key={slide.id || idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 font-mono">#{slide.sort_order ?? idx + 1}</span>
                    <h3 className="font-bold text-slate-900">{slide.title}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                      slide.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {slide.status}
                    </span>
                  </div>
                  {slide.subtitle && <p className="text-xs font-medium text-blue-600">{slide.subtitle}</p>}
                  {slide.description && <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl">{slide.description}</p>}
                  {slide.redirect_path && (
                    <code className="inline-block text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
                      CTA Href: {slide.redirect_path}
                    </code>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/hero/${slide.id}/edit`}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                  >
                    Chỉnh sửa chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ECOSYSTEM TAB */}
      {activeTab === 'ecosystem' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Hệ sinh thái Trụ cột VAVAW</h2>
            <p className="text-xs text-slate-500">Quản lý các khối thương hiệu Cosmetic, Beauty & Co và Franchise trên trang chủ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {businessEntries.map((entry, idx) => (
              <div key={entry.id || idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{entry.slug}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                      entry.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {entry.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{entry.name}</h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{entry.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <code className="text-slate-500 font-mono truncate">{entry.redirect_path || entry.href || '/'}</code>
                  <Link
                    href={`/business/${entry.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sửa
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SECTIONS TAB */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          {/* Header Controls & Bulk Actions */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Quản lý & Ẩn/Hiện Khối Nội dung Trang chủ</h2>
              <p className="text-xs text-slate-500">Bật hoặc tắt từng section hiển thị trên trang public vavaw.vn</p>
            </div>

            {/* Quick Bulk Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkToggleVisibility(true)}
                disabled={isBulkLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-colors border border-emerald-200 disabled:opacity-50"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Hiện tất cả</span>
              </button>
              <button
                onClick={() => handleBulkToggleVisibility(false)}
                disabled={isBulkLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition-colors border border-rose-200 disabled:opacity-50"
              >
                <EyeOff className="h-3.5 w-3.5" />
                <span>Ẩn tất cả</span>
              </button>
            </div>
          </div>

          {/* Cross-app Revalidation & Managed Visibility Info */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
            <SlidersHorizontal className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" />
            <div className="space-y-1">
              <p>
                <span className="font-semibold">Public chỉ render section Main Landing khi block tương ứng đang active.</span>{' '}
                Nếu block bị ẩn, section legacy tương ứng cũng sẽ không hiển thị.
              </p>
              <p className="text-blue-700">
                Admin và Main là 2 deployment riêng — sau khi ẩn/hiện section,{' '}
                <span className="font-mono">vavaw-main</span> sẽ được revalidate qua API.
                Nếu thiếu <span className="font-mono">REVALIDATION_SECRET</span>, public cập nhật sau tối đa{' '}
                <span className="font-semibold">30 giây</span> (ISR fallback tự động).
              </p>
            </div>
          </div>

          {/* Visibility Filter Pills */}
          <div className="flex items-center justify-between bg-slate-100/80 p-1.5 rounded-xl border border-slate-200">
            <div className="flex items-center space-x-1">
              {[
                { id: 'all', label: 'Tất cả', count: blocks.length },
                { id: 'active', label: 'Đang hiển thị', count: activeBlocksCount },
                { id: 'hidden', label: 'Đang ẩn', count: hiddenBlocksCount }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setVisibilityFilter(f.id as any)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    visibilityFilter === f.id
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                    visibilityFilter === f.id ? 'bg-slate-100 text-slate-800' : 'bg-slate-200/60 text-slate-600'
                  }`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section Cards */}
          <div className="space-y-4">
            {filteredBlocks.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
                Không có section nào phù hợp với bộ lọc.
              </div>
            ) : (
              filteredBlocks.map((block, idx) => {
                const isToggling = togglingBlockId === block.id;
                const isHidden = !block.is_active;

                return (
                  <div
                    key={block.id || idx}
                    className={`p-5 rounded-xl transition-all ${
                      isHidden
                        ? 'bg-slate-50/70 border-dashed border-2 border-slate-300 opacity-80'
                        : 'bg-white border border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">
                          {block.block_type}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                          block.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {block.is_active ? 'Hiển thị' : 'Đang ẩn'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Section Toggle Button */}
                        <button
                          onClick={() => handleToggleSectionVisibility(block)}
                          disabled={isToggling}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 ${
                            block.is_active
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isToggling ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : block.is_active ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                          <span>{block.is_active ? 'Ẩn section' : 'Hiện section'}</span>
                        </button>

                        <button
                          onClick={() => handleOpenBlockEdit(block)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors"
                        >
                          Chỉnh sửa khối
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium">Eyebrow:</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{block.content?.eyebrow || '-'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Title:</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{block.content?.title || '-'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-slate-400 font-medium">Description:</span>
                        <p className="text-slate-600 mt-0.5">{block.content?.description || '-'}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>
                        {block.block_type === 'main-ecosystem-intro'
                          ? 'Điều khiển section portfolio 3 thương hiệu trên trang chủ. Nếu đã ẩn nhưng public vẫn hiện, hãy kiểm tra vavaw-main deployment/revalidation.'
                          : block.block_type === 'main-final-cta'
                          ? 'Điều khiển CTA cuối trang chủ.'
                          : block.block_type === 'main-brand-story'
                          ? 'Điều khiển section brand story/trình bày thương hiệu nếu public renderer hỗ trợ.'
                          : isHidden
                          ? 'Section này đang tắt trên trang public.'
                          : 'Section này đang được hiển thị nếu public renderer hỗ trợ block này.'}
                      </span>
                      <span className="font-mono">Sort order: {block.sort_order ?? 10}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Modal / Form for editing section block */}
          {editingBlock && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">Chỉnh sửa Khối: {editingBlock.block_type}</h3>
                  <button
                    onClick={() => setEditingBlock(null)}
                    className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Eyebrow</label>
                    <input
                      type="text"
                      value={editingBlock.content?.eyebrow || ''}
                      onChange={e => setEditingBlock({
                        ...editingBlock,
                        content: { ...editingBlock.content, eyebrow: e.target.value }
                      })}
                      className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editingBlock.content?.title || ''}
                      onChange={e => setEditingBlock({
                        ...editingBlock,
                        content: { ...editingBlock.content, title: e.target.value }
                      })}
                      className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Headline</label>
                    <input
                      type="text"
                      value={editingBlock.content?.headline || ''}
                      onChange={e => setEditingBlock({
                        ...editingBlock,
                        content: { ...editingBlock.content, headline: e.target.value }
                      })}
                      className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingBlock.content?.description || ''}
                      onChange={e => setEditingBlock({
                        ...editingBlock,
                        content: { ...editingBlock.content, description: e.target.value }
                      })}
                      className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Primary CTA Label</label>
                      <input
                        type="text"
                        value={editingBlock.content?.primaryCtaLabel || ''}
                        onChange={e => setEditingBlock({
                          ...editingBlock,
                          content: { ...editingBlock.content, primaryCtaLabel: e.target.value }
                        })}
                        className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Primary CTA Href</label>
                      <input
                        type="text"
                        value={editingBlock.content?.primaryCtaHref || ''}
                        onChange={e => setEditingBlock({
                          ...editingBlock,
                          content: { ...editingBlock.content, primaryCtaHref: e.target.value }
                        })}
                        className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Advanced JSON Editor */}
                  <div className="pt-3 border-t border-slate-200">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nâng cao: Cấu hình JSON thô</label>
                    <textarea
                      rows={6}
                      value={jsonText}
                      onChange={e => {
                        setJsonText(e.target.value);
                        setJsonError(null);
                      }}
                      className="w-full text-xs font-mono p-3 bg-slate-900 text-slate-100 rounded-lg border border-slate-700 focus:outline-none"
                    />
                    {jsonError && <p className="text-xs text-rose-600 mt-1">{jsonError}</p>}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setEditingBlock(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveBlock}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-sm"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. CTA TAB */}
      {activeTab === 'cta' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Khối CTA Cuối Trang chủ (main-final-cta)</h2>
            <p className="text-xs text-slate-500">Kêu gọi hành động chính ở cuối trang chính vavaw.vn</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={ctaForm.eyebrow || ''}
                  onChange={e => setCtaForm({ ...ctaForm, eyebrow: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={ctaForm.title || ''}
                  onChange={e => setCtaForm({ ...ctaForm, title: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={ctaForm.description || ''}
                onChange={e => setCtaForm({ ...ctaForm, description: e.target.value })}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary CTA Label</label>
                <input
                  type="text"
                  value={ctaForm.primaryCtaLabel || ''}
                  onChange={e => setCtaForm({ ...ctaForm, primaryCtaLabel: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary CTA Href</label>
                <input
                  type="text"
                  value={ctaForm.primaryCtaHref || ''}
                  onChange={e => setCtaForm({ ...ctaForm, primaryCtaHref: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Secondary CTA Label</label>
                <input
                  type="text"
                  value={ctaForm.secondaryCtaLabel || ''}
                  onChange={e => setCtaForm({ ...ctaForm, secondaryCtaLabel: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Secondary CTA Href</label>
                <input
                  type="text"
                  value={ctaForm.secondaryCtaHref || ''}
                  onChange={e => setCtaForm({ ...ctaForm, secondaryCtaHref: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Trust Points (phân tách dòng)</label>
              <textarea
                rows={3}
                value={Array.isArray(ctaForm.trustPoints) ? ctaForm.trustPoints.join('\n') : ''}
                onChange={e => setCtaForm({ ...ctaForm, trustPoints: e.target.value.split('\n').filter(Boolean) })}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg font-sans"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleSaveCta}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Lưu CTA cuối trang</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. SEO TAB */}
      {activeTab === 'seo' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Cấu hình SEO Trang chủ (vavaw.vn)</h2>
            <p className="text-xs text-slate-500">Quản lý thẻ Title, Meta Description và Open Graph cho path = "/"</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Meta Title</label>
              <input
                type="text"
                value={seoForm.title}
                onChange={e => setSeoForm({ ...seoForm, title: e.target.value })}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Meta Description</label>
              <textarea
                rows={3}
                value={seoForm.description}
                onChange={e => setSeoForm({ ...seoForm, description: e.target.value })}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Canonical URL</label>
              <input
                type="text"
                value={seoForm.canonical_url}
                onChange={e => setSeoForm({ ...seoForm, canonical_url: e.target.value })}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs text-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Open Graph Title</label>
                <input
                  type="text"
                  value={seoForm.og_title}
                  onChange={e => setSeoForm({ ...seoForm, og_title: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Open Graph Image URL</label>
                <input
                  type="text"
                  value={seoForm.og_image_url}
                  onChange={e => setSeoForm({ ...seoForm, og_image_url: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleSaveSeo}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Lưu Cấu hình SEO</span>
            </button>
          </div>
        </div>
      )}

      {/* 7. PREVIEW & CHECKLIST TAB */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          {/* Quick links */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Liên kết Xem trước & Kiểm tra</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="https://vavaw.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors"
              >
                <span>Trang chính vavaw.vn</span>
                <ExternalLink className="h-4 w-4 text-blue-600" />
              </a>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors"
              >
                <span>Tuyến đường cục bộ (/)</span>
                <Eye className="h-4 w-4 text-emerald-600" />
              </a>

              <a
                href="/system-update?reason=coming-soon&from=/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors"
              >
                <span>System Update Fallback</span>
                <AlertCircle className="h-4 w-4 text-amber-600" />
              </a>
            </div>
          </div>

          {/* Section Summary */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900">Tổng quan Trạng thái Section Trang chủ</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-medium">Tổng số section:</span>
                <p className="text-lg font-bold text-slate-900 mt-1">{blocks.length}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-emerald-700 font-medium">Section đang hiện:</span>
                <p className="text-lg font-bold text-emerald-900 mt-1">{activeBlocksCount}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-amber-700 font-medium">Section đang ẩn:</span>
                <p className="text-lg font-bold text-amber-900 mt-1">{hiddenBlocksCount}</p>
              </div>
            </div>

            {hiddenBlocksCount > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2 mt-3">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Lưu ý ẩn Section:</p>
                  <p className="mt-0.5">
                    Bạn đang ẩn {hiddenBlocksCount} section trang chủ ({hiddenBlockTypes.join(', ')}). Điều này không ảnh hưởng đến Banner Hero hoặc Ecosystem cards.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Checklist */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Danh sách Kiểm tra An toàn Trang chủ</h2>
            <div className="space-y-2">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  {item.ok ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Đạt</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                      <span>Cần kiểm tra</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
