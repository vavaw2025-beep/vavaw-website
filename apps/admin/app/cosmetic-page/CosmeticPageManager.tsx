"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateContentBlockAction } from '../content/actions';
import { removeCosmeticMediaSlot, assignMediaAssetToSlot } from './actions';
import { ContentBlockRecord, MediaAssetRecord } from '@vavaw/db';
import Link from 'next/link';
import {
  COSMETIC_PRODUCT_MEDIA_SLOTS,
  SIG_MEDIA_SLOT_VALUES,
  normalizeCosmeticMediaSlot,
} from './cosmetic-slots';
import { 
  Settings, 
  Layers, 
  Package, 
  ListPlus, 
  Clock, 
  Image as ImageIcon, 
  Eye, 
  Check, 
  AlertCircle, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Upload, 
  FolderOpen,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface CosmeticPageManagerProps {
  initialBlocks: ContentBlockRecord[];
  mediaAssets: MediaAssetRecord[];
  role: string;
}

const REQUIRED_SLOTS = [
  { id: 'cosmetic-product-luminous-set', name: 'Bộ sản phẩm Luminous Set', size: '1600x2000 hoặc 1800x2200' },
  { id: 'cosmetic-product-regenaglow-cream', name: 'Kem dưỡng Regenaglow Cream', size: '1200x1500' },
  { id: 'cosmetic-product-calmiance-gel', name: 'Gel phục hồi Calmiance Gel', size: '1200x1500' },
  { id: 'cosmetic-product-renew-ampoule', name: 'Tinh chất Renew Ampoule', size: '1200x1500' },
  { id: 'cosmetic-product-p30-moisturizer', name: 'Kem dưỡng ẩm P30 Moisturizer', size: '1200x1500' },
  { id: 'cosmetic-product-p30-toner', name: 'Toner cân bằng P30 Toner', size: '1200x1500' },
  { id: 'cosmetic-product-lumiglow-sunscreen', name: 'Ảnh kem chống nắng Lumiglow Rosy Sheer Sunscreen', size: '1200x1500' },
  { id: 'cosmetic-premium-program', name: 'Premium Program / Spa Clinic', size: '1800x1200' },
  { id: 'cosmetic-gallery-ritual-panel', name: 'Ảnh banner Ritual Panel', size: '1800x1200' },
  { id: 'cosmetic-gallery-product-set', name: 'Thư viện - Bộ sản phẩm overview', size: '1600x2000' },
  { id: 'cosmetic-gallery-texture', name: 'Thư viện - Kết cấu sản phẩm', size: '1600x1600' },
  { id: 'cosmetic-gallery-clinic', name: 'Thư viện - Phòng khám / Trị liệu', size: '1800x1200' },
  { id: 'cosmetic-gallery-skin', name: 'Thư viện - Làn da cận cảnh', size: '1600x2000' },
  { id: 'cosmetic-gallery-serum', name: 'Thư viện - Tinh chất serum cận cảnh', size: '1600x2000' },
  { id: 'cosmetic-gallery-packaging', name: 'Thư viện - Bao bì sản phẩm', size: '1600x2000' }
];

const BLOCK_NAMES: Record<string, string> = {
  'cosmetic-brand-philosophy': 'Triết lý thương hiệu',
  'cosmetic-signature-collection': 'Bộ sản phẩm phục hồi',
  'cosmetic-hero-product': 'Sản phẩm nổi bật',
  'cosmetic-product-cards': 'Công thức lâm sàng',
  'cosmetic-daily-ritual': 'Quy trình chăm sóc',
  'cosmetic-ingredients': 'Thành phần hoạt chất',
  'cosmetic-premium-program': 'Premium Program',
  'cosmetic-editorial-gallery': 'Thư viện hình ảnh',
  'cosmetic-final-cta': 'CTA cuối trang'
};

const ALLOWED_ICONS = [
  { id: 'flask-conical', label: 'Khoa học (flask-conical)' },
  { id: 'microscope', label: 'Công nghệ (microscope)' },
  { id: 'sparkles', label: 'Cao cấp (sparkles)' },
  { id: 'gem', label: 'Sang trọng (gem)' },
  { id: 'shield-check', label: 'Chứng nhận (shield-check)' },
  { id: 'badge-check', label: 'Đảm bảo (badge-check)' },
  { id: 'leaf', label: 'Tinh khiết (leaf)' },
  { id: 'heart-handshake', label: 'Đồng hành (heart-handshake)' },
  { id: 'users', label: 'Cộng đồng (users)' },
  { id: 'bar-chart-3', label: 'Tăng trưởng (bar-chart-3)' },
  { id: 'globe', label: 'Toàn cầu (globe)' },
  { id: 'lightbulb', label: 'Ý tưởng (lightbulb)' },
  { id: 'droplet', label: 'Cấp ẩm (droplet)' },
  { id: 'scan-heart', label: 'Phục hồi da (scan-heart)' },
  { id: 'atom', label: 'Hoạt chất chuyên sâu (atom)' },
  { id: 'wand-sparkles', label: 'Hiệu quả tức thì (wand-sparkles)' },
];

export function CosmeticPageManager({ initialBlocks, mediaAssets, role }: CosmeticPageManagerProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vavaw-main.vercel.app';
  const router = useRouter();
  const [blocks, setBlocks] = useState<ContentBlockRecord[]>(initialBlocks);
  const [activeTab, setActiveTab] = useState<'overview' | 'sections' | 'products' | 'ingredients' | 'ritual' | 'images' | 'preview'>('overview');
  
  // Modals & pickers
  const [editingBlock, setEditingBlock] = useState<ContentBlockRecord | null>(null);
  const [pickerOpenSlot, setPickerOpenSlot] = useState<string | null>(null);
  const [pickerError, setPickerError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);
  const [isJsonDirty, setIsJsonDirty] = useState(false);

  // Section editor local state
  const [editTitle, setEditTitle] = useState('');
  const [editEyebrow, setEditEyebrow] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCtaLabel, setEditCtaLabel] = useState('');
  const [editCtaHref, setEditCtaHref] = useState('');
  const [editSortOrder, setEditSortOrder] = useState(1);
  const [editIsActive, setEditIsActive] = useState(true);
  const [editItemsJson, setEditItemsJson] = useState('');
  const [philosophyItems, setPhilosophyItems] = useState<any[]>([]);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Signature collection featured set editor state
  const [featuredName, setFeaturedName] = useState('');
  const [featuredType, setFeaturedType] = useState('');
  const [featuredDesc, setFeaturedDesc] = useState('');
  const [featuredIngredients, setFeaturedIngredients] = useState('');
  const [featuredMediaSlot, setFeaturedMediaSlot] = useState('');
  const [featuredCtaLabel, setFeaturedCtaLabel] = useState('');
  const [featuredCtaHref, setFeaturedCtaHref] = useState('');
  const [sigItems, setSigItems] = useState<any[]>([]);

  // Sync prop changes
  useEffect(() => {
    setBlocks(initialBlocks);
  }, [initialBlocks]);

  const canEdit = ['owner', 'admin', 'editor'].includes(role);

  // Computed metrics
  const totalSections = blocks.length;
  const activeCount = blocks.filter(b => b.is_active).length;
  const inactiveCount = totalSections - activeCount;
  const missingMediaCount = REQUIRED_SLOTS.filter(slot => !mediaAssets.find(m => m.metadata?.slot === slot.id && !m.metadata?.archivedFromSlot)).length;

  const showSuccess = (msg: string) => {
    setGlobalSuccess(msg);
    setTimeout(() => setGlobalSuccess(null), 3000);
  };

  // 1. General save block helper
  const handleSaveBlock = async (id: string, siteKey: string, pagePath: string, updatedContent: any, isActive: boolean, sortOrder?: number) => {
    setIsSaving(true);
    setGlobalError(null);
    const result = await updateContentBlockAction(id, {
      site_key: siteKey,
      page_path: pagePath,
      content: updatedContent,
      is_active: isActive,
      sort_order: sortOrder
    });
    setIsSaving(false);

    if (result.success) {
      showSuccess('Cập nhật thay đổi thành công!');
      router.refresh();
      return true;
    } else {
      setGlobalError(result.error || 'Có lỗi xảy ra khi lưu.');
      return false;
    }
  };

  // 2. Edit section modal helpers
  const startEditingSection = (block: ContentBlockRecord) => {
    setEditingBlock(block);
    setJsonError(null);
    setIsJsonDirty(false);
    const content = block.content || {};
    setEditTitle(content.title || '');
    setEditEyebrow(content.eyebrow || '');
    setEditSubtitle(content.subtitle || '');
    setEditDesc(content.description || '');
    setEditCtaLabel(content.ctaLabel || '');
    setEditCtaHref(content.ctaHref || '');
    setEditSortOrder(block.sort_order || 1);
    setEditIsActive(block.is_active);
    setEditItemsJson(content.items ? JSON.stringify(content.items, null, 2) : '');
    setPhilosophyItems(content.items || []);

    // Signature collection featured set
    if (block.block_type === 'cosmetic-signature-collection') {
      const feat = content.featured || content.featuredProduct || {};
      setFeaturedName(feat.name || '');
      setFeaturedType(feat.type || '');
      setFeaturedDesc(feat.description || '');
      setFeaturedIngredients(
        Array.isArray(feat.ingredients) ? feat.ingredients.join(', ') : (feat.ingredients || '')
      );
      // Normalize legacy short slot key → canonical on load
      setFeaturedMediaSlot(
        normalizeCosmeticMediaSlot(feat.mediaSlot) ??
        normalizeCosmeticMediaSlot('cosmetic-product-luminous-set') ??
        'cosmetic-product-luminous-set'
      );
      setFeaturedCtaLabel(feat.ctaLabel || content.ctaLabel || 'Explore the Ritual');
      setFeaturedCtaHref(feat.ctaHref || content.ctaHref || '/contact?type=cosmetic_interest');
      // Normalize each item's mediaSlot on load
      setSigItems(
        (content.items || []).map((item: any) => ({
          ...item,
          mediaSlot: normalizeCosmeticMediaSlot(item.mediaSlot) ?? item.mediaSlot ?? '',
        }))
      );
    }
  };

  const handleSaveSectionEdits = async () => {
    if (!editingBlock) return;
    setJsonError(null);

    let parsedItems = undefined;
    if (editItemsJson.trim()) {
      try {
        parsedItems = JSON.parse(editItemsJson);
      } catch (e) {
        setJsonError('Mã JSON không hợp lệ. Vui lòng kiểm tra dấu phẩy hoặc ngoặc đóng/mở.');
        return;
      }
    }

    const updatedContent = {
      ...editingBlock.content,
      title: editTitle,
      eyebrow: editEyebrow,
      description: editDesc,
      ctaLabel: editCtaLabel,
      ctaHref: editCtaHref,
    };

    if (editingBlock.block_type === 'cosmetic-brand-philosophy') {
      updatedContent.subtitle = editSubtitle;
      if (parsedItems !== undefined) {
        updatedContent.items = parsedItems;
      } else {
        updatedContent.items = philosophyItems;
      }
    } else if (editingBlock.block_type === 'cosmetic-signature-collection') {
      // Build featured object from visual editor fields
      const ingArray = featuredIngredients
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      // Validate CTA href: only allow internal paths
      const safeFeaturedHref =
        featuredCtaHref && featuredCtaHref.startsWith('/')
          ? featuredCtaHref
          : '/contact?type=cosmetic_interest';

      updatedContent.featured = {
        ...(editingBlock.content?.featured || {}),
        name: featuredName,
        type: featuredType,
        description: featuredDesc,
        ingredients: ingArray,
        mediaSlot: featuredMediaSlot || 'cosmetic-product-luminous-set',
        ctaLabel: featuredCtaLabel || 'Explore the Ritual',
        ctaHref: safeFeaturedHref,
      };

      // Items: prefer Advanced JSON if explicitly edited, otherwise use repeater
      // Always normalize mediaSlot to canonical value before saving
      const normalizeSigItems = (items: any[]) =>
        items.map((item) => ({
          ...item,
          mediaSlot: normalizeCosmeticMediaSlot(item.mediaSlot) ?? item.mediaSlot ?? '',
        }));

      if (isJsonDirty && parsedItems !== undefined) {
        updatedContent.items = normalizeSigItems(parsedItems);
      } else {
        updatedContent.items = normalizeSigItems(sigItems);
      }

      // Debug logs in development
      console.log('[CosmeticPageManager] Save Payload:', {
        block_id: editingBlock.id,
        block_type: editingBlock.block_type,
        site_key: editingBlock.site_key,
        page_path: editingBlock.page_path,
        isJsonDirty,
        ui_sigItems_order: sigItems.map(item => item.name),
        payload_items_order: updatedContent.items.map((item: any) => item.name),
        featured: updatedContent.featured
      });
    } else {
      if (isJsonDirty && parsedItems !== undefined) {
        updatedContent.items = parsedItems;
      }
    }

    const success = await handleSaveBlock(editingBlock.id, editingBlock.site_key, editingBlock.page_path, updatedContent, editIsActive, editSortOrder);
    if (success) {
      setEditingBlock(null);
    }
  };

  // Toggle Is Active directly
  const handleToggleActive = async (block: ContentBlockRecord) => {
    await handleSaveBlock(block.id, block.site_key, block.page_path, block.content, !block.is_active, block.sort_order);
  };

  // ─── PRODUCT EDITOR STATE & LOGIC ───────────────────────────────────────
  // We represent the 6 products in a clean local state
  const [selectedProduct, setSelectedProduct] = useState<string>('Luminous Revitalization Sheer Set');
  const [prodName, setProdName] = useState('');
  const [prodType, setProdType] = useState('');
  const [prodVolume, setProdVolume] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodBenefits, setProdBenefits] = useState<string[]>([]);
  const [prodIngredients, setProdIngredients] = useState<string[]>([]);

  // Load product content based on selection
  useEffect(() => {
    if (selectedProduct === 'Luminous Revitalization Sheer Set') {
      const heroBlock = blocks.find(b => b.block_type === 'cosmetic-hero-product');
      const content = heroBlock?.content || {};
      setProdName(content.title || 'Luminous Revitalization Sheer Set');
      setProdType('Bộ sản phẩm phục hồi');
      setProdVolume('');
      setProdPrice('');
      setProdDesc(content.description || '');
      setProdBenefits(content.benefits || []);
      setProdIngredients(content.ingredients || []);
    } else {
      const cardsBlock = blocks.find(b => b.block_type === 'cosmetic-product-cards');
      const items = cardsBlock?.content?.items || [];
      const item = items.find((i: any) => i.name === selectedProduct);
      if (item) {
        setProdName(item.name || '');
        setProdType(item.type || '');
        setProdVolume(item.volume || '');
        setProdPrice(item.price || '');
        setProdDesc(item.desc || '');
        setProdBenefits(item.benefits || []);
        // ingredients can be string or array
        const rawIng = item.ingredients || '';
        setProdIngredients(typeof rawIng === 'string' ? rawIng.split(' · ') : rawIng);
      }
    }
  }, [selectedProduct, blocks]);

  const handleSaveProductEdits = async () => {
    setIsSaving(true);
    setGlobalError(null);

    try {
      const newBlocks = JSON.parse(JSON.stringify(blocks));

      if (selectedProduct === 'Luminous Revitalization Sheer Set') {
        // 1. Update cosmetic-hero-product
        const heroBlock = newBlocks.find((b: any) => b.block_type === 'cosmetic-hero-product');
        if (heroBlock && heroBlock.content) {
          heroBlock.content.title = prodName;
          heroBlock.content.description = prodDesc;
          heroBlock.content.benefits = prodBenefits;
          heroBlock.content.ingredients = prodIngredients;
        }

        // 2. Update cosmetic-signature-collection featuredProduct
        const sigBlock = newBlocks.find((b: any) => b.block_type === 'cosmetic-signature-collection');
        if (sigBlock && sigBlock.content && sigBlock.content.featuredProduct) {
          sigBlock.content.featuredProduct.name = prodName;
          sigBlock.content.featuredProduct.description = prodDesc;
          sigBlock.content.featuredProduct.ingredients = prodIngredients;
        }

        // Save hero
        if (heroBlock) {
          await updateContentBlockAction(heroBlock.id, {
            site_key: heroBlock.site_key,
            page_path: heroBlock.page_path,
            content: heroBlock.content,
            is_active: heroBlock.is_active,
            sort_order: heroBlock.sort_order
          });
        }
        // Save signature
        if (sigBlock) {
          await updateContentBlockAction(sigBlock.id, {
            site_key: sigBlock.site_key,
            page_path: sigBlock.page_path,
            content: sigBlock.content,
            is_active: sigBlock.is_active,
            sort_order: sigBlock.sort_order
          });
        }
      } else {
        // Update clinical cards product
        const cardsBlock = newBlocks.find((b: any) => b.block_type === 'cosmetic-product-cards');
        if (cardsBlock && cardsBlock.content && Array.isArray(cardsBlock.content.items)) {
          cardsBlock.content.items = cardsBlock.content.items.map((item: any) => {
            if (item.name === selectedProduct) {
              const updatedItem: any = {
                ...item,
                name: prodName,
                type: prodType,
                desc: prodDesc,
                benefits: prodBenefits,
                ingredients: prodIngredients.join(' · ')
              };
              if (prodVolume) updatedItem.volume = prodVolume;
              if (prodPrice) updatedItem.price = prodPrice;
              return updatedItem;
            }
            return item;
          });
        }

        // Sync with signature collection item
        const sigBlock = newBlocks.find((b: any) => b.block_type === 'cosmetic-signature-collection');
        if (sigBlock && sigBlock.content && Array.isArray(sigBlock.content.items)) {
          sigBlock.content.items = sigBlock.content.items.map((item: any) => {
            if (item.name === selectedProduct) {
              return {
                ...item,
                name: prodName,
                type: prodType,
                key: prodIngredients.join(' · ')
              };
            }
            return item;
          });
        }

        if (cardsBlock) {
          await updateContentBlockAction(cardsBlock.id, {
            site_key: cardsBlock.site_key,
            page_path: cardsBlock.page_path,
            content: cardsBlock.content,
            is_active: cardsBlock.is_active,
            sort_order: cardsBlock.sort_order
          });
        }
        if (sigBlock) {
          await updateContentBlockAction(sigBlock.id, {
            site_key: sigBlock.site_key,
            page_path: sigBlock.page_path,
            content: sigBlock.content,
            is_active: sigBlock.is_active,
            sort_order: sigBlock.sort_order
          });
        }
      }

      showSuccess('Cập nhật sản phẩm thành công!');
      // Update selected product to match new name so editor doesn't reset or mismatch
      setSelectedProduct(prodName);
      router.refresh();
    } catch (e: any) {
      setGlobalError('Lỗi cập nhật sản phẩm: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ─── INGREDIENTS LIST STATE & LOGIC ─────────────────────────────────────
  const [ingredientsList, setIngredientsList] = useState<any[]>([]);

  useEffect(() => {
    const ingBlock = blocks.find(b => b.block_type === 'cosmetic-ingredients');
    setIngredientsList(ingBlock?.content?.items || []);
  }, [blocks]);

  const handleSaveIngredients = async () => {
    const ingBlock = blocks.find(b => b.block_type === 'cosmetic-ingredients');
    if (!ingBlock) return;

    const updatedContent = {
      ...ingBlock.content,
      items: ingredientsList
    };

    await handleSaveBlock(ingBlock.id, ingBlock.site_key, ingBlock.page_path, updatedContent, ingBlock.is_active, ingBlock.sort_order);
  };

  // ─── RITUAL STEPS STATE & LOGIC ─────────────────────────────────────────
  const [ritualList, setRitualList] = useState<any[]>([]);

  useEffect(() => {
    const ritBlock = blocks.find(b => b.block_type === 'cosmetic-daily-ritual');
    setRitualList(ritBlock?.content?.items || []);
  }, [blocks]);

  const handleSaveRitual = async () => {
    const ritBlock = blocks.find(b => b.block_type === 'cosmetic-daily-ritual');
    if (!ritBlock) return;

    const updatedContent = {
      ...ritBlock.content,
      items: ritualList
    };

    await handleSaveBlock(ritBlock.id, ritBlock.site_key, ritBlock.page_path, updatedContent, ritBlock.is_active, ritBlock.sort_order);
  };

  // ─── MEDIA SLOT MANAGER LOGIC ──────────────────────────────────────────
  const handleRemoveMediaSlot = async (slot: string) => {
    if (!confirm("Bạn chỉ đang gỡ ảnh khỏi vị trí này. File vẫn còn trong Media Library.")) return;

    setIsSaving(true);
    const res = await removeCosmeticMediaSlot(slot);
    setIsSaving(false);

    if (res.success) {
      showSuccess('Đã gỡ ảnh khỏi slot thành công!');
      router.refresh();
    } else {
      alert(res.error || 'Có lỗi xảy ra.');
    }
  };

  const handleAssignMediaAsset = async (mediaId: string) => {
    if (!pickerOpenSlot) return;

    setIsSaving(true);
    setPickerError(null);
    const res = await assignMediaAssetToSlot(mediaId, pickerOpenSlot);
    setIsSaving(false);

    if (res.success) {
      showSuccess('Gán ảnh thành công!');
      setPickerOpenSlot(null);
      router.refresh();
    } else {
      setPickerError(res.error || 'Có lỗi xảy ra.');
    }
  };

  // Library images filtering
  const libraryImages = mediaAssets.filter(m => m.type === 'image' || m.mime_type?.startsWith('image'));

  return (
    <div className="space-y-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="text-blue-600 h-8 w-8" />
            Cosmetic Page Admin Studio
          </h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý giao diện, nội dung và hình ảnh của trang mỹ phẩm /cosmetic.</p>
        </div>
        <div className="flex items-center gap-2">
          <a 
            href={`${siteUrl}/cosmetic`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow transition flex items-center gap-1.5"
          >
            <span>Xem trang Public</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Global Success / Error Banners */}
      {globalSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm rounded-xl flex items-center gap-2 animate-fade-in shadow-sm">
          <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span>{globalSuccess}</span>
        </div>
      )}
      {globalError && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-800 text-sm rounded-xl flex items-center gap-2 animate-fade-in shadow-sm">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      {/* Tabs IA */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-5 text-sm font-semibold border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
            activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Tổng quan</span>
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`py-3 px-5 text-sm font-semibold border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
            activeTab === 'sections' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Nội dung trang</span>
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`py-3 px-5 text-sm font-semibold border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
            activeTab === 'products' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>Sản phẩm</span>
        </button>
        <button
          onClick={() => setActiveTab('ingredients')}
          className={`py-3 px-5 text-sm font-semibold border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
            activeTab === 'ingredients' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <ListPlus className="h-4 w-4" />
          <span>Thành phần</span>
        </button>
        <button
          onClick={() => setActiveTab('ritual')}
          className={`py-3 px-5 text-sm font-semibold border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
            activeTab === 'ritual' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Quy trình</span>
        </button>
        <button
          onClick={() => setActiveTab('images')}
          className={`py-3 px-5 text-sm font-semibold border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
            activeTab === 'images' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <ImageIcon className="h-4 w-4" />
          <span>Hình ảnh</span>
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`py-3 px-5 text-sm font-semibold border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
            activeTab === 'preview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Eye className="h-4 w-4" />
          <span>Xem trước</span>
        </button>
      </div>

      {/* ─── TAB CONTENT 1: OVERVIEW ────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tổng Section</div>
              <div className="text-3xl font-extrabold text-slate-900">{totalSections}</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1">Đang hiển thị</div>
              <div className="text-3xl font-extrabold text-emerald-600">{activeCount}</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Đang ẩn</div>
              <div className="text-3xl font-extrabold text-slate-500">{inactiveCount}</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">Thiếu ảnh</div>
              <div className={`text-3xl font-extrabold ${missingMediaCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {missingMediaCount}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-950 text-base">Liên kết trang</h3>
            <div className="flex items-center gap-3">
              <a
                href={`${siteUrl}/cosmetic`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-slate-200 text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-50 inline-flex items-center gap-1.5 transition"
              >
                <span>Xem trang public /cosmetic</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB CONTENT 2: SECTIONS ────────────────────────────────────── */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
            {blocks.map(block => (
              <div key={block.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {BLOCK_NAMES[block.block_type] || block.content?.title || block.block_type}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{block.block_type}</p>
                </div>
                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                    block.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {block.is_active ? 'Đang hiển thị' : 'Đang ẩn'}
                  </span>
                  
                  {/* Status Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={block.is_active} 
                      onChange={() => handleToggleActive(block)}
                      className="sr-only peer"
                      disabled={isSaving}
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>

                  {canEdit && (
                    <button 
                      onClick={() => startEditingSection(block)}
                      className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-lg hover:bg-slate-200 transition"
                      disabled={isSaving}
                    >
                      Sửa
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB CONTENT 3: PRODUCTS ────────────────────────────────────── */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar product list */}
          <div className="lg:col-span-1 space-y-2">
            {(() => {
              const productNames = ['Luminous Revitalization Sheer Set'];
              const cardsBlock = blocks.find(b => b.block_type === 'cosmetic-product-cards');
              const items = cardsBlock?.content?.items || [];
              items.forEach((item: any) => {
                if (item.name && !productNames.includes(item.name)) {
                  productNames.push(item.name);
                }
              });
              return productNames.map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedProduct(p)}
                  className={`w-full text-left p-3 rounded-lg text-xs font-semibold transition border ${
                    selectedProduct === p
                      ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ));
            })()}
          </div>

          {/* Product form */}
          <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 flex justify-between items-center text-base">
              <span>Sửa thông tin sản phẩm</span>
              <span className="text-[10px] text-slate-400 font-mono">CMS Data Structure Sync</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  value={prodName}
                  onChange={e => setProdName(e.target.value)}
                  className="w-full text-sm p-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Loại sản phẩm tiếng Việt *</label>
                <input
                  type="text"
                  value={prodType}
                  onChange={e => setProdType(e.target.value)}
                  disabled={selectedProduct === 'Luminous Revitalization Sheer Set'}
                  className="w-full text-sm p-2 border border-slate-300 rounded-md disabled:bg-slate-50"
                  placeholder="Ví dụ: Kem dưỡng phục hồi, Tinh chất..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dung tích</label>
                <input
                  type="text"
                  value={prodVolume}
                  onChange={e => setProdVolume(e.target.value)}
                  disabled={selectedProduct === 'Luminous Revitalization Sheer Set'}
                  className="w-full text-sm p-2 border border-slate-300 rounded-md disabled:bg-slate-50"
                  placeholder="Ví dụ: 50ml, 120ml..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Giá hiển thị (nếu có)</label>
                <input
                  type="text"
                  value={prodPrice}
                  onChange={e => setProdPrice(e.target.value)}
                  disabled={selectedProduct === 'Luminous Revitalization Sheer Set'}
                  className="w-full text-sm p-2 border border-slate-300 rounded-md disabled:bg-slate-50"
                  placeholder="Ví dụ: 850.000vnd..."
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ảnh đại diện (Media Slot)</label>
                <div className="flex items-center gap-3">
                  {(() => {
                    const slotId = (() => {
                      if (selectedProduct === 'Luminous Revitalization Sheer Set') {
                        return 'cosmetic-product-luminous-set';
                      }
                      const cardsBlock = blocks.find(b => b.block_type === 'cosmetic-product-cards');
                      const items = cardsBlock?.content?.items || [];
                      const item = items.find((i: any) => i.name === selectedProduct);
                      if (item && item.mediaSlot) {
                        return item.mediaSlot;
                      }
                      return REQUIRED_SLOTS.find(s => s.name.toLowerCase().includes(selectedProduct.toLowerCase().replace('revitalization ', '').replace(' facial', '').split(' ')[0]))?.id || '';
                    })();
                    const asset = mediaAssets.find(m => m.metadata?.slot === slotId && !m.metadata?.archivedFromSlot);
                    return (
                      <>
                        <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                          {asset ? (
                            <img src={asset.url} alt="Slot asset" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold">X</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-slate-500 block truncate">{slotId}</span>
                          {slotId && (
                            <button
                              type="button"
                              onClick={() => setPickerOpenSlot(slotId)}
                              className="text-[10px] text-blue-600 font-bold hover:underline"
                            >
                              Đổi ảnh / Chọn từ thư viện
                            </button>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mô tả ngắn *</label>
                <textarea
                  value={prodDesc}
                  onChange={e => setProdDesc(e.target.value)}
                  rows={3}
                  className="w-full text-sm p-2 border border-slate-300 rounded-md"
                />
              </div>

              {/* Benefit tags */}
              <div className="col-span-2 space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Công dụng chính (Benefit tags)</label>
                <div className="space-y-2">
                  {prodBenefits.map((tag, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={e => {
                          const newTags = [...prodBenefits];
                          newTags[idx] = e.target.value;
                          setProdBenefits(newTags);
                        }}
                        className="flex-1 text-xs p-1.5 border border-slate-300 rounded-md"
                      />
                      <button
                        onClick={() => setProdBenefits(prodBenefits.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setProdBenefits([...prodBenefits, ''])}
                    className="text-xs text-blue-600 font-bold flex items-center gap-1 mt-1 hover:underline"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Thêm công dụng</span>
                  </button>
                </div>
              </div>

              {/* Ingredients */}
              <div className="col-span-2 space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Thành phần nổi bật</label>
                <div className="space-y-2">
                  {prodIngredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={ing}
                        onChange={e => {
                          const newIngs = [...prodIngredients];
                          newIngs[idx] = e.target.value;
                          setProdIngredients(newIngs);
                        }}
                        className="flex-1 text-xs p-1.5 border border-slate-300 rounded-md"
                      />
                      <button
                        onClick={() => setProdIngredients(prodIngredients.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setProdIngredients([...prodIngredients, ''])}
                    className="text-xs text-blue-600 font-bold flex items-center gap-1 mt-1 hover:underline"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Thêm thành phần</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleSaveProductEdits}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow disabled:opacity-50"
              >
                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB CONTENT 4: INGREDIENTS REPEATER ─────────────────────────── */}
      {activeTab === 'ingredients' && (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 flex justify-between items-center text-base">
            <span>Quản lý thành phần nổi bật</span>
            <span className="text-[10px] text-slate-400 font-mono">cosmetic-ingredients items</span>
          </h3>

          <div className="space-y-4">
            {ingredientsList.map((item, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col md:flex-row items-stretch md:items-center gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tên thành phần</label>
                    <input
                      type="text"
                      value={item.name || ''}
                      onChange={e => {
                        const newList = [...ingredientsList];
                        newList[idx].name = e.target.value;
                        setIngredientsList(newList);
                      }}
                      className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vai trò chính / Mô tả ngắn</label>
                    <input
                      type="text"
                      value={item.role || ''}
                      onChange={e => {
                        const newList = [...ingredientsList];
                        newList[idx].role = e.target.value;
                        setIngredientsList(newList);
                      }}
                      className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t md:border-t-0 pt-2 md:pt-0">
                  <button
                    onClick={() => {
                      if (idx === 0) return;
                      const newList = [...ingredientsList];
                      const temp = newList[idx];
                      newList[idx] = newList[idx - 1];
                      newList[idx - 1] = temp;
                      setIngredientsList(newList);
                    }}
                    disabled={idx === 0}
                    className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5 text-slate-500" />
                  </button>
                  <button
                    onClick={() => {
                      if (idx === ingredientsList.length - 1) return;
                      const newList = [...ingredientsList];
                      const temp = newList[idx];
                      newList[idx] = newList[idx + 1];
                      newList[idx + 1] = temp;
                      setIngredientsList(newList);
                    }}
                    disabled={idx === ingredientsList.length - 1}
                    className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5 text-slate-500" />
                  </button>
                  <button
                    onClick={() => setIngredientsList(ingredientsList.filter((_, i) => i !== idx))}
                    className="p-1.5 border border-red-100 rounded-lg hover:bg-red-50 text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => setIngredientsList([...ingredientsList, { name: '', role: '' }])}
              className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-bold hover:bg-slate-50/50 flex items-center justify-center gap-1.5 text-xs transition"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm thành phần mới</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSaveIngredients}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow disabled:opacity-50"
            >
              {isSaving ? 'Đang lưu...' : 'Lưu danh sách thành phần'}
            </button>
          </div>
        </div>
      )}

      {/* ─── TAB CONTENT 5: RITUAL REPEATER ─────────────────────────────── */}
      {activeTab === 'ritual' && (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 flex justify-between items-center text-base">
            <span>Quản lý quy trình chăm sóc da</span>
            <span className="text-[10px] text-slate-400 font-mono">cosmetic-daily-ritual items</span>
          </h3>

          <div className="space-y-4">
            {ritualList.map((item, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col md:flex-row items-stretch md:items-center gap-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Số bước</label>
                    <input
                      type="text"
                      value={item.step || ''}
                      onChange={e => {
                        const newList = [...ritualList];
                        newList[idx].step = e.target.value;
                        setRitualList(newList);
                      }}
                      className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                      placeholder="Ví dụ: 01"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tên bước</label>
                    <input
                      type="text"
                      value={item.name || ''}
                      onChange={e => {
                        const newList = [...ritualList];
                        newList[idx].name = e.target.value;
                        setRitualList(newList);
                      }}
                      className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mô tả quy trình</label>
                    <input
                      type="text"
                      value={item.detail || ''}
                      onChange={e => {
                        const newList = [...ritualList];
                        newList[idx].detail = e.target.value;
                        setRitualList(newList);
                      }}
                      className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t md:border-t-0 pt-2 md:pt-0">
                  <button
                    onClick={() => {
                      if (idx === 0) return;
                      const newList = [...ritualList];
                      const temp = newList[idx];
                      newList[idx] = newList[idx - 1];
                      newList[idx - 1] = temp;
                      setRitualList(newList);
                    }}
                    disabled={idx === 0}
                    className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5 text-slate-500" />
                  </button>
                  <button
                    onClick={() => {
                      if (idx === ritualList.length - 1) return;
                      const newList = [...ritualList];
                      const temp = newList[idx];
                      newList[idx] = newList[idx + 1];
                      newList[idx + 1] = temp;
                      setRitualList(newList);
                    }}
                    disabled={idx === ritualList.length - 1}
                    className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5 text-slate-500" />
                  </button>
                  <button
                    onClick={() => setRitualList(ritualList.filter((_, i) => i !== idx))}
                    className="p-1.5 border border-red-100 rounded-lg hover:bg-red-50 text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => setRitualList([...ritualList, { step: '', name: '', detail: '' }])}
              className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-bold hover:bg-slate-50/50 flex items-center justify-center gap-1.5 text-xs transition"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm bước Ritual mới</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSaveRitual}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow disabled:opacity-50"
            >
              {isSaving ? 'Đang lưu...' : 'Lưu quy trình ritual'}
            </button>
          </div>
        </div>
      )}

      {/* ─── TAB CONTENT 6: IMAGES (MEDIA SLOTS) ───────────────────────── */}
      {activeTab === 'images' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REQUIRED_SLOTS.map(slot => {
              const asset = mediaAssets.find(m => m.metadata?.slot === slot.id && !m.metadata?.archivedFromSlot);
              return (
                <div key={slot.id} className={`p-4 rounded-xl border transition-all flex gap-4 ${
                  asset 
                    ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300' 
                    : 'bg-slate-50/50 border-dashed border-slate-300'
                }`}>
                  {/* Thumbnail */}
                  <div className="w-24 h-24 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center relative group">
                    {asset ? (
                      <>
                        <img src={asset.url} alt={slot.name} className="w-full h-full object-cover" />
                        <a 
                          href={asset.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-semibold"
                        >
                          Xem ảnh
                        </a>
                      </>
                    ) : (
                      <div className="text-[10px] text-slate-400 font-bold text-center p-2">Chưa có ảnh</div>
                    )}
                  </div>

                  {/* Info & Actions */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{slot.name}</h4>
                        <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                          asset ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {asset ? 'Đã tải lên' : 'Chưa tải'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{slot.id}</p>
                      <p className="text-[10px] text-slate-500 mt-1">Khuyên dùng: {slot.size}</p>
                      {asset?.created_at && (
                        <p className="text-[9px] text-slate-400 mt-0.5">
                          Ngày tải lên: {new Date(asset.created_at).toLocaleDateString('vi-VN')}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-slate-100">
                      {/* Upload / Change Image link */}
                      <Link 
                        href={`/media?purpose=cosmetic-page-media&slot=${slot.id}&returnTo=/cosmetic-page`}
                        className={`px-2 py-1 font-bold text-[10px] rounded transition inline-flex items-center gap-1 ${
                          asset 
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                        }`}
                      >
                        <Upload className="h-3 w-3" />
                        <span>{asset ? 'Đổi ảnh' : 'Tải ảnh'}</span>
                      </Link>

                      {/* Select from library */}
                      <button
                        onClick={() => setPickerOpenSlot(slot.id)}
                        className={`px-2 py-1 font-bold text-[10px] rounded transition inline-flex items-center gap-1 ${
                          asset 
                            ? 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100' 
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm'
                        }`}
                      >
                        <FolderOpen className="h-3 w-3" />
                        <span>Chọn từ thư viện</span>
                      </button>

                      {/* View image URL */}
                      {asset && (
                        <a
                          href={asset.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 bg-slate-50 text-slate-700 border border-slate-200 font-bold text-[10px] rounded hover:bg-slate-100 transition inline-flex items-center gap-1"
                        >
                          Xem ảnh
                        </a>
                      )}

                      {/* Remove slot association */}
                      {asset && (
                        <button
                          onClick={() => handleRemoveMediaSlot(slot.id)}
                          className="px-2 py-1 text-red-600 font-bold text-[10px] rounded hover:bg-red-50 transition ml-auto"
                        >
                          Gỡ khỏi slot
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── TAB CONTENT 7: PREVIEW ────────────────────────────────────── */}
      {activeTab === 'preview' && (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 text-base">Xem trước Trạng thái CMS</h3>
          <div className="space-y-4 text-sm text-slate-700">
            <div>
              <span className="font-semibold">Đang tải cấu hình từ:</span> Supabase CMS
            </div>
            <div>
              <span className="font-semibold">Số section hoạt động:</span> {activeCount} / {totalSections}
            </div>
            <div>
              <span className="font-semibold">Số ảnh đã tải lên:</span> {REQUIRED_SLOTS.length - missingMediaCount} / {REQUIRED_SLOTS.length}
            </div>
            <div className="pt-4">
              <a 
                href={`${siteUrl}/cosmetic`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg inline-flex items-center gap-1.5 transition"
              >
                <span>Mở trang xem trước thực tế (Public Page)</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION EDITOR MODAL ────────────────────────────────────────── */}
      {editingBlock && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-100">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Sửa Section: {BLOCK_NAMES[editingBlock.block_type] || editingBlock.block_type}
                </h3>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">{editingBlock.block_type}</p>
              </div>
              <button 
                onClick={() => setEditingBlock(null)}
                className="text-slate-400 hover:text-slate-600 transition p-1"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tiêu đề (Title)</label>
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full text-sm p-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nhãn nhỏ (Eyebrow)</label>
                  <input 
                    type="text" 
                    value={editEyebrow} 
                    onChange={e => setEditEyebrow(e.target.value)}
                    className="w-full text-sm p-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Thứ tự hiển thị</label>
                  <input 
                    type="number" 
                    value={editSortOrder} 
                    onChange={e => setEditSortOrder(parseInt(e.target.value) || 1)}
                    className="w-full text-sm p-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mô tả (Description)</label>
                  <textarea 
                    value={editDesc} 
                    onChange={e => setEditDesc(e.target.value)}
                    rows={3}
                    className="w-full text-sm p-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                  />
                </div>

                {editingBlock.block_type === 'cosmetic-brand-philosophy' && (
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dòng mô tả phụ (Subtitle)</label>
                    <input 
                      type="text" 
                      value={editSubtitle} 
                      onChange={e => setEditSubtitle(e.target.value)}
                      className="w-full text-sm p-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                )}

                {editingBlock.block_type !== 'cosmetic-brand-philosophy' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nhãn nút (CTA Label)</label>
                      <input 
                        type="text" 
                        value={editCtaLabel} 
                        onChange={e => setEditCtaLabel(e.target.value)}
                        className="w-full text-sm p-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Đường dẫn nút (CTA Link)</label>
                      <input 
                        type="text" 
                        value={editCtaHref} 
                        onChange={e => setEditCtaHref(e.target.value)}
                        className="w-full text-sm p-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                  </>
                )}

                {editingBlock.block_type === 'cosmetic-brand-philosophy' && (
                  <div className="col-span-2 space-y-4 border-t border-slate-100 pt-4 mt-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Danh sách thẻ triết lý (Philosophy Cards)</h4>
                    <div className="space-y-4">
                      {philosophyItems.map((item, idx) => {
                        const itemNum = item.number || item.num || `0${idx + 1}`;
                        const itemIcon = item.icon || 'sparkles';
                        const itemTitle = item.title || '';
                        const itemDesc = item.description || item.desc || '';
                        return (
                          <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3 relative group/card">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <span className="text-xs font-bold text-slate-400 font-mono">Thẻ #{idx + 1}</span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (idx === 0) return;
                                    const newList = [...philosophyItems];
                                    const temp = newList[idx];
                                    newList[idx] = newList[idx - 1];
                                    newList[idx - 1] = temp;
                                    setPhilosophyItems(newList);
                                  }}
                                  disabled={idx === 0}
                                  className="p-1 text-slate-500 hover:text-blue-600 disabled:opacity-30"
                                  title="Di chuyển lên"
                                >
                                  <ArrowUp className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (idx === philosophyItems.length - 1) return;
                                    const newList = [...philosophyItems];
                                    const temp = newList[idx];
                                    newList[idx] = newList[idx + 1];
                                    newList[idx + 1] = temp;
                                    setPhilosophyItems(newList);
                                  }}
                                  disabled={idx === philosophyItems.length - 1}
                                  className="p-1 text-slate-500 hover:text-blue-600 disabled:opacity-30"
                                  title="Di chuyển xuống"
                                >
                                  <ArrowDown className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newList = philosophyItems.filter((_, i) => i !== idx);
                                    setPhilosophyItems(newList);
                                  }}
                                  className="p-1 text-slate-500 hover:text-red-600"
                                  title="Xóa thẻ"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Số thứ tự (Number)</label>
                                <input
                                  type="text"
                                  value={itemNum}
                                  onChange={e => {
                                    const newList = [...philosophyItems];
                                    newList[idx] = { ...newList[idx], number: e.target.value };
                                    setPhilosophyItems(newList);
                                  }}
                                  className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                                  placeholder="Ví dụ: 01, 02..."
                                />
                              </div>
                              
                              <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Biểu tượng (Icon Whitelist)</label>
                                <select
                                  value={itemIcon}
                                  onChange={e => {
                                    const newList = [...philosophyItems];
                                    newList[idx] = { ...newList[idx], icon: e.target.value };
                                    setPhilosophyItems(newList);
                                  }}
                                  className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white h-[34px]"
                                >
                                  {ALLOWED_ICONS.map(ic => (
                                    <option key={ic.id} value={ic.id}>{ic.label}</option>
                                  ))}
                                </select>
                              </div>
                              
                              <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tiêu đề thẻ *</label>
                                <input
                                  type="text"
                                  value={itemTitle}
                                  onChange={e => {
                                    const newList = [...philosophyItems];
                                    newList[idx] = { ...newList[idx], title: e.target.value };
                                    setPhilosophyItems(newList);
                                  }}
                                  className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                                  placeholder="Tiêu đề..."
                                  required
                                />
                              </div>
                              
                              <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nội dung mô tả *</label>
                                <textarea
                                  value={itemDesc}
                                  onChange={e => {
                                    const newList = [...philosophyItems];
                                    newList[idx] = { ...newList[idx], description: e.target.value };
                                    setPhilosophyItems(newList);
                                  }}
                                  rows={2}
                                  className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                                  placeholder="Mô tả..."
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => {
                          const nextIdx = philosophyItems.length + 1;
                          const nextNum = nextIdx < 10 ? `0${nextIdx}` : `${nextIdx}`;
                          setPhilosophyItems([
                            ...philosophyItems,
                            {
                              number: nextNum,
                              icon: 'sparkles',
                              title: '',
                              description: ''
                            }
                          ]);
                        }}
                        className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline mt-1 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Thêm thẻ triết lý mới</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Signature Recovery Collection custom editor ── */}
                {editingBlock.block_type === 'cosmetic-signature-collection' && (() => {
                  return (
                    <div className="col-span-2 space-y-6 border-t border-slate-100 pt-4 mt-2">
                      <p className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 leading-relaxed">
                        💡 <strong>Hướng dẫn:</strong> Section này hiển thị như một bản đồ ritual phục hồi da ngoài trang /cosmetic. Mỗi sản phẩm là một bước trong hệ chăm sóc da — từ Prepare, Treat, Recover, Seal đến Protect.
                      </p>

                      {/* Featured Set */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                          Bộ sản phẩm nổi bật (Featured Set)
                        </h4>
                        {featuredMediaSlot && (
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="w-16 h-16 rounded-lg border border-slate-200 bg-[#F7F9FC] flex items-center justify-center overflow-hidden shrink-0">
                              <span className="text-[9px] text-slate-400 text-center leading-tight px-1">{featuredMediaSlot.replace('cosmetic-product-', '')}</span>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-600 uppercase">Media Slot đang chọn</p>
                              <p className="text-[11px] text-slate-500 font-mono">{featuredMediaSlot}</p>
                              <p className="text-[9px] text-emerald-600 mt-0.5">✓ Slot khả dụng — ảnh được nạp từ DB qua slot này</p>
                            </div>
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tên bộ sản phẩm nổi bật</label>
                            <input type="text" value={featuredName} onChange={e => setFeaturedName(e.target.value)}
                              className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                              placeholder="Ví dụ: Luminous Revitalization Sheer Set" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Loại / nhãn nhỏ</label>
                            <input type="text" value={featuredType} onChange={e => setFeaturedType(e.target.value)}
                              className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                              placeholder="Ví dụ: FEATURED SET" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Media Slot ảnh</label>
                            <select value={featuredMediaSlot} onChange={e => setFeaturedMediaSlot(e.target.value)}
                              className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white h-[34px]">
                              <option value="">-- chọn slot --</option>
                              {COSMETIC_PRODUCT_MEDIA_SLOTS.map(slot => <option key={slot.value} value={slot.value}>{slot.label}</option>)}
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mô tả ngắn</label>
                            <textarea value={featuredDesc} onChange={e => setFeaturedDesc(e.target.value)} rows={2}
                              className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                              placeholder="Mô tả bộ sản phẩm..." />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Thành phần nổi bật (ngăn cách bằng dấu phẩy)</label>
                            <input type="text" value={featuredIngredients} onChange={e => setFeaturedIngredients(e.target.value)}
                              className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                              placeholder="Ví dụ: Exosome, Collagen, Peptide Complex" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nhãn nút CTA</label>
                            <input type="text" value={featuredCtaLabel} onChange={e => setFeaturedCtaLabel(e.target.value)}
                              className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                              placeholder="Explore the Ritual" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Đường dẫn nút (phải bắt đầu bằng /)</label>
                            <input type="text" value={featuredCtaHref} onChange={e => setFeaturedCtaHref(e.target.value)}
                              className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                              placeholder="/contact?type=cosmetic_interest" />
                            {featuredCtaHref && !featuredCtaHref.startsWith('/') && (
                              <p className="text-[10px] text-amber-600 mt-1">⚠ Đường dẫn không hợp lệ — phải bắt đầu bằng /. Sẽ dùng đường dẫn mặc định khi lưu.</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Supporting products repeater */}
                      <div className="space-y-3 border-t border-slate-100 pt-4">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                          Danh sách sản phẩm phụ trợ
                        </h4>
                        <div className="space-y-3">
                          {sigItems.map((item: any, idx: number) => (
                            <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <span className="text-xs font-bold text-slate-400 font-mono">Sản phẩm #{idx + 1}</span>
                                <div className="flex items-center gap-1">
                                  <button type="button" disabled={idx === 0}
                                    onClick={() => { const l = [...sigItems]; [l[idx], l[idx - 1]] = [l[idx - 1], l[idx]]; setSigItems(l); }}
                                    className="p-1 text-slate-500 hover:text-blue-600 disabled:opacity-30" title="Di chuyển lên">
                                    <ArrowUp className="h-3.5 w-3.5" />
                                  </button>
                                  <button type="button" disabled={idx === sigItems.length - 1}
                                    onClick={() => { const l = [...sigItems]; [l[idx], l[idx + 1]] = [l[idx + 1], l[idx]]; setSigItems(l); }}
                                    className="p-1 text-slate-500 hover:text-blue-600 disabled:opacity-30" title="Di chuyển xuống">
                                    <ArrowDown className="h-3.5 w-3.5" />
                                  </button>
                                  <button type="button"
                                    onClick={() => setSigItems(sigItems.filter((_: any, i: number) => i !== idx))}
                                    className="p-1 text-slate-500 hover:text-red-600" title="Xóa sản phẩm">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                              {item.mediaSlot && (
                                <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-3 py-1.5">
                                  <span className="text-[9px] font-mono text-slate-500">{item.mediaSlot.replace('cosmetic-product-', '')}</span>
                                  <span className="text-[9px] text-emerald-600">✓ slot</span>
                                </div>
                              )}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="md:col-span-2">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tên sản phẩm</label>
                                  <input type="text" value={item.name || ''} onChange={e => { const l = [...sigItems]; l[idx] = { ...l[idx], name: e.target.value }; setSigItems(l); }}
                                    className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vai trò / loại sản phẩm (Type)</label>
                                  <input type="text" value={item.type || ''} onChange={e => { const l = [...sigItems]; l[idx] = { ...l[idx], type: e.target.value }; setSigItems(l); }}
                                    className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" placeholder="Ví dụ: Booster, Active Treatment" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Thứ tự bước (Step)</label>
                                  <input type="text" value={item.step || ''} onChange={e => { const l = [...sigItems]; l[idx] = { ...l[idx], step: e.target.value }; setSigItems(l); }}
                                    className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" placeholder="Ví dụ: 01" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vai trò tùy chỉnh (Role)</label>
                                  <input type="text" value={item.role || ''} onChange={e => { const l = [...sigItems]; l[idx] = { ...l[idx], role: e.target.value }; setSigItems(l); }}
                                    className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" placeholder="Ví dụ: TREAT, PREPARE" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Đề xuất sử dụng (Usage)</label>
                                  <select value={item.usage || ''} onChange={e => { const l = [...sigItems]; l[idx] = { ...l[idx], usage: e.target.value }; setSigItems(l); }}
                                    className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white h-[34px]">
                                    <option value="">-- tự động theo loại --</option>
                                    <option value="AM">AM (Sáng)</option>
                                    <option value="PM">PM (Tối)</option>
                                    <option value="AM · PM">AM · PM (Sáng & Tối)</option>
                                  </select>
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Media Slot</label>
                                  <select value={item.mediaSlot || ''} onChange={e => { const l = [...sigItems]; l[idx] = { ...l[idx], mediaSlot: e.target.value }; setSigItems(l); }}
                                    className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white h-[34px]">
                                    <option value="">-- để trống = tự khớp theo tên --</option>
                                    {COSMETIC_PRODUCT_MEDIA_SLOTS.map(slot => (
                                      <option key={slot.value} value={slot.value}>{slot.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Thành phần nổi bật</label>
                                  <input type="text" value={item.key || ''} onChange={e => { const l = [...sigItems]; l[idx] = { ...l[idx], key: e.target.value }; setSigItems(l); }}
                                    className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" placeholder="Ví dụ: Ceramide NP · Madecassoside" />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mô tả ngắn</label>
                                  <textarea value={item.description || item.desc || ''} onChange={e => { const l = [...sigItems]; l[idx] = { ...l[idx], description: e.target.value }; setSigItems(l); }}
                                    rows={2} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                                </div>
                                <div className="md:col-span-2 flex items-center py-1">
                                  <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input type="checkbox" checked={!!item.highlight} onChange={e => { const l = [...sigItems]; l[idx] = { ...l[idx], highlight: e.target.checked }; setSigItems(l); }}
                                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-[10px] font-bold text-slate-700 uppercase">Sản phẩm chủ đạo (CORE / Highlight)</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          ))}
                          <button type="button"
                            onClick={() => setSigItems([...sigItems, { name: '', type: '', key: '', description: '', mediaSlot: '' }])}
                            className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline mt-1 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg">
                            <Plus className="h-3 w-3" />
                            <span>Thêm sản phẩm mới</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="col-span-2 flex items-center py-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editIsActive}
                      onChange={(e) => setEditIsActive(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-700 uppercase">Hiển thị công khai (Is Active)</span>
                  </label>
                </div>

                {/* Collapsible Advanced JSON Editor */}
                <div className="col-span-2 border-t border-slate-100 pt-4 mt-2">
                  <details className="group border border-slate-200 rounded-xl overflow-hidden">
                    <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-600 select-none transition">
                      Advanced JSON dành cho developer
                    </summary>
                    <div className="p-4 border-t border-slate-200 space-y-2 bg-slate-50/50">
                      {jsonError && (
                        <p className="text-xs text-red-600 bg-red-50 p-2 rounded-md border border-red-100">{jsonError}</p>
                      )}
                      <textarea 
                        value={editItemsJson} 
                        onChange={e => {
                          setEditItemsJson(e.target.value);
                          setIsJsonDirty(true);
                        }}
                        rows={10}
                        className="w-full text-xs font-mono p-3 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-blue-500" 
                        placeholder="[ { ... } ]"
                      />
                      <p className="text-[10px] text-slate-400">Chỉ chỉnh sửa trực tiếp JSON nếu bạn hiểu rõ cấu trúc schema của block này.</p>
                    </div>
                  </details>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50 rounded-b-2xl">
              <button 
                onClick={() => setEditingBlock(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
                disabled={isSaving}
              >
                Hủy
              </button>
              <button 
                onClick={handleSaveSectionEdits}
                disabled={isSaving}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow disabled:opacity-50"
              >
                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── LIBRARY ASSET PICKER MODAL ─────────────────────────────────── */}
      {pickerOpenSlot && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col border border-slate-100">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Chọn ảnh từ thư viện cho slot</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{pickerOpenSlot}</p>
              </div>
              <button 
                type="button"
                onClick={() => { setPickerOpenSlot(null); setPickerError(null); }}
                className="text-slate-400 hover:text-slate-600 transition p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex-1 overflow-y-auto bg-slate-50 space-y-4">
              {pickerError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
                  {pickerError}
                </div>
              )}
              {libraryImages.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                  Không tìm thấy ảnh nào trong thư viện Media Assets.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {libraryImages.slice(0, 50).map(asset => (
                    <div key={asset.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-blue-500 transition-colors">
                      <div className="relative aspect-video sm:aspect-square bg-slate-50">
                        <img src={asset.url} alt={asset.alt_text || ''} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3 space-y-1">
                        <p className="text-[10px] text-slate-400 font-mono truncate">{asset.site_key}</p>
                        <p className="text-[10px] text-slate-600 font-bold truncate" title={asset.alt_text || 'Không có Alt'}>
                          {asset.alt_text || 'Không có Alt'}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleAssignMediaAsset(asset.id)}
                          disabled={isSaving}
                          className="w-full mt-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg transition disabled:opacity-50"
                        >
                          {isSaving ? 'Đang chọn...' : 'Chọn ảnh'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end bg-white rounded-b-2xl">
              <button 
                type="button"
                onClick={() => { setPickerOpenSlot(null); setPickerError(null); }}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
