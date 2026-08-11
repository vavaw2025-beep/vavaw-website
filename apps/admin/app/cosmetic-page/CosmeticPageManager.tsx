"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateContentBlockAction } from '../content/actions';
import { removeCosmeticMediaSlot, assignMediaAssetToSlot } from './actions';
import { ContentBlockRecord, MediaAssetRecord } from '@vavaw/db';
import Link from 'next/link';
import {
  COSMETIC_PRODUCT_MEDIA_SLOTS,
  COSMETIC_VIDEO_MEDIA_SLOTS,
  SIG_MEDIA_SLOT_VALUES,
  normalizeCosmeticMediaSlot,
  getDefaultCosmeticItemMetadata,
  isCosmeticVideoMediaSlot,
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
  ExternalLink,
  Video,
  ChevronDown
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
  { id: 'cosmetic-gallery-packaging', name: 'Thư viện - Bao bì sản phẩm', size: '1600x2000' },
  { id: 'cosmetic-set-cellurevive-ampoule', name: 'Ảnh chi tiết CELLUREVIVE Ampoule trong set', size: '1200x1500 hoặc 1600x2000' },
  { id: 'cosmetic-set-regenaglow-sheer-cream', name: 'Ảnh chi tiết REGENAGLOW NOURISH SHEER CREAM trong set', size: '1200x1500 hoặc 1600x2000' },
  // Video slots for Clinical Formula Lab
  { id: 'cosmetic-video-regenaglow-cream', name: 'Video Regenaglow Nourish Sheer Cream', size: 'Video dọc 9:16, 1080x1920, MP4/WebM' },
  { id: 'cosmetic-video-calmiance-gel', name: 'Video Calmiance Superior Sheer Gel', size: 'Video dọc 9:16, 1080x1920, MP4/WebM' },
  { id: 'cosmetic-video-renew-ampoule', name: 'Video Gentle Activation Renew Ampoule', size: 'Video dọc 9:16, 1080x1920, MP4/WebM' },
  { id: 'cosmetic-video-p30-moisturizer', name: 'Video P30 Boost Facial Moisturizer', size: 'Video dọc 9:16, 1080x1920, MP4/WebM' },
  { id: 'cosmetic-video-p30-toner', name: 'Video P30 Boost Facial Hydrating Toner', size: 'Video dọc 9:16, 1080x1920, MP4/WebM' },
  { id: 'cosmetic-video-lumiglow-sunscreen', name: 'Video Lumiglow Rosy Sheer Sunscreen', size: 'Video dọc 9:16, 1080x1920, MP4/WebM' },
  { id: 'cosmetic-premium-program-spa-video', name: 'Video trải nghiệm VAVAW tại spa / clinic', size: 'Video dọc 9:16 hoặc 4:5, dưới 50MB (soft spa scene)' },
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
  const [activeTab, setActiveTab] = useState<'overview' | 'sections' | 'products' | 'ingredients' | 'ritual' | 'images' | 'preview' | 'landings'>('overview');
  
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

  // Ingredient Intelligence Map states
  const [ingLogicTitle, setIngLogicTitle] = useState('');
  const [ingLogicDescription, setIngLogicDescription] = useState('');
  const [ingItems, setIngItems] = useState<any[]>([]);
  // Premium Program / Spa Bridge states
  const [premHeadline, setPremHeadline] = useState('');
  const [premMediaSlot, setPremMediaSlot] = useState('');
  const [premSecondaryCtaLabel, setPremSecondaryCtaLabel] = useState('');
  const [premSecondaryCtaHref, setPremSecondaryCtaHref] = useState('');
  const [premPillars, setPremPillars] = useState<any[]>([]);
  // Final CTA states
  const [finalSecondaryCtaLabel, setFinalSecondaryCtaLabel] = useState('');
  const [finalSecondaryCtaHref, setFinalSecondaryCtaHref] = useState('');
  const [finalTrustPoints, setFinalTrustPoints] = useState<string[]>([]);

  // Luminous product landing visual states
  const [landHeadline, setLandHeadline] = useState('');
  const [landHeroMediaSlot, setLandHeroMediaSlot] = useState('');
  const [landSecondaryCtaLabel, setLandSecondaryCtaLabel] = useState('');
  const [landSecondaryCtaHref, setLandSecondaryCtaHref] = useState('');
  
  // Anti-Gravity Solution states
  const [landAntiGravityEyebrow, setLandAntiGravityEyebrow] = useState('');
  const [landAntiGravityTitle, setLandAntiGravityTitle] = useState('');
  const [landAntiGravityHeadline, setLandAntiGravityHeadline] = useState('');
  const [landAntiGravityDescription, setLandAntiGravityDescription] = useState('');
  const [landAntiGravityMediaSlot, setLandAntiGravityMediaSlot] = useState('');
  const [landAntiGravityCallouts, setLandAntiGravityCallouts] = useState<any[]>([]);

  // Who Needs Sheer Set states
  const [landWhoNeedsEyebrow, setLandWhoNeedsEyebrow] = useState('');
  const [landWhoNeedsTitle, setLandWhoNeedsTitle] = useState('');
  const [landWhoNeedsNote, setLandWhoNeedsNote] = useState('');
  const [landWhoNeedsDescription, setLandWhoNeedsDescription] = useState('');
  const [landWhoNeedsMediaSlot, setLandWhoNeedsMediaSlot] = useState('');
  const [landWhoNeedsImageCaption, setLandWhoNeedsImageCaption] = useState('');
  const [landWhoNeedsItems, setLandWhoNeedsItems] = useState<any[]>([]);

  // Skin Barrier & MG3-Plus states
  const [landBarrierEyebrow, setLandBarrierEyebrow] = useState('');
  const [landBarrierTitle, setLandBarrierTitle] = useState('');
  const [landBarrierDescription, setLandBarrierDescription] = useState('');
  const [landBarrierMediaSlot, setLandBarrierMediaSlot] = useState('');
  const [landBarrierMg3Eyebrow, setLandBarrierMg3Eyebrow] = useState('');
  const [landBarrierMg3Title, setLandBarrierMg3Title] = useState('');
  const [landBarrierMg3Description, setLandBarrierMg3Description] = useState('');
  const [landBarrierMg3MediaSlot, setLandBarrierMg3MediaSlot] = useState('');

  // Active Ingredients states
  const [landActiveIngredientsEyebrow, setLandActiveIngredientsEyebrow] = useState('');
  const [landActiveIngredientsTitle, setLandActiveIngredientsTitle] = useState('');
  const [landActiveIngredientsDescription, setLandActiveIngredientsDescription] = useState('');
  const [landActiveIngredientsMediaSlot, setLandActiveIngredientsMediaSlot] = useState('');
  const [landActiveIngredientsItems, setLandActiveIngredientsItems] = useState<any[]>([]);

  const [landInsideSet, setLandInsideSet] = useState<any[]>([]);
  const [landRecoverySteps, setLandRecoverySteps] = useState<any[]>([]);
  const [landTechnologies, setLandTechnologies] = useState<any[]>([]);
  const [landWhoFor, setLandWhoFor] = useState<any[]>([]);
  const [landHowToUse, setLandHowToUse] = useState<any[]>([]);
  const [landSpaBridgeTitle, setLandSpaBridgeTitle] = useState('');
  const [landSpaBridgeDescription, setLandSpaBridgeDescription] = useState('');
  const [landSpaBridgeCtaLabel, setLandSpaBridgeCtaLabel] = useState('');
  const [landSpaBridgeCtaHref, setLandSpaBridgeCtaHref] = useState('');
  const [landProductInfo, setLandProductInfo] = useState<any[]>([]);
  const [landFinalTitle, setLandFinalTitle] = useState('');
  const [landFinalDescription, setLandFinalDescription] = useState('');
  const [landFinalCtaLabel, setLandFinalCtaLabel] = useState('');
  const [landFinalCtaHref, setLandFinalCtaHref] = useState('');


  // Sync prop changes
  useEffect(() => {
    setBlocks(initialBlocks);
  }, [initialBlocks]);

  const canEdit = ['owner', 'admin', 'editor'].includes(role);

  // Computed metrics
  const cosmeticPageBlocks = blocks.filter(b => !b.block_type.startsWith('cosmetic-product-landing-'));
  const totalSections = cosmeticPageBlocks.length;
  const activeCount = cosmeticPageBlocks.filter(b => b.is_active).length;
  const inactiveCount = totalSections - activeCount;

  const isGallerySectionActive = blocks.find(b => b.block_type === 'cosmetic-editorial-gallery')?.is_active ?? false;
  const EXCLUDED_GALLERY_SLOTS = [
    'cosmetic-gallery-ritual-panel',
    'cosmetic-gallery-product-set',
    'cosmetic-gallery-texture',
    'cosmetic-gallery-clinic',
    'cosmetic-gallery-skin',
    'cosmetic-gallery-serum',
    'cosmetic-gallery-packaging'
  ];

  const activeRequiredSlots = REQUIRED_SLOTS.filter(slot => {
    if (!isGallerySectionActive && EXCLUDED_GALLERY_SLOTS.includes(slot.id)) {
      return false;
    }
    return true;
  });

  const imageSlots = activeRequiredSlots.filter(slot => !isCosmeticVideoMediaSlot(slot.id));
  const videoSlots = activeRequiredSlots.filter(slot => isCosmeticVideoMediaSlot(slot.id));

  const uploadedImagesCount = imageSlots.filter(slot => {
    return mediaAssets.some(m => 
      m.metadata?.slot === slot.id && 
      !m.metadata?.archivedFromSlot &&
      (['image', 'preview-image', 'hero-image'].includes(m.type) || m.mime_type?.startsWith('image/'))
    );
  }).length;

  const uploadedVideosCount = videoSlots.filter(slot => {
    return mediaAssets.some(m => 
      m.metadata?.slot === slot.id && 
      !m.metadata?.archivedFromSlot &&
      (m.type === 'video' || m.mime_type?.startsWith('video/'))
    );
  }).length;

  const totalMediaCount = uploadedImagesCount + uploadedVideosCount;
  const totalRequiredSlots = activeRequiredSlots.length;
  const missingMediaCount = totalRequiredSlots - totalMediaCount;

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

  // cosmetic-hero-product visual states
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroMediaSlot, setHeroMediaSlot] = useState('');
  const [heroIngredients, setHeroIngredients] = useState('');
  const [heroBenefits, setHeroBenefits] = useState<string[]>([]);
  const [heroInsideBox, setHeroInsideBox] = useState<any[]>([]);
  const [heroScienceTitle, setHeroScienceTitle] = useState('');
  const [heroScienceDescription, setHeroScienceDescription] = useState('');
  const [heroUsageSteps, setHeroUsageSteps] = useState<string[]>([]);
  const [heroSetProducts, setHeroSetProducts] = useState<any[]>([]);

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
    if (block.block_type.startsWith('cosmetic-product-landing-')) {
      setEditItemsJson(JSON.stringify(content, null, 2));
    } else {
      setEditItemsJson(content.items ? JSON.stringify(content.items, null, 2) : '');
    }
    setPhilosophyItems(content.items || []);

    if (block.block_type === 'cosmetic-hero-product') {
      setHeroHeadline(content.headline || '');
      setHeroMediaSlot(content.mediaSlot || 'cosmetic-product-luminous-set');
      setHeroIngredients(
        Array.isArray(content.ingredients) ? content.ingredients.join(', ') : (content.ingredients || '')
      );
      setHeroBenefits(content.benefits || []);
      setHeroInsideBox(content.insideBox || []);
      setHeroScienceTitle(content.scienceTitle || '');
      setHeroScienceDescription(content.scienceDescription || '');
      setHeroUsageSteps(content.usageSteps || []);
      setHeroSetProducts(content.setProducts || []);
    }

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
      // Normalize each item's mediaSlot on load and populate step/role/usage/highlight defaults
      setSigItems(
        (content.items || []).map((item: any, idx: number) => {
          const defaults = getDefaultCosmeticItemMetadata(item.name || '', idx);
          return {
            ...item,
            step: item.step || defaults.step,
            role: item.role || defaults.role,
            usage: item.usage || defaults.usage,
            highlight: item.highlight !== undefined ? Boolean(item.highlight) : defaults.highlight,
            mediaSlot: normalizeCosmeticMediaSlot(item.mediaSlot) ?? item.mediaSlot ?? '',
          };
        })
      );
    }

    if (block.block_type === 'cosmetic-ingredients') {
      setIngLogicTitle(content.logicTitle || 'Clinical Formula Logic');
      setIngLogicDescription(content.logicDescription || 'Mỗi hoạt chất được đặt vào đúng vai trò trong routine: chuẩn bị da, hỗ trợ tái tạo, làm dịu, khóa ẩm và bảo vệ ban ngày.');
      setIngItems(content.items || []);
    }

    if (block.block_type === 'cosmetic-premium-program') {
      setPremHeadline(content.headline || '');
      setPremMediaSlot(content.mediaSlot || 'cosmetic-premium-program-spa-video');
      setPremSecondaryCtaLabel(content.secondaryCtaLabel || '');
      setPremSecondaryCtaHref(content.secondaryCtaHref || '');
      setPremPillars(content.pillars || content.items || []);
    }

    if (block.block_type === 'cosmetic-final-cta') {
      setFinalSecondaryCtaLabel(content.secondaryCtaLabel || '');
      setFinalSecondaryCtaHref(content.secondaryCtaHref || '');
      setFinalTrustPoints(
        Array.isArray(content.trustPoints)
          ? content.trustPoints
          : ['Clinical Korean cosmetic ritual', 'Spa-use recovery guidance', 'Home-care routine support']
      );
    }

    if (block.block_type.startsWith('cosmetic-product-landing-')) {
      setLandHeadline(content.headline || '');
      setLandHeroMediaSlot(content.heroMediaSlot || 'cosmetic-product-luminous-set');
      setLandSecondaryCtaLabel(content.secondaryCtaLabel || '');
      setLandSecondaryCtaHref(content.secondaryCtaHref || '');
      
      const antiGravity = content.antiGravity || {};
      setLandAntiGravityEyebrow(antiGravity.eyebrow || '');
      setLandAntiGravityTitle(antiGravity.title || '');
      setLandAntiGravityHeadline(antiGravity.headline || '');
      setLandAntiGravityDescription(antiGravity.description || '');
      setLandAntiGravityMediaSlot(antiGravity.mediaSlot || 'cosmetic-luminous-anti-gravity-image');
      setLandAntiGravityCallouts(antiGravity.callouts || []);

      const whoNeedsSet = content.whoNeedsSet || {};
      setLandWhoNeedsEyebrow(whoNeedsSet.eyebrow || '');
      setLandWhoNeedsTitle(whoNeedsSet.title || '');
      setLandWhoNeedsNote(whoNeedsSet.note || '');
      setLandWhoNeedsDescription(whoNeedsSet.description || '');
      setLandWhoNeedsMediaSlot(whoNeedsSet.mediaSlot || 'cosmetic-luminous-who-for-image');
      setLandWhoNeedsImageCaption(whoNeedsSet.imageCaption || '');
      setLandWhoNeedsItems(whoNeedsSet.items || []);

      const barrierScience = content.barrierScience || {};
      setLandBarrierEyebrow(barrierScience.eyebrow || '');
      setLandBarrierTitle(barrierScience.title || '');
      setLandBarrierDescription(barrierScience.description || '');
      setLandBarrierMediaSlot(barrierScience.mediaSlot || 'cosmetic-luminous-skin-barrier-image');
      setLandBarrierMg3Eyebrow(barrierScience.mg3Eyebrow || '');
      setLandBarrierMg3Title(barrierScience.mg3Title || '');
      setLandBarrierMg3Description(barrierScience.mg3Description || '');
      setLandBarrierMg3MediaSlot(barrierScience.mg3MediaSlot || 'cosmetic-luminous-mg3-plus-image');

      const activeIngredients = content.activeIngredients || {};
      setLandActiveIngredientsEyebrow(activeIngredients.eyebrow || '');
      setLandActiveIngredientsTitle(activeIngredients.title || '');
      setLandActiveIngredientsDescription(activeIngredients.description || '');
      setLandActiveIngredientsMediaSlot(activeIngredients.mediaSlot || 'cosmetic-luminous-active-ingredients-image');
      setLandActiveIngredientsItems(activeIngredients.ingredients || []);

      setLandInsideSet(content.insideSet || content.setProducts || []);
      setLandRecoverySteps(content.recoverySteps || content.recoveryLogic || []);
      setLandTechnologies(content.technologies || content.activeTech || []);
      setLandWhoFor(
        Array.isArray(content.whoFor || content.whoItsFor)
          ? (content.whoFor || content.whoItsFor).map((item: any) =>
              typeof item === 'string' ? { text: item } : { text: item.text || '' }
            )
          : []
      );
      setLandHowToUse(content.howToUse || []);
      
      const spaBridge = content.spaBridge || {};
      setLandSpaBridgeTitle(spaBridge.title || content.spaBridgeTitle || '');
      setLandSpaBridgeDescription(spaBridge.description || content.spaBridgeDescription || '');
      setLandSpaBridgeCtaLabel(spaBridge.ctaLabel || content.spaBridgeCtaLabel || '');
      setLandSpaBridgeCtaHref(spaBridge.ctaHref || content.spaBridgeCtaHref || '');

      setLandProductInfo(content.productInfo || []);

      const finalCta = content.finalCta || {};
      setLandFinalTitle(finalCta.title || content.finalTitle || '');
      setLandFinalDescription(finalCta.description || content.finalDescription || '');
      setLandFinalCtaLabel(finalCta.ctaLabel || content.finalCtaLabel || '');
      setLandFinalCtaHref(finalCta.ctaHref || content.finalCtaHref || '');
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
        items.map((item, idx) => {
          const defaults = getDefaultCosmeticItemMetadata(item.name || '', idx);
          return {
            ...item,
            step: item.step || defaults.step,
            role: item.role || defaults.role,
            usage: item.usage || defaults.usage,
            highlight: item.highlight !== undefined ? Boolean(item.highlight) : defaults.highlight,
            mediaSlot: normalizeCosmeticMediaSlot(item.mediaSlot) ?? item.mediaSlot ?? '',
          };
        });

      if (isJsonDirty && parsedItems !== undefined) {
        updatedContent.items = normalizeSigItems(parsedItems);
      } else {
        updatedContent.items = normalizeSigItems(sigItems);
      }

      // Debug logs in development
      console.log('[signature save payload]', updatedContent.items.map((item: any) => ({
        name: item.name,
        step: item.step,
        role: item.role,
        usage: item.usage,
        highlight: item.highlight,
        mediaSlot: item.mediaSlot
      })));

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
    } else if (editingBlock.block_type === 'cosmetic-hero-product') {
      const ingArray = heroIngredients
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      updatedContent.headline = heroHeadline;
      updatedContent.mediaSlot = heroMediaSlot || 'cosmetic-product-luminous-set';
      updatedContent.ingredients = ingArray;
      updatedContent.benefits = heroBenefits;
      updatedContent.insideBox = heroInsideBox;
      updatedContent.scienceTitle = heroScienceTitle;
      updatedContent.scienceDescription = heroScienceDescription;
      updatedContent.usageSteps = heroUsageSteps;
      updatedContent.setProducts = heroSetProducts;
    } else if (editingBlock.block_type === 'cosmetic-ingredients') {
      updatedContent.logicTitle = ingLogicTitle;
      updatedContent.logicDescription = ingLogicDescription;
      if (isJsonDirty && parsedItems !== undefined) {
        updatedContent.items = parsedItems;
      } else {
        updatedContent.items = ingItems;
      }
    } else if (editingBlock.block_type === 'cosmetic-premium-program') {
      updatedContent.headline = premHeadline;
      updatedContent.mediaSlot = premMediaSlot;
      updatedContent.secondaryCtaLabel = premSecondaryCtaLabel;
      updatedContent.secondaryCtaHref = premSecondaryCtaHref;
      if (isJsonDirty && parsedItems !== undefined) {
        updatedContent.pillars = parsedItems;
      } else {
        updatedContent.pillars = premPillars;
      }
    } else if (editingBlock.block_type === 'cosmetic-final-cta') {
      updatedContent.secondaryCtaLabel = finalSecondaryCtaLabel;
      updatedContent.secondaryCtaHref = finalSecondaryCtaHref;
      updatedContent.trustPoints = finalTrustPoints;
    } else if (editingBlock.block_type.startsWith('cosmetic-product-landing-')) {
      if (isJsonDirty && parsedItems !== undefined) {
        Object.assign(updatedContent, parsedItems);
      } else {
        updatedContent.headline = landHeadline;
        updatedContent.heroMediaSlot = landHeroMediaSlot;
        updatedContent.secondaryCtaLabel = landSecondaryCtaLabel;
        updatedContent.secondaryCtaHref = landSecondaryCtaHref;
        
        // Only include antiGravity if it's the Luminous Set landing block
        if (editingBlock.block_type === 'cosmetic-product-landing-luminous-set') {
          updatedContent.antiGravity = {
            eyebrow: landAntiGravityEyebrow,
            title: landAntiGravityTitle,
            headline: landAntiGravityHeadline,
            description: landAntiGravityDescription,
            mediaSlot: landAntiGravityMediaSlot,
            callouts: landAntiGravityCallouts
          };
          updatedContent.whoNeedsSet = {
            eyebrow: landWhoNeedsEyebrow,
            title: landWhoNeedsTitle,
            note: landWhoNeedsNote,
            description: landWhoNeedsDescription,
            mediaSlot: landWhoNeedsMediaSlot,
            imageCaption: landWhoNeedsImageCaption,
            items: landWhoNeedsItems
          };
          updatedContent.barrierScience = {
            eyebrow: landBarrierEyebrow,
            title: landBarrierTitle,
            description: landBarrierDescription,
            mediaSlot: landBarrierMediaSlot,
            mg3Eyebrow: landBarrierMg3Eyebrow,
            mg3Title: landBarrierMg3Title,
            mg3Description: landBarrierMg3Description,
            mg3MediaSlot: landBarrierMg3MediaSlot
          };
          updatedContent.activeIngredients = {
            eyebrow: landActiveIngredientsEyebrow,
            title: landActiveIngredientsTitle,
            description: landActiveIngredientsDescription,
            mediaSlot: landActiveIngredientsMediaSlot,
            ingredients: landActiveIngredientsItems
          };
        }

        updatedContent.insideSet = landInsideSet;
        updatedContent.recoverySteps = landRecoverySteps;
        updatedContent.technologies = landTechnologies;
        updatedContent.whoFor = landWhoFor.map((item: any) => item.text || '');
        updatedContent.howToUse = landHowToUse;
        updatedContent.spaBridge = {
          title: landSpaBridgeTitle,
          description: landSpaBridgeDescription,
          ctaLabel: landSpaBridgeCtaLabel,
          ctaHref: landSpaBridgeCtaHref
        };
        updatedContent.productInfo = landProductInfo;
        updatedContent.finalCta = {
          title: landFinalTitle,
          description: landFinalDescription,
          ctaLabel: landFinalCtaLabel,
          ctaHref: landFinalCtaHref
        };
      }
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
  const [prodDetailDesc, setProdDetailDesc] = useState('');
  const [prodSkinConcerns, setProdSkinConcerns] = useState('');
  const [prodBestFor, setProdBestFor] = useState('');
  const [prodUsage, setProdUsage] = useState('');
  const [prodMediaSlot, setProdMediaSlot] = useState('');
  const [prodVideoSlot, setProdVideoSlot] = useState('');
  const [prodHighlight, setProdHighlight] = useState(false);

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
      setProdDetailDesc('');
      setProdSkinConcerns('');
      setProdBestFor('');
      setProdUsage('');
      setProdMediaSlot('cosmetic-product-luminous-set');
      setProdHighlight(false);
    } else {
      const cardsBlock = blocks.find(b => b.block_type === 'cosmetic-product-cards');
      const items = cardsBlock?.content?.items || [];
      const item = items.find((i: any) => i.name === selectedProduct);
      if (item) {
        setProdName(item.name || '');
        setProdType(item.type || '');
        setProdVolume(item.volume || '');
        setProdPrice(item.price || '');
        setProdDesc(item.desc || item.shortDescription || '');
        setProdBenefits(item.benefits || []);
        // ingredients can be string or array
        const rawIng = item.ingredients || '';
        setProdIngredients(typeof rawIng === 'string' ? rawIng.split(' · ') : rawIng);
        setProdDetailDesc(item.description || '');
        const rawConcerns = item.skinConcerns || '';
        setProdSkinConcerns(Array.isArray(rawConcerns) ? rawConcerns.join(', ') : rawConcerns);
        setProdBestFor(item.bestFor || '');
        setProdUsage(item.usage || '');
        setProdMediaSlot(item.mediaSlot || '');
        setProdVideoSlot(item.videoSlot || '');
        setProdHighlight(!!item.highlight);
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
                shortDescription: prodDesc,
                description: prodDetailDesc,
                benefits: prodBenefits,
                ingredients: prodIngredients,
                skinConcerns: prodSkinConcerns.split(',').map(s => s.trim()).filter(Boolean),
                bestFor: prodBestFor,
                usage: prodUsage,
                highlight: prodHighlight,
                mediaSlot: prodMediaSlot,
                videoSlot: prodVideoSlot
              };
              if (prodVolume) updatedItem.volume = prodVolume;
              if (prodPrice) updatedItem.price = prodPrice;
              return updatedItem;
            }
            return item;
          });
        }

        // Sync with signature collection item by name (sharing mediaSlot, usage, highlight)
        const sigBlock = newBlocks.find((b: any) => b.block_type === 'cosmetic-signature-collection');
        if (sigBlock && sigBlock.content && Array.isArray(sigBlock.content.items)) {
          sigBlock.content.items = sigBlock.content.items.map((item: any) => {
            if (item.name === selectedProduct) {
              return {
                ...item,
                mediaSlot: prodMediaSlot,
                usage: prodUsage,
                highlight: prodHighlight
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
  const [ritualEyebrow, setRitualEyebrow] = useState('');
  const [ritualTitle, setRitualTitle] = useState('');
  const [ritualDescription, setRitualDescription] = useState('');
  const [ritualCtaLabel, setRitualCtaLabel] = useState('');
  const [ritualCtaHref, setRitualCtaHref] = useState('');
  const [ageGroupsList, setAgeGroupsList] = useState<any[]>([]);
  const [concernsList, setConcernsList] = useState<any[]>([]);
  const [goalsList, setGoalsList] = useState<any[]>([]);
  const [recommendationsList, setRecommendationsList] = useState<any[]>([]);

  useEffect(() => {
    const ritBlock = blocks.find(b => b.block_type === 'cosmetic-daily-ritual');
    const content = ritBlock?.content || {};
    setRitualList(content.items || []);
    setRitualEyebrow(content.eyebrow || 'DAILY CLINICAL RITUAL');
    setRitualTitle(content.title || 'Find Your Clinical Ritual');
    setRitualDescription(content.description || 'Answer a few quick questions to discover a Korean clinical skincare ritual designed for your skin stage and concern.');
    setRitualCtaLabel(content.ctaLabel || 'Nhận tư vấn cá nhân hóa');
    setRitualCtaHref(content.ctaHref || '/contact?type=cosmetic_interest');
    setAgeGroupsList(content.ageGroups || []);
    setConcernsList(content.concerns || []);
    setGoalsList(content.goals || []);
    setRecommendationsList(
      (content.recommendations || []).map((rec: any) => ({
        id: rec.id || '',
        matchAgeGroup: rec.match?.ageGroup || '',
        matchConcern: rec.match?.concern || '',
        matchGoal: rec.match?.goal || '',
        title: rec.title || '',
        description: rec.description || '',
        whyThisFits: rec.whyThisFits || '',
        morning: Array.isArray(rec.morning) ? rec.morning.join('\n') : rec.morning || '',
        evening: Array.isArray(rec.evening) ? rec.evening.join('\n') : rec.evening || '',
        actives: Array.isArray(rec.actives) ? rec.actives.join(', ') : rec.actives || '',
      }))
    );
  }, [blocks]);

  const handleSaveRitual = async () => {
    const ritBlock = blocks.find(b => b.block_type === 'cosmetic-daily-ritual');
    if (!ritBlock) return;

    const updatedContent = {
      ...ritBlock.content,
      eyebrow: ritualEyebrow,
      title: ritualTitle,
      description: ritualDescription,
      ctaLabel: ritualCtaLabel,
      ctaHref: ritualCtaHref,
      ageGroups: ageGroupsList,
      concerns: concernsList,
      goals: goalsList,
      recommendations: recommendationsList.map((rec: any) => {
        const matchObj: any = {
          concern: rec.matchConcern,
          goal: rec.matchGoal,
        };
        if (rec.matchAgeGroup) {
          matchObj.ageGroup = rec.matchAgeGroup;
        }
        return {
          id: rec.id,
          match: matchObj,
          title: rec.title,
          description: rec.description,
          whyThisFits: rec.whyThisFits,
          morning: typeof rec.morning === 'string' ? rec.morning.split('\n').map((s: string) => s.trim()).filter(Boolean) : rec.morning,
          evening: typeof rec.evening === 'string' ? rec.evening.split('\n').map((s: string) => s.trim()).filter(Boolean) : rec.evening,
          actives: typeof rec.actives === 'string' ? rec.actives.split(',').map((s: string) => s.trim()).filter(Boolean) : rec.actives,
        };
      }),
      // Keep legacy items preserved
      items: ritualList
    };

    await handleSaveBlock(ritBlock.id, ritBlock.site_key, ritBlock.page_path, updatedContent, ritBlock.is_active, ritBlock.sort_order);
  };

  const handleRemoveMediaSlot = async (slot: string) => {
    const isVideo = isCosmeticVideoMediaSlot(slot);
    const label = isVideo ? 'video' : 'ảnh';
    if (!confirm(`Bạn chỉ đang gỡ ${label} khỏi vị trí này. File vẫn còn trong Media Library.`)) return;

    setIsSaving(true);
    const res = await removeCosmeticMediaSlot(slot);
    setIsSaving(false);

    if (res.success) {
      showSuccess(`Đã gỡ ${label} khỏi slot thành công!`);
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

  // Library filtering
  const isPickerVideoSlot = pickerOpenSlot ? isCosmeticVideoMediaSlot(pickerOpenSlot) : false;
  const libraryAssets = mediaAssets.filter(m => {
    if (isPickerVideoSlot) {
      return m.type === 'video' || m.mime_type?.startsWith('video');
    }
    return m.type === 'image' || m.mime_type?.startsWith('image');
  });

  return (
    <div className="w-full overflow-x-hidden space-y-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
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
      <div className="w-full">
        <div className="flex flex-wrap border-b border-slate-200 gap-2 px-1 pb-2">
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
          <span>Hình ảnh & Video</span>
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
        <button
          onClick={() => setActiveTab('landings')}
          className={`py-3 px-5 text-sm font-semibold border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
            activeTab === 'landings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Landing sản phẩm</span>
        </button>
        </div>
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
              <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">Media còn thiếu</div>
              <div className={`text-3xl font-extrabold ${missingMediaCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {missingMediaCount}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Ảnh đã tải</div>
              <div className="text-2xl font-extrabold text-slate-900">
                {uploadedImagesCount} <span className="text-sm font-normal text-slate-400">/ {imageSlots.length}</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Video đã tải</div>
              <div className="text-2xl font-extrabold text-slate-900">
                {uploadedVideosCount} <span className="text-sm font-normal text-slate-400">/ {videoSlots.length}</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tổng media</div>
              <div className="text-2xl font-extrabold text-slate-900">
                {totalMediaCount} <span className="text-sm font-normal text-slate-400">/ {activeRequiredSlots.length}</span>
              </div>
            </div>
          </div>

          {!isGallerySectionActive && (
            <div className="bg-slate-50 border border-slate-200 text-slate-600 rounded-xl p-4 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400 inline-block shrink-0" />
              <span>Thư viện hình ảnh đang ẩn — có thể phát triển sau khi có feedback.</span>
            </div>
          )}

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
            {cosmeticPageBlocks.map(block => (
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

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cách dùng / AM-PM</label>
                <select
                  value={prodUsage}
                  onChange={e => setProdUsage(e.target.value)}
                  disabled={selectedProduct === 'Luminous Revitalization Sheer Set'}
                  className="w-full text-sm p-2 border border-slate-300 rounded-md disabled:bg-slate-50 h-[38px]"
                >
                  <option value="">-- tự động theo loại --</option>
                  <option value="AM">AM (Sáng)</option>
                  <option value="PM">PM (Tối)</option>
                  <option value="AM · PM">AM · PM (Sáng & Tối)</option>
                </select>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ảnh đại diện (Media Slot)</label>
                <div className="flex items-center gap-3 mb-2">
                  {(() => {
                    const slotId = prodMediaSlot || 'cosmetic-product-luminous-set';
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
                          {slotId && selectedProduct !== 'Luminous Revitalization Sheer Set' && (
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
                {selectedProduct !== 'Luminous Revitalization Sheer Set' && (
                  <select
                    value={prodMediaSlot}
                    onChange={e => setProdMediaSlot(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-md focus:border-blue-500 bg-white"
                  >
                    <option value="">-- Chọn Media Slot --</option>
                    {COSMETIC_PRODUCT_MEDIA_SLOTS.map(slot => (
                      <option key={slot.value} value={slot.value}>{slot.label}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Video Slot for Clinical Formulas */}
              {selectedProduct !== 'Luminous Revitalization Sheer Set' && (
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    <Video className="h-3 w-3 inline mr-1" />
                    Video sản phẩm (Video Slot)
                  </label>
                  <div className="flex items-center gap-3 mb-2">
                    {(() => {
                      const vSlot = prodVideoSlot;
                      const vAsset = vSlot ? mediaAssets.find(m => m.metadata?.slot === vSlot && !m.metadata?.archivedFromSlot) : null;
                      return (
                        <>
                          <div className={`w-12 h-12 border rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 ${vAsset ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-100 border-slate-200'}`}>
                            {vAsset ? (
                              <Video className="h-5 w-5 text-emerald-600" />
                            ) : (
                              <Video className="h-5 w-5 text-slate-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                              vAsset ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {vAsset ? 'Đã có video' : 'Chưa có video'}
                            </span>
                            {vSlot && (
                              <Link
                                href={`/media?purpose=cosmetic-page-media&slot=${vSlot}&returnTo=/cosmetic-page`}
                                className="text-[10px] text-blue-600 font-bold hover:underline block mt-1"
                              >
                                Upload video sản phẩm
                              </Link>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <select
                    value={prodVideoSlot}
                    onChange={e => setProdVideoSlot(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-md focus:border-blue-500 bg-white"
                  >
                    <option value="">-- Chọn Video Slot --</option>
                    {COSMETIC_VIDEO_MEDIA_SLOTS.map(slot => (
                      <option key={slot.value} value={slot.value}>{slot.label}</option>
                    ))}
                  </select>
                  <p className="text-[9px] text-slate-400 mt-1">
                    Video này sẽ hiển thị trong phần Clinical Formulas khi khách chọn sản phẩm. Nên dùng video dọc 9:16, 1080×1920, MP4/WebM.
                  </p>
                </div>
              )}

              {selectedProduct !== 'Luminous Revitalization Sheer Set' && (
                <div className="col-span-2 flex items-center pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={prodHighlight}
                      onChange={e => setProdHighlight(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-700 uppercase">Sản phẩm chủ đạo (CORE / Highlight)</span>
                  </label>
                </div>
              )}

              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mô tả ngắn *</label>
                <textarea
                  value={prodDesc}
                  onChange={e => setProdDesc(e.target.value)}
                  rows={2}
                  className="w-full text-sm p-2 border border-slate-300 rounded-md"
                />
              </div>

              {selectedProduct !== 'Luminous Revitalization Sheer Set' && (
                <>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mô tả chi tiết</label>
                    <textarea
                      value={prodDetailDesc}
                      onChange={e => setProdDetailDesc(e.target.value)}
                      rows={4}
                      className="w-full text-sm p-2 border border-slate-300 rounded-md"
                      placeholder="Mô tả đầy đủ tác dụng, công nghệ và chi tiết sản phẩm..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Vấn đề da phù hợp (cách nhau bởi dấu phẩy)</label>
                    <input
                      type="text"
                      value={prodSkinConcerns}
                      onChange={e => setProdSkinConcerns(e.target.value)}
                      className="w-full text-sm p-2 border border-slate-300 rounded-md"
                      placeholder="Ví dụ: Da nhạy cảm, Tổn thương, Thâm sạm..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phù hợp cho (Best For)</label>
                    <input
                      type="text"
                      value={prodBestFor}
                      onChange={e => setProdBestFor(e.target.value)}
                      className="w-full text-sm p-2 border border-slate-300 rounded-md"
                      placeholder="Ví dụ: Da sau treatment, da kích ứng..."
                    />
                  </div>
                </>
              )}

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
            <span>Skin Ritual Finder Manager / Bộ gợi ý quy trình cá nhân hóa</span>
            <span className="text-[10px] text-slate-400 font-mono">cosmetic-daily-ritual content</span>
          </h3>

          {/* Section general configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 border border-slate-200 rounded-xl">
            <h4 className="col-span-2 text-xs font-bold text-slate-700 uppercase tracking-wider">Cấu hình chung chuyên mục</h4>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Eyebrow</label>
              <input type="text" value={ritualEyebrow} onChange={e => setRitualEyebrow(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Title</label>
              <input type="text" value={ritualTitle} onChange={e => setRitualTitle(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Description</label>
              <textarea value={ritualDescription} onChange={e => setRitualDescription(e.target.value)} rows={2} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">CTA Label</label>
              <input type="text" value={ritualCtaLabel} onChange={e => setRitualCtaLabel(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">CTA Link (Href)</label>
              <input type="text" value={ritualCtaHref} onChange={e => setRitualCtaHref(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
            </div>
          </div>

          {/* Repeaters grid */}
          <div className="space-y-6 pt-4 border-t border-slate-100">
            {/* A. Age Groups */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center justify-between">
                <span>1. Nhóm độ tuổi (Age Groups)</span>
                <button type="button" onClick={() => setAgeGroupsList([...ageGroupsList, { id: '', label: '', description: '' }])} className="text-[10px] text-blue-600 font-bold hover:underline">+ Thêm nhóm mới</button>
              </h4>
              <div className="space-y-2">
                {ageGroupsList.map((g, idx) => (
                  <div key={idx} className="p-3 border border-slate-200 rounded-lg flex items-center gap-3 bg-white">
                    <input type="text" placeholder="ID (ví dụ: 18-24)" value={g.id || ''} onChange={e => { const l = [...ageGroupsList]; l[idx] = { ...l[idx], id: e.target.value }; setAgeGroupsList(l); }} className="w-1/4 text-xs p-1.5 border border-slate-300 rounded" />
                    <input type="text" placeholder="Nhãn (ví dụ: 18–24)" value={g.label || ''} onChange={e => { const l = [...ageGroupsList]; l[idx] = { ...l[idx], label: e.target.value }; setAgeGroupsList(l); }} className="w-1/4 text-xs p-1.5 border border-slate-300 rounded" />
                    <input type="text" placeholder="Mô tả ngắn" value={g.description || ''} onChange={e => { const l = [...ageGroupsList]; l[idx] = { ...l[idx], description: e.target.value }; setAgeGroupsList(l); }} className="flex-1 text-xs p-1.5 border border-slate-300 rounded" />
                    <button type="button" onClick={() => setAgeGroupsList(ageGroupsList.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* B. Concerns */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center justify-between">
                <span>2. Vấn đề da (Skin Concerns)</span>
                <button type="button" onClick={() => setConcernsList([...concernsList, { id: '', label: '' }])} className="text-[10px] text-blue-600 font-bold hover:underline">+ Thêm vấn đề</button>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {concernsList.map((c, idx) => (
                  <div key={idx} className="p-2 border border-slate-200 rounded-lg flex items-center gap-3 bg-white">
                    <input type="text" placeholder="ID (ví dụ: barrier)" value={c.id || ''} onChange={e => { const l = [...concernsList]; l[idx] = { ...l[idx], id: e.target.value }; setConcernsList(l); }} className="w-1/3 text-xs p-1.5 border border-slate-300 rounded" />
                    <input type="text" placeholder="Nhãn tiếng Việt" value={c.label || ''} onChange={e => { const l = [...concernsList]; l[idx] = { ...l[idx], label: e.target.value }; setConcernsList(l); }} className="flex-1 text-xs p-1.5 border border-slate-300 rounded" />
                    <button type="button" onClick={() => setConcernsList(concernsList.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* C. Goals */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center justify-between">
                <span>3. Mục tiêu dưỡng da (Skincare Goals)</span>
                <button type="button" onClick={() => setGoalsList([...goalsList, { id: '', label: '' }])} className="text-[10px] text-blue-600 font-bold hover:underline">+ Thêm mục tiêu</button>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {goalsList.map((g, idx) => (
                  <div key={idx} className="p-2 border border-slate-200 rounded-lg flex items-center gap-3 bg-white">
                    <input type="text" placeholder="ID (ví dụ: recover)" value={g.id || ''} onChange={e => { const l = [...goalsList]; l[idx] = { ...l[idx], id: e.target.value }; setGoalsList(l); }} className="w-1/3 text-xs p-1.5 border border-slate-300 rounded" />
                    <input type="text" placeholder="Nhãn tiếng Việt" value={g.label || ''} onChange={e => { const l = [...goalsList]; l[idx] = { ...l[idx], label: e.target.value }; setGoalsList(l); }} className="flex-1 text-xs p-1.5 border border-slate-300 rounded" />
                    <button type="button" onClick={() => setGoalsList(goalsList.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* D. Recommendations */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center justify-between">
                <span>4. Gợi ý liệu trình (Recommendations)</span>
                <button type="button" onClick={() => setRecommendationsList([...recommendationsList, { id: '', matchAgeGroup: '', matchConcern: '', matchGoal: '', title: '', description: '', whyThisFits: '', morning: '', evening: '', actives: '' }])} className="text-[10px] text-blue-600 font-bold hover:underline">+ Thêm gợi ý liệu trình</button>
              </h4>
              <div className="space-y-4">
                {recommendationsList.map((rec, idx) => (
                  <div key={idx} className="p-4 border border-slate-300 rounded-xl bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-[11px] font-bold text-slate-600 uppercase font-mono">Liệu trình #{idx + 1}</span>
                      <button type="button" onClick={() => setRecommendationsList(recommendationsList.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="h-4 w-4" /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mã ID gợi ý</label>
                        <input type="text" placeholder="Ví dụ: barrier-recovery" value={rec.id || ''} onChange={e => { const l = [...recommendationsList]; l[idx] = { ...l[idx], id: e.target.value }; setRecommendationsList(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tiêu đề liệu trình</label>
                        <input type="text" placeholder="Ví dụ: Barrier Recovery Ritual" value={rec.title || ''} onChange={e => { const l = [...recommendationsList]; l[idx] = { ...l[idx], title: e.target.value }; setRecommendationsList(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Thành phần hoạt tính (cách nhau dấu phẩy)</label>
                        <input type="text" placeholder="Cica 7 Complex, Aloe..." value={rec.actives || ''} onChange={e => { const l = [...recommendationsList]; l[idx] = { ...l[idx], actives: e.target.value }; setRecommendationsList(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-3 border border-slate-200 rounded-lg">
                      <div className="col-span-3 text-[10px] font-bold text-slate-600 uppercase">Quy luật khớp điều kiện (Matching rules)</div>
                      <div>
                        <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Nhóm tuổi (Tùy chọn)</label>
                        <select value={rec.matchAgeGroup || ''} onChange={e => { const l = [...recommendationsList]; l[idx] = { ...l[idx], matchAgeGroup: e.target.value }; setRecommendationsList(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white">
                          <option value="">-- Bất kỳ độ tuổi --</option>
                          {ageGroupsList.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Vấn đề da *</label>
                        <select value={rec.matchConcern || ''} onChange={e => { const l = [...recommendationsList]; l[idx] = { ...l[idx], matchConcern: e.target.value }; setRecommendationsList(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white">
                          <option value="">-- Chọn vấn đề da --</option>
                          {concernsList.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Mục tiêu *</label>
                        <select value={rec.matchGoal || ''} onChange={e => { const l = [...recommendationsList]; l[idx] = { ...l[idx], matchGoal: e.target.value }; setRecommendationsList(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white">
                          <option value="">-- Chọn mục tiêu --</option>
                          {goalsList.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mô tả tổng quan</label>
                        <textarea rows={2} value={rec.description || ''} onChange={e => { const l = [...recommendationsList]; l[idx] = { ...l[idx], description: e.target.value }; setRecommendationsList(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" placeholder="A calming routine designed to restore..." />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tại sao phù hợp (whyThisFits)</label>
                        <textarea rows={2} value={rec.whyThisFits || ''} onChange={e => { const l = [...recommendationsList]; l[idx] = { ...l[idx], whyThisFits: e.target.value }; setRecommendationsList(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" placeholder="Phù hợp với làn da nhạy cảm sau treatment..." />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sản phẩm dùng Ban sáng (Morning - một dòng mỗi sản phẩm)</label>
                        <textarea rows={3} value={rec.morning || ''} onChange={e => { const l = [...recommendationsList]; l[idx] = { ...l[idx], morning: e.target.value }; setRecommendationsList(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white font-mono" placeholder="P30 Boost Facial Hydrating Toner&#13;Calmiance Superior Sheer Gel" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sản phẩm dùng Ban đêm (Evening - một dòng mỗi sản phẩm)</label>
                        <textarea rows={3} value={rec.evening || ''} onChange={e => { const l = [...recommendationsList]; l[idx] = { ...l[idx], evening: e.target.value }; setRecommendationsList(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white font-mono" placeholder="P30 Boost Facial Hydrating Toner&#13;Regenaglow Nourish Sheer Cream" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* E. Legacy Steps list fallback - kept collapsed at bottom for safety */}
            <div className="pt-4 border-t border-slate-200/60">
              <details className="text-slate-500 cursor-pointer">
                <summary className="text-[10px] font-bold uppercase tracking-wider select-none hover:text-slate-700">Legacy Steps Config (Cấu hình các bước cũ - dự phòng)</summary>
                <div className="space-y-4 pt-3">
                  {ritualList.map((item, idx) => (
                    <div key={idx} className="p-3 border border-slate-200 rounded-lg flex items-center gap-3 bg-slate-50/50">
                      <input type="text" value={item.step || ''} onChange={e => { const l = [...ritualList]; l[idx].step = e.target.value; setRitualList(l); }} className="w-12 text-xs p-1 border border-slate-300 rounded bg-white" placeholder="01" />
                      <input type="text" value={item.name || ''} onChange={e => { const l = [...ritualList]; l[idx].name = e.target.value; setRitualList(l); }} className="w-1/4 text-xs p-1 border border-slate-300 rounded bg-white" placeholder="Tên bước" />
                      <input type="text" value={item.detail || ''} onChange={e => { const l = [...ritualList]; l[idx].detail = e.target.value; setRitualList(l); }} className="flex-1 text-xs p-1 border border-slate-300 rounded bg-white" placeholder="Mô tả bước" />
                      <button type="button" onClick={() => setRitualList(ritualList.filter((_, i) => i !== idx))} className="text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setRitualList([...ritualList, { step: '', name: '', detail: '' }])} className="text-xs text-blue-600 font-bold hover:underline">+ Thêm bước cũ mới</button>
                </div>
              </details>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSaveRitual}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow disabled:opacity-50"
            >
              {isSaving ? 'Đang lưu...' : 'Lưu quy trình'}
            </button>
          </div>
        </div>
      )}

      {/* ─── TAB CONTENT 6: IMAGES (MEDIA SLOTS) ───────────────────────── */}
      {activeTab === 'images' && (() => {
        const group1Slots = REQUIRED_SLOTS.filter(s => !isCosmeticVideoMediaSlot(s.id) && !s.id.startsWith('cosmetic-set-') && s.id !== 'cosmetic-product-luminous-set' && s.id !== 'cosmetic-premium-program');
        const group2Slots = REQUIRED_SLOTS.filter(s => isCosmeticVideoMediaSlot(s.id) && s.id !== 'cosmetic-premium-program-spa-video');
        const group3Slots = REQUIRED_SLOTS.filter(s => s.id.startsWith('cosmetic-set-') || s.id === 'cosmetic-product-luminous-set');
        const group4Slots = REQUIRED_SLOTS.filter(s => s.id === 'cosmetic-premium-program' || s.id === 'cosmetic-premium-program-spa-video');

        const renderSlotCard = (slot: typeof REQUIRED_SLOTS[number]) => {
          const asset = mediaAssets.find(m => m.metadata?.slot === slot.id && !m.metadata?.archivedFromSlot);
          const isVideoSlot = isCosmeticVideoMediaSlot(slot.id);
          return (
            <div key={slot.id} className={`p-4 rounded-xl border transition-all flex gap-4 ${
              asset 
                ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300' 
                : 'bg-slate-50/50 border-dashed border-slate-300'
            }`}>
              {/* Thumbnail */}
              <div className="w-24 h-24 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center relative group">
                {asset ? (
                  isVideoSlot ? (
                    <>
                      <div className="w-full h-full bg-[#050A5C]/10 flex items-center justify-center">
                        <Video className="h-8 w-8 text-[#050A5C]/40" />
                      </div>
                      <a 
                        href={asset.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-semibold"
                      >
                        Xem video
                      </a>
                    </>
                  ) : (
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
                  )
                ) : (
                  <div className="text-[10px] text-slate-400 font-bold text-center p-2">{isVideoSlot ? 'Chưa có video' : 'Chưa có ảnh'}</div>
                )}
              </div>

              {/* Info & Actions */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{slot.name}</h4>
                    <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                      asset ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {asset ? 'Đã tải lên' : 'Chưa tải'}
                    </span>
                    {!isGallerySectionActive && EXCLUDED_GALLERY_SLOTS.includes(slot.id) && (
                      <span className="text-[9px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded-sm">
                        Đang ẩn — không tính vào launch checklist
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{slot.id}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Khuyên dùng: {slot.size}</p>
                  {asset && (
                    <div className="text-[9px] text-slate-400 mt-1 space-y-0.5">
                      {asset.mime_type && <p>Định dạng: <span className="font-mono">{asset.mime_type}</span></p>}
                      {asset.size_bytes && <p>Dung lượng: <span className="font-mono">{(asset.size_bytes / 1024 / 1024).toFixed(2)} MB</span></p>}
                      {asset.created_at && (
                        <p>Ngày tải lên: {new Date(asset.created_at).toLocaleDateString('vi-VN')}</p>
                      )}
                    </div>
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
                    <span>{isVideoSlot ? (asset ? 'Đổi video' : 'Tải video') : (asset ? 'Đổi ảnh' : 'Tải ảnh')}</span>
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
                      {isVideoSlot ? 'Xem video' : 'Xem ảnh'}
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
        };

        return (
          <div className="space-y-8 animate-fade-in">
            {/* Group 1: Ảnh sản phẩm */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Ảnh sản phẩm & Thư viện</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group1Slots.map(slot => renderSlotCard(slot))}
              </div>
            </div>

            {/* Group 2: Video Clinical Formulas */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Video Clinical Formulas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group2Slots.map(slot => renderSlotCard(slot))}
              </div>
            </div>

            {/* Group 3: Video/ảnh bộ sản phẩm (Set) */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Video/ảnh Set & Bộ sản phẩm</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group3Slots.map(slot => renderSlotCard(slot))}
              </div>
            </div>

            {/* Group 4: Video / ảnh spa & professional program */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Video / ảnh spa & professional program</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group4Slots.map(slot => renderSlotCard(slot))}
              </div>
            </div>
          </div>
        );
      })()}


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
              <span className="font-semibold">Ảnh đã tải:</span> {uploadedImagesCount} / {imageSlots.length}
            </div>
            <div>
              <span className="font-semibold">Video đã tải:</span> {uploadedVideosCount} / {videoSlots.length}
            </div>
            <div>
              <span className="font-semibold">Tổng media đã cấu hình:</span> {totalMediaCount} / {activeRequiredSlots.length}
            </div>
            <div>
              <span className="font-semibold">Media còn thiếu:</span> {missingMediaCount}
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

      {/* ─── TAB CONTENT 8: LANDINGS ────────────────────────────────────── */}
      {activeTab === 'landings' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Landing Pages sản phẩm</h2>
              <p className="text-sm text-slate-500">Quản lý nội dung các trang landing page kể chuyện sản phẩm Cosmetic.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(() => {
              const PRODUCT_LANDING_CONFIGS = [
                {
                  title: 'Luminous Revitalization Sheer Set',
                  pagePath: '/cosmetic/products/luminous-revitalization-sheer-set',
                  blockType: 'cosmetic-product-landing-luminous-set',
                  label: 'COSMETIC SET LANDING'
                },
                {
                  title: 'CELLUREVIVE Ampoule',
                  pagePath: '/cosmetic/products/cellurevive-ampoule',
                  blockType: 'cosmetic-product-landing-cellurevive-ampoule',
                  label: 'COSMETIC AMPOULE LANDING'
                },
                {
                  title: 'REGENAGLOW NOURISH SHEER CREAM',
                  pagePath: '/cosmetic/products/regenaglow-nourish-sheer-cream',
                  blockType: 'cosmetic-product-landing-regenaglow-cream',
                  label: 'COSMETIC CREAM LANDING'
                },
                {
                  title: 'Calmiance Superior Sheer Gel',
                  pagePath: '/cosmetic/products/calmiance-superior-sheer-gel',
                  blockType: 'cosmetic-product-landing-calmiance-gel',
                  label: 'COSMETIC GEL LANDING'
                },
                {
                  title: 'P30 Boost Facial Hydrating Toner',
                  pagePath: '/cosmetic/products/p30-boost-facial-hydrating-toner',
                  blockType: 'cosmetic-product-landing-p30-toner',
                  label: 'COSMETIC TONER LANDING'
                },
                {
                  title: 'Gentle Activation Renew Ampoule',
                  pagePath: '/cosmetic/products/gentle-activation-renew-ampoule',
                  blockType: 'cosmetic-product-landing-renew-ampoule',
                  label: 'COSMETIC AMPOULE LANDING'
                },
                {
                  title: 'P30 Boost Facial Moisturizer',
                  pagePath: '/cosmetic/products/p30-boost-facial-moisturizer',
                  blockType: 'cosmetic-product-landing-p30-moisturizer',
                  label: 'COSMETIC MOISTURIZER LANDING'
                },
                {
                  title: 'LUMIGLOW ROSY SHEER SUNSCREEN',
                  pagePath: '/cosmetic/products/lumiglow-rosy-sheer-sunscreen',
                  blockType: 'cosmetic-product-landing-lumiglow-sunscreen',
                  label: 'COSMETIC SUNSCREEN LANDING'
                }
              ];

              return PRODUCT_LANDING_CONFIGS.map((config) => {
                const landingBlock = blocks.find(b => b.block_type === config.blockType);
                return (
                  <div key={config.blockType} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block mb-1">{config.label}</span>
                      <h3 className="text-lg font-bold text-slate-950">{config.title}</h3>
                      <p className="text-xs text-slate-500 font-mono mt-1.5 bg-slate-50 p-2 rounded select-all">
                        {config.pagePath}
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <span className={`h-2.5 w-2.5 rounded-full ${landingBlock?.is_active ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                        <span className="text-xs text-slate-600 font-medium">
                          Trạng thái: {landingBlock ? (landingBlock.is_active ? 'Đang hoạt động (CMS)' : 'Đang tắt (Dùng mặc định static)') : 'Chưa có block'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-4">
                      {landingBlock ? (
                        <button
                          onClick={() => startEditingSection(landingBlock)}
                          className="flex-1 py-2 px-4 bg-[#050A5C] text-white rounded-lg text-xs font-semibold hover:bg-[#101A8C] transition flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Settings className="h-3.5 w-3.5" />
                          Sửa nội dung
                        </button>
                      ) : (
                        <button
                          disabled
                          className="flex-1 py-2 px-4 bg-slate-100 text-slate-400 rounded-lg text-xs font-semibold cursor-not-allowed flex items-center justify-center gap-1.5"
                          title="Vui lòng chạy file seed để tạo block này."
                        >
                          <Settings className="h-3.5 w-3.5" />
                          Chưa có block
                        </button>
                      )}
                      <a
                        href={`${siteUrl}${config.pagePath}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 px-4 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Xem trang public
                      </a>
                    </div>
                  </div>
                );
              });
            })()}
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
                {!editingBlock.block_type.startsWith('cosmetic-product-landing-') && (
                  <>
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

                    {editingBlock.block_type !== 'cosmetic-brand-philosophy' && editingBlock.block_type !== 'cosmetic-ingredients' && (
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
                  </>
                )}

                {editingBlock.block_type.startsWith('cosmetic-product-landing-') && (
                  <div className="col-span-2 space-y-4">
                    {/* 1. Hero Details */}
                    <details className="group border border-slate-200 rounded-xl overflow-hidden" open>
                      <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-750 select-none transition flex items-center justify-between">
                        <span>1. Product Hero (Đầu trang)</span>
                        <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nhãn nhỏ (Eyebrow)</label>
                          <input type="text" value={editEyebrow} onChange={e => setEditEyebrow(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Thứ tự hiển thị (Sort Order)</label>
                          <input type="number" value={editSortOrder} onChange={e => setEditSortOrder(parseInt(e.target.value) || 1)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tên sản phẩm (Title)</label>
                          <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white font-semibold" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Dòng mô tả phụ (Headline)</label>
                          <input type="text" value={landHeadline} onChange={e => setLandHeadline(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mô tả sản phẩm (Description)</label>
                          <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={3} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nhãn nút chính (Primary CTA Label)</label>
                          <input type="text" value={editCtaLabel} onChange={e => setEditCtaLabel(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Đường dẫn nút chính (Primary CTA Link)</label>
                          <input type="text" value={editCtaHref} onChange={e => setEditCtaHref(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nhãn nút phụ (Secondary CTA Label)</label>
                          <input type="text" value={landSecondaryCtaLabel} onChange={e => setLandSecondaryCtaLabel(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Đường dẫn nút phụ (Secondary CTA Link)</label>
                          <input type="text" value={landSecondaryCtaHref} onChange={e => setLandSecondaryCtaHref(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Slot hình ảnh Hero (heroMediaSlot)</label>
                          <select value={landHeroMediaSlot} onChange={e => setLandHeroMediaSlot(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white">
                            <option value="cosmetic-product-luminous-set">Luminous Revitalization Sheer Set (cosmetic-product-luminous-set)</option>
                            <option value="cosmetic-set-cellurevive-ampoule">CELLUREVIVE Ampoule (cosmetic-set-cellurevive-ampoule)</option>
                            <option value="cosmetic-set-regenaglow-sheer-cream">REGENAGLOW Sheer Cream (cosmetic-set-regenaglow-sheer-cream)</option>
                          </select>
                        </div>
                      </div>
                    </details>

                    {/* 1.5. Anti-Gravity Solution Details (Only for Luminous Set) */}
                    {editingBlock.block_type === 'cosmetic-product-landing-luminous-set' && (
                      <details className="group border border-slate-200 rounded-xl overflow-hidden">
                        <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-700 select-none transition flex items-center justify-between">
                          <span>1.5. Anti-Gravity Solution (Phục hồi cấu trúc da)</span>
                          <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nhãn nhỏ (Eyebrow)</label>
                            <input type="text" value={landAntiGravityEyebrow} onChange={e => setLandAntiGravityEyebrow(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Slot hình ảnh (Media Slot)</label>
                            <input type="text" value={landAntiGravityMediaSlot} onChange={e => setLandAntiGravityMediaSlot(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white text-slate-500 font-mono" />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tiêu đề chính (Title)</label>
                            <input type="text" value={landAntiGravityTitle} onChange={e => setLandAntiGravityTitle(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white font-semibold" />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mô tả phụ (Headline)</label>
                            <input type="text" value={landAntiGravityHeadline} onChange={e => setLandAntiGravityHeadline(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Đoạn văn giới thiệu (Description)</label>
                            <textarea value={landAntiGravityDescription} onChange={e => setLandAntiGravityDescription(e.target.value)} rows={3} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                          </div>
                          
                          <div className="col-span-2 mt-2 pt-2 border-t border-slate-100">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Các thông số nổi bật (Callouts)</label>
                            <div className="space-y-3">
                              {landAntiGravityCallouts.map((callout: any, idx: number) => (
                                <div key={idx} className="p-2 border border-slate-200 rounded-lg bg-slate-50 grid grid-cols-2 gap-2 relative">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Nhãn (Label)</label>
                                    <input type="text" value={callout.label || ''} onChange={e => { const l = [...landAntiGravityCallouts]; l[idx] = { ...l[idx], label: e.target.value }; setLandAntiGravityCallouts(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white" />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Giá trị (Value)</label>
                                    <input type="text" value={callout.value || ''} onChange={e => { const l = [...landAntiGravityCallouts]; l[idx] = { ...l[idx], value: e.target.value }; setLandAntiGravityCallouts(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white font-bold text-[#050A5C]" />
                                  </div>
                                  <div className="col-span-2">
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Mô tả (Description)</label>
                                    <input type="text" value={callout.description || ''} onChange={e => { const l = [...landAntiGravityCallouts]; l[idx] = { ...l[idx], description: e.target.value }; setLandAntiGravityCallouts(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white" />
                                  </div>
                                  <button type="button" onClick={() => setLandAntiGravityCallouts(landAntiGravityCallouts.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-slate-400 hover:text-red-600">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ))}
                              <button type="button" onClick={() => setLandAntiGravityCallouts([...landAntiGravityCallouts, { label: '', value: '', description: '' }])} className="w-full py-1.5 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-1">
                                <Plus className="h-3.5 w-3.5" />
                                Thêm Callout
                              </button>
                            </div>
                          </div>
                        </div>
                      </details>
                    )}
                    <details className="group border border-slate-200 rounded-xl overflow-hidden">
                      <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-700 select-none transition flex items-center justify-between">
                        <span>2. Inside The Set (Thành phần trong bộ)</span>
                        <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="p-4 border-t border-slate-200 bg-white space-y-4">
                        <div className="space-y-3">
                          {landInsideSet.map((item: any, idx: number) => (
                            <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-2.5">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                <span className="text-[10px] font-bold text-slate-400 font-mono">Sản phẩm #{idx + 1}</span>
                                <button type="button" onClick={() => setLandInsideSet(landInsideSet.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-600 transition">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="col-span-2">
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Tên sản phẩm</label>
                                  <input type="text" value={item.name || ''} onChange={e => { const l = [...landInsideSet]; l[idx] = { ...l[idx], name: e.target.value }; setLandInsideSet(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Quy cách (Size)</label>
                                  <input type="text" value={item.size || ''} onChange={e => { const l = [...landInsideSet]; l[idx] = { ...l[idx], size: e.target.value }; setLandInsideSet(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Vai trò (Role)</label>
                                  <input type="text" value={item.role || ''} onChange={e => { const l = [...landInsideSet]; l[idx] = { ...l[idx], role: e.target.value }; setLandInsideSet(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Mô tả ngắn</label>
                                  <textarea value={item.description || ''} onChange={e => { const l = [...landInsideSet]; l[idx] = { ...l[idx], description: e.target.value }; setLandInsideSet(l); }} rows={2} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Slot phương tiện (mediaSlot)</label>
                                  <input type="text" value={item.mediaSlot || ''} onChange={e => { const l = [...landInsideSet]; l[idx] = { ...l[idx], mediaSlot: e.target.value }; setLandInsideSet(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button type="button" onClick={() => setLandInsideSet([...landInsideSet, { name: '', size: '', role: '', description: '', mediaSlot: '' }])} className="w-full py-1.5 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-1">
                          <Plus className="h-3.5 w-3.5" />
                          Thêm sản phẩm
                        </button>
                      </div>
                    </details>
                    {/* 2.5. Who Needs Sheer Set Details (Only for Luminous Set) */}
                    {editingBlock.block_type === 'cosmetic-product-landing-luminous-set' && (
                      <details className="group border border-slate-200 rounded-xl overflow-hidden">
                        <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-700 select-none transition flex items-center justify-between">
                          <span>2.5. Who Needs Sheer Set (Đối tượng sử dụng)</span>
                          <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nhãn nhỏ (Eyebrow)</label>
                            <input type="text" value={landWhoNeedsEyebrow} onChange={e => setLandWhoNeedsEyebrow(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Slot hình ảnh (Media Slot)</label>
                            <input type="text" value={landWhoNeedsMediaSlot} onChange={e => setLandWhoNeedsMediaSlot(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white text-slate-500 font-mono" />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tiêu đề chính (Title)</label>
                            <input type="text" value={landWhoNeedsTitle} onChange={e => setLandWhoNeedsTitle(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white font-semibold" />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ghi chú (Note)</label>
                            <input type="text" value={landWhoNeedsNote} onChange={e => setLandWhoNeedsNote(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white italic" />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Đoạn văn mô tả (Description)</label>
                            <textarea value={landWhoNeedsDescription} onChange={e => setLandWhoNeedsDescription(e.target.value)} rows={3} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ghi chú trên ảnh (Image Caption)</label>
                            <input type="text" value={landWhoNeedsImageCaption} onChange={e => setLandWhoNeedsImageCaption(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                          </div>
                          
                          <div className="col-span-2 mt-2 pt-2 border-t border-slate-100">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Checklist (Items)</label>
                            <div className="space-y-3">
                              {landWhoNeedsItems.map((item: any, idx: number) => (
                                <div key={idx} className="p-2 border border-slate-200 rounded-lg bg-slate-50 flex items-start gap-2 relative">
                                  <div className="flex-1">
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Nội dung</label>
                                    <input type="text" value={item.text || ''} onChange={e => { const l = [...landWhoNeedsItems]; l[idx] = { ...l[idx], text: e.target.value }; setLandWhoNeedsItems(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white" />
                                  </div>
                                  <button type="button" onClick={() => setLandWhoNeedsItems(landWhoNeedsItems.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-600 mt-4">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                              <button type="button" onClick={() => setLandWhoNeedsItems([...landWhoNeedsItems, { text: '' }])} className="w-full py-1.5 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-1">
                                <Plus className="h-3.5 w-3.5" />
                                Thêm mục checklist
                              </button>
                            </div>
                          </div>
                        </div>
                      </details>
                    )}
                    {/* 2.75. Skin Barrier & MG3-Plus (Only for Luminous Set) */}
                    {editingBlock.block_type === 'cosmetic-product-landing-luminous-set' && (
                      <details className="group border border-slate-200 rounded-xl overflow-hidden">
                        <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-700 select-none transition flex items-center justify-between">
                          <span>2.75. Skin Barrier & MG3-Plus (Khoa học & Công nghệ)</span>
                          <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-2 gap-6">
                          
                          {/* Skin Barrier */}
                          <div className="col-span-2 md:col-span-1 space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                            <h4 className="text-[11px] font-bold text-[#050A5C] uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">Skin Barrier</h4>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Nhãn nhỏ (Eyebrow)</label>
                              <input type="text" value={landBarrierEyebrow} onChange={e => setLandBarrierEyebrow(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Slot hình ảnh (Media Slot)</label>
                              <input type="text" value={landBarrierMediaSlot} onChange={e => setLandBarrierMediaSlot(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white font-mono text-slate-500" />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Tiêu đề (Title)</label>
                              <input type="text" value={landBarrierTitle} onChange={e => setLandBarrierTitle(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white font-semibold" />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Mô tả (Description)</label>
                              <textarea value={landBarrierDescription} onChange={e => setLandBarrierDescription(e.target.value)} rows={4} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                            </div>
                          </div>

                          {/* MG3-Plus */}
                          <div className="col-span-2 md:col-span-1 space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                            <h4 className="text-[11px] font-bold text-[#050A5C] uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">MG3-Plus Method</h4>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Nhãn nhỏ (Eyebrow)</label>
                              <input type="text" value={landBarrierMg3Eyebrow} onChange={e => setLandBarrierMg3Eyebrow(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Slot hình ảnh (Media Slot)</label>
                              <input type="text" value={landBarrierMg3MediaSlot} onChange={e => setLandBarrierMg3MediaSlot(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white font-mono text-slate-500" />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Tiêu đề (Title)</label>
                              <input type="text" value={landBarrierMg3Title} onChange={e => setLandBarrierMg3Title(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white font-semibold" />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Mô tả (Description)</label>
                              <textarea value={landBarrierMg3Description} onChange={e => setLandBarrierMg3Description(e.target.value)} rows={4} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                            </div>
                          </div>
                        </div>
                      </details>
                    )}
                    {/* 2.85. Active Ingredients (Only for Luminous Set) */}
                    {editingBlock.block_type === 'cosmetic-product-landing-luminous-set' && (
                      <details className="group border border-slate-200 rounded-xl overflow-hidden">
                        <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-700 select-none transition flex items-center justify-between">
                          <span>2.85. Active Ingredients (Thành phần)</span>
                          <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-2 gap-6">
                          
                          {/* Header section */}
                          <div className="col-span-2 space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                            <h4 className="text-[11px] font-bold text-[#050A5C] uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">Thông tin chung</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2 md:col-span-1">
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Nhãn nhỏ (Eyebrow)</label>
                                <input type="text" value={landActiveIngredientsEyebrow} onChange={e => setLandActiveIngredientsEyebrow(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                              </div>
                              <div className="col-span-2 md:col-span-1">
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Slot hình ảnh (Media Slot)</label>
                                <input type="text" value={landActiveIngredientsMediaSlot} onChange={e => setLandActiveIngredientsMediaSlot(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white font-mono text-slate-500" />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Tiêu đề (Title)</label>
                                <input type="text" value={landActiveIngredientsTitle} onChange={e => setLandActiveIngredientsTitle(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white font-semibold" />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Mô tả (Description)</label>
                                <textarea value={landActiveIngredientsDescription} onChange={e => setLandActiveIngredientsDescription(e.target.value)} rows={3} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                              </div>
                            </div>
                          </div>

                          {/* Ingredients Repeater */}
                          <div className="col-span-2 space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                            <h4 className="text-[11px] font-bold text-[#050A5C] uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">Danh sách thành phần</h4>
                            <div className="space-y-4">
                              {landActiveIngredientsItems.map((item: any, idx: number) => (
                                <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-white flex items-start gap-3 relative">
                                  <div className="flex-1 grid grid-cols-2 gap-3">
                                    <div className="col-span-2 md:col-span-1">
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Tên thành phần (Name)</label>
                                      <input type="text" value={item.name || ''} onChange={e => { const l = [...landActiveIngredientsItems]; l[idx] = { ...l[idx], name: e.target.value }; setLandActiveIngredientsItems(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white font-semibold text-[#050A5C]" />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Phụ đề (Subtitle)</label>
                                      <input type="text" value={item.subtitle || ''} onChange={e => { const l = [...landActiveIngredientsItems]; l[idx] = { ...l[idx], subtitle: e.target.value }; setLandActiveIngredientsItems(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-yellow-700" />
                                    </div>
                                    <div className="col-span-2">
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Mô tả (Description)</label>
                                      <textarea value={item.description || ''} onChange={e => { const l = [...landActiveIngredientsItems]; l[idx] = { ...l[idx], description: e.target.value }; setLandActiveIngredientsItems(l); }} rows={2} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-600" />
                                    </div>
                                  </div>
                                  <button type="button" onClick={() => setLandActiveIngredientsItems(landActiveIngredientsItems.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-600 mt-4">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                              <button type="button" onClick={() => setLandActiveIngredientsItems([...landActiveIngredientsItems, { name: '', subtitle: '', description: '' }])} className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-1">
                                <Plus className="h-4 w-4" />
                                Thêm thành phần
                              </button>
                            </div>
                          </div>

                        </div>
                      </details>
                    )}

                    {/* 3. Recovery Logic Details */}
                    <details className="group border border-slate-200 rounded-xl overflow-hidden">
                      <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-700 select-none transition flex items-center justify-between">
                        <span>3. Recovery Logic (Nguyên lý phục hồi 5 bước)</span>
                        <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="p-4 border-t border-slate-200 bg-white space-y-4">
                        <div className="space-y-3">
                          {landRecoverySteps.map((item: any, idx: number) => (
                            <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-2.5">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                <span className="text-[10px] font-bold text-slate-400 font-mono">Bước #{idx + 1}</span>
                                <button type="button" onClick={() => setLandRecoverySteps(landRecoverySteps.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-600 transition">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Tên bước (ví dụ: 01. Prepare)</label>
                                  <input type="text" value={item.step || ''} onChange={e => { const l = [...landRecoverySteps]; l[idx] = { ...l[idx], step: e.target.value }; setLandRecoverySteps(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Tiêu đề bước</label>
                                  <input type="text" value={item.title || ''} onChange={e => { const l = [...landRecoverySteps]; l[idx] = { ...l[idx], title: e.target.value }; setLandRecoverySteps(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Mô tả chi tiết</label>
                                  <textarea value={item.description || ''} onChange={e => { const l = [...landRecoverySteps]; l[idx] = { ...l[idx], description: e.target.value }; setLandRecoverySteps(l); }} rows={2} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button type="button" onClick={() => setLandRecoverySteps([...landRecoverySteps, { step: '', title: '', description: '' }])} className="w-full py-1.5 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-1">
                          <Plus className="h-3.5 w-3.5" />
                          Thêm bước phục hồi
                        </button>
                      </div>
                    </details>

                    {/* 4. Active Technology Details */}
                    <details className="group border border-slate-200 rounded-xl overflow-hidden">
                      <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-700 select-none transition flex items-center justify-between">
                        <span>4. Active Technology (Công nghệ hoạt chất)</span>
                        <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="p-4 border-t border-slate-200 bg-white space-y-4">
                        <div className="space-y-3">
                          {landTechnologies.map((item: any, idx: number) => (
                            <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-2.5">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                <span className="text-[10px] font-bold text-slate-400 font-mono">Công nghệ #{idx + 1}</span>
                                <button type="button" onClick={() => setLandTechnologies(landTechnologies.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-600 transition">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Tên hoạt chất</label>
                                  <input type="text" value={item.name || ''} onChange={e => { const l = [...landTechnologies]; l[idx] = { ...l[idx], name: e.target.value }; setLandTechnologies(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Vai trò hoạt chất</label>
                                  <input type="text" value={item.role || ''} onChange={e => { const l = [...landTechnologies]; l[idx] = { ...l[idx], role: e.target.value }; setLandTechnologies(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Mô tả cách thức hoạt động</label>
                                  <textarea value={item.description || ''} onChange={e => { const l = [...landTechnologies]; l[idx] = { ...l[idx], description: e.target.value }; setLandTechnologies(l); }} rows={2} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Ứng dụng trong sản phẩm (foundIn)</label>
                                  <input type="text" value={item.foundIn || item.product || ''} onChange={e => { const l = [...landTechnologies]; l[idx] = { ...l[idx], foundIn: e.target.value }; setLandTechnologies(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button type="button" onClick={() => setLandTechnologies([...landTechnologies, { name: '', role: '', description: '', foundIn: '' }])} className="w-full py-1.5 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-1">
                          <Plus className="h-3.5 w-3.5" />
                          Thêm công nghệ hoạt chất
                        </button>
                      </div>
                    </details>

                    {/* 5. Who It's For Details */}
                    <details className="group border border-slate-200 rounded-xl overflow-hidden">
                      <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-700 select-none transition flex items-center justify-between">
                        <span>5. Who It's For (Đối tượng khuyên dùng)</span>
                        <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="p-4 border-t border-slate-200 bg-white space-y-4">
                        <div className="space-y-3">
                          {landWhoFor.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input type="text" value={item.text || ''} onChange={e => { const l = [...landWhoFor]; l[idx] = { ...l[idx], text: e.target.value }; setLandWhoFor(l); }} className="flex-1 text-xs p-2 border border-slate-300 rounded-md bg-white" placeholder="Ví dụ: Da sau trị liệu cần phục hồi" />
                              <button type="button" onClick={() => setLandWhoFor(landWhoFor.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-600 transition shrink-0 p-1">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button type="button" onClick={() => setLandWhoFor([...landWhoFor, { text: '' }])} className="w-full py-1.5 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-1">
                          <Plus className="h-3.5 w-3.5" />
                          Thêm đối tượng
                        </button>
                      </div>
                    </details>

                    {/* 6. How To Use Details */}
                    <details className="group border border-slate-200 rounded-xl overflow-hidden">
                      <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-700 select-none transition flex items-center justify-between">
                        <span>6. How To Use (Hướng dẫn sử dụng)</span>
                        <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="p-4 border-t border-slate-200 bg-white space-y-4">
                        <div className="space-y-3">
                          {landHowToUse.map((item: any, idx: number) => (
                            <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-2.5">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                <span className="text-[10px] font-bold text-slate-400 font-mono">Bước #{idx + 1}</span>
                                <button type="button" onClick={() => setLandHowToUse(landHowToUse.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-600 transition">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Số bước (ví dụ: 01)</label>
                                  <input type="text" value={item.step || ''} onChange={e => { const l = [...landHowToUse]; l[idx] = { ...l[idx], step: e.target.value }; setLandHowToUse(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Tên bước</label>
                                  <input type="text" value={item.title || ''} onChange={e => { const l = [...landHowToUse]; l[idx] = { ...l[idx], title: e.target.value }; setLandHowToUse(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Hướng dẫn chi tiết</label>
                                  <textarea value={item.description || ''} onChange={e => { const l = [...landHowToUse]; l[idx] = { ...l[idx], description: e.target.value }; setLandHowToUse(l); }} rows={2} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button type="button" onClick={() => setLandHowToUse([...landHowToUse, { step: '', title: '', description: '' }])} className="w-full py-1.5 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-1">
                          <Plus className="h-3.5 w-3.5" />
                          Thêm bước hướng dẫn
                        </button>
                      </div>
                    </details>

                    {/* 7. Spa Bridge Details */}
                    <details className="group border border-slate-200 rounded-xl overflow-hidden">
                      <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-700 select-none transition flex items-center justify-between">
                        <span>7. Spa Bridge (Kết nối Spa)</span>
                        <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tiêu đề (Spa Bridge Title)</label>
                          <input type="text" value={landSpaBridgeTitle} onChange={e => setLandSpaBridgeTitle(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mô tả (Spa Bridge Description)</label>
                          <textarea value={landSpaBridgeDescription} onChange={e => setLandSpaBridgeDescription(e.target.value)} rows={2} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nhãn nút Spa CTA</label>
                          <input type="text" value={landSpaBridgeCtaLabel} onChange={e => setLandSpaBridgeCtaLabel(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Liên kết nút Spa CTA</label>
                          <input type="text" value={landSpaBridgeCtaHref} onChange={e => setLandSpaBridgeCtaHref(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                        </div>
                      </div>
                    </details>

                    {/* 8. Product Information Details */}
                    <details className="group border border-slate-200 rounded-xl overflow-hidden">
                      <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-700 select-none transition flex items-center justify-between">
                        <span>8. Product Information (Thông số chi tiết)</span>
                        <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="p-4 border-t border-slate-200 bg-white space-y-4">
                        <div className="space-y-3">
                          {landProductInfo.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 bg-slate-55 p-2.5 rounded-lg border border-slate-200">
                              <div className="flex-1 grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Thuộc tính (Label)</label>
                                  <input type="text" value={item.label || ''} onChange={e => { const l = [...landProductInfo]; l[idx] = { ...l[idx], label: e.target.value }; setLandProductInfo(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white font-bold text-[#050A5C]" />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Giá trị (Value)</label>
                                  <input type="text" value={item.value || ''} onChange={e => { const l = [...landProductInfo]; l[idx] = { ...l[idx], value: e.target.value }; setLandProductInfo(l); }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white text-slate-700" />
                                </div>
                              </div>
                              <button type="button" onClick={() => setLandProductInfo(landProductInfo.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-600 transition shrink-0 p-1 mt-3">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button type="button" onClick={() => setLandProductInfo([...landProductInfo, { label: '', value: '' }])} className="w-full py-1.5 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-1">
                          <Plus className="h-3.5 w-3.5" />
                          Thêm thông số
                        </button>
                      </div>
                    </details>

                    {/* 9. Final CTA Details */}
                    <details className="group border border-slate-200 rounded-xl overflow-hidden">
                      <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-700 select-none transition flex items-center justify-between">
                        <span>9. Final CTA (Khung tư vấn cuối trang)</span>
                        <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tiêu đề (Final CTA Title)</label>
                          <input type="text" value={landFinalTitle} onChange={e => setLandFinalTitle(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mô tả phụ</label>
                          <textarea value={landFinalDescription} onChange={e => setLandFinalDescription(e.target.value)} rows={2} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nhãn nút tư vấn</label>
                          <input type="text" value={landFinalCtaLabel} onChange={e => setLandFinalCtaLabel(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Đường dẫn nút tư vấn</label>
                          <input type="text" value={landFinalCtaHref} onChange={e => setLandFinalCtaHref(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                        </div>
                      </div>
                    </details>
                  </div>
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

                {/* ── cosmetic-hero-product editor ── */}
                {editingBlock.block_type === 'cosmetic-hero-product' && (
                  <div className="col-span-2 space-y-6 border-t border-slate-100 pt-4 mt-2">
                    <p className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 leading-relaxed">
                      💡 <strong>Hướng dẫn:</strong> Section này giới thiệu bộ sản phẩm nổi bật Luminous Set trên trang /cosmetic.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Headline lớn (tiếng Việt)</label>
                        <input type="text" value={heroHeadline} onChange={e => setHeroHeadline(e.target.value)}
                          className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                          placeholder="Ví dụ: Chăm sóc chuyên sâu — củng cố hàng rào bảo vệ..." />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Media Slot ảnh chính</label>
                        <select value={heroMediaSlot} onChange={e => setHeroMediaSlot(e.target.value)}
                          className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white h-[34px]">
                          <option value="">-- chọn slot --</option>
                          {COSMETIC_PRODUCT_MEDIA_SLOTS.map(slot => <option key={slot.value} value={slot.value}>{slot.label}</option>)}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Thành phần nổi bật (ngăn cách bằng dấu phẩy)</label>
                        <input type="text" value={heroIngredients} onChange={e => setHeroIngredients(e.target.value)}
                          className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                          placeholder="Ví dụ: Exosome, Collagen, Peptide Complex" />
                      </div>
                    </div>

                    {/* Benefits Repeater */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center justify-between">
                        <span>Lợi ích chính (Benefits)</span>
                        <button type="button" onClick={() => setHeroBenefits([...heroBenefits, ''])} className="text-[10px] text-blue-600 font-bold hover:underline">+ Thêm lợi ích</button>
                      </h4>
                      <div className="space-y-2">
                        {heroBenefits.map((b, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input type="text" value={b} onChange={e => {
                              const l = [...heroBenefits];
                              l[idx] = e.target.value;
                              setHeroBenefits(l);
                            }} className="flex-1 text-xs p-1.5 border border-slate-300 rounded bg-white" placeholder="Mô tả lợi ích..." />
                            <button type="button" onClick={() => setHeroBenefits(heroBenefits.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Set Products Repeater */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center justify-between">
                        <span>Sản phẩm trong Set (Set Products)</span>
                        <button type="button" onClick={() => setHeroSetProducts([...heroSetProducts, { id: '', name: '', size: '', role: '', description: '', detailTitle: '', detailDescription: '', actives: [], benefits: [], usage: '', mediaSlot: '' }])} className="text-[10px] text-blue-600 font-bold hover:underline">+ Thêm sản phẩm</button>
                      </h4>

                      <p className="text-[10px] text-slate-500 italic bg-amber-50 border border-amber-200 rounded px-2.5 py-1.5 leading-relaxed">
                        ⚠️ <strong>Lưu ý:</strong> Ảnh trong phần này là ảnh mô tả riêng của từng sản phẩm trong set. Không dùng lại ảnh thumbnail sản phẩm cũ.
                      </p>

                      {/* Quick Upload Shortcuts */}
                      <div className="flex flex-wrap gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-xs">
                        <span className="font-bold text-slate-700 w-full mb-1 flex items-center gap-1">⚡ Phím tắt tải ảnh sản phẩm:</span>
                        <Link href="/media?purpose=cosmetic-page-media&slot=cosmetic-set-cellurevive-ampoule&returnTo=/cosmetic-page" className="bg-blue-600 text-white font-bold px-3 py-1 rounded hover:bg-blue-700 inline-flex items-center gap-1 shadow-sm">
                          <Upload className="h-3 w-3" />
                          <span>Upload ảnh CELLUREVIVE</span>
                        </Link>
                        <Link href="/media?purpose=cosmetic-page-media&slot=cosmetic-set-regenaglow-sheer-cream&returnTo=/cosmetic-page" className="bg-blue-600 text-white font-bold px-3 py-1 rounded hover:bg-blue-700 inline-flex items-center gap-1 shadow-sm">
                          <Upload className="h-3 w-3" />
                          <span>Upload ảnh REGENAGLOW</span>
                        </Link>
                      </div>

                      <div className="space-y-3">
                        {heroSetProducts.map((item, idx) => (
                          <div key={idx} className="p-3 border border-slate-200 rounded-lg space-y-2 bg-slate-50/50">
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                              <span>Sản phẩm #{idx + 1}</span>
                              <div className="flex items-center gap-1">
                                <button type="button" disabled={idx === 0}
                                  onClick={() => { const l = [...heroSetProducts]; [l[idx], l[idx - 1]] = [l[idx - 1], l[idx]]; setHeroSetProducts(l); }}
                                  className="p-1 text-slate-500 hover:text-blue-600 disabled:opacity-30" title="Di chuyển lên">
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button type="button" disabled={idx === heroSetProducts.length - 1}
                                  onClick={() => { const l = [...heroSetProducts]; [l[idx], l[idx + 1]] = [l[idx + 1], l[idx]]; setHeroSetProducts(l); }}
                                  className="p-1 text-slate-500 hover:text-blue-600 disabled:opacity-30" title="Di chuyển xuống">
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                                <button type="button" onClick={() => setHeroSetProducts(heroSetProducts.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700"><Trash2 className="h-3.5 w-3.5" /></button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Tên sản phẩm</label>
                                <input type="text" placeholder="Tên sản phẩm (ví dụ: CELLUREVIVE Ampoule)" value={item.name || ''} onChange={e => {
                                  const l = [...heroSetProducts];
                                  l[idx] = { ...l[idx], name: e.target.value };
                                  // Auto-generate id if empty
                                  if (!l[idx].id) {
                                    l[idx].id = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                  }
                                  setHeroSetProducts(l);
                                }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                              </div>
                              <div>
                                <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Dung tích / Quy cách</label>
                                <input type="text" placeholder="Kích thước (ví dụ: 7ml × 4ea)" value={item.size || ''} onChange={e => {
                                  const l = [...heroSetProducts];
                                  l[idx] = { ...l[idx], size: e.target.value };
                                  setHeroSetProducts(l);
                                }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Vai trò (Role)</label>
                                <input type="text" placeholder="Vai trò (ví dụ: Ampoule cô đặc)" value={item.role || ''} onChange={e => {
                                  const l = [...heroSetProducts];
                                  l[idx] = { ...l[idx], role: e.target.value };
                                  setHeroSetProducts(l);
                                }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Mô tả tóm tắt</label>
                                <textarea placeholder="Mô tả công dụng ngắn..." value={item.description || ''} onChange={e => {
                                  const l = [...heroSetProducts];
                                  l[idx] = { ...l[idx], description: e.target.value };
                                  setHeroSetProducts(l);
                                }} rows={1} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Mô tả chi tiết (Detail Description)</label>
                                <textarea placeholder="Giải thích chi tiết công dụng..." value={item.detailDescription || ''} onChange={e => {
                                  const l = [...heroSetProducts];
                                  l[idx] = { ...l[idx], detailDescription: e.target.value };
                                  // Auto-generate detailTitle if empty
                                  if (!l[idx].detailTitle) {
                                    l[idx].detailTitle = l[idx].role === 'Ampoule cô đặc' ? 'Tinh chất phục hồi chuyên sâu' : 'Kem dưỡng khóa ẩm và phục hồi hàng rào da';
                                  }
                                  setHeroSetProducts(l);
                                }} rows={2} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                              </div>
                              <div>
                                <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Hoạt chất chính (dấu phẩy)</label>
                                <input type="text" placeholder="Exosome, Peptide, Collagen" value={Array.isArray(item.actives) ? item.actives.join(', ') : (item.actives || '')} onChange={e => {
                                  const l = [...heroSetProducts];
                                  l[idx] = { ...l[idx], actives: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) };
                                  setHeroSetProducts(l);
                                }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                              </div>
                              <div>
                                <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Lợi ích chính (dấu phẩy)</label>
                                <input type="text" placeholder="Hỗ trợ phục hồi, Làm mềm da" value={Array.isArray(item.benefits) ? item.benefits.join(', ') : (item.benefits || '')} onChange={e => {
                                  const l = [...heroSetProducts];
                                  l[idx] = { ...l[idx], benefits: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) };
                                  setHeroSetProducts(l);
                                }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Cách sử dụng ngắn (Usage)</label>
                                <input type="text" placeholder="Ví dụ: Thoa sau bước toner..." value={item.usage || ''} onChange={e => {
                                  const l = [...heroSetProducts];
                                  l[idx] = { ...l[idx], usage: e.target.value };
                                  setHeroSetProducts(l);
                                }} className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Media Slot ảnh riêng</label>
                                <div className="flex items-center gap-2 mb-1.5">
                                  <select value={item.mediaSlot || ''} onChange={e => {
                                    const l = [...heroSetProducts];
                                    l[idx] = { ...l[idx], mediaSlot: e.target.value };
                                    setHeroSetProducts(l);
                                  }} className="flex-1 text-xs p-1.5 border border-slate-300 rounded bg-white h-[32px]">
                                    <option value="">-- chọn slot --</option>
                                    <option value="cosmetic-set-cellurevive-ampoule">Ảnh chi tiết CELLUREVIVE Ampoule trong set</option>
                                    <option value="cosmetic-set-regenaglow-sheer-cream">Ảnh chi tiết REGENAGLOW NOURISH SHEER CREAM trong set</option>
                                  </select>
                                  {(() => {
                                    if (!item.mediaSlot) return null;
                                    const hasImage = mediaAssets.some(m => m.metadata?.slot === item.mediaSlot && !m.metadata?.archivedFromSlot);
                                    return (
                                      <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                                          hasImage ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                                        }`}>
                                          {hasImage ? 'Đã có ảnh riêng' : 'Chưa có ảnh riêng'}
                                        </span>
                                        <Link 
                                          href={`/media?purpose=cosmetic-page-media&slot=${item.mediaSlot}&returnTo=/cosmetic-page`}
                                          className="text-[9px] bg-blue-600 text-white hover:bg-blue-700 font-bold px-2 py-1 rounded shadow-sm inline-flex items-center gap-1"
                                        >
                                          <Upload className="h-2.5 w-2.5" />
                                          <span>Upload</span>
                                        </Link>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
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

                {/* ── Active Ingredient Intelligence Map custom editor ── */}
                {editingBlock.block_type === 'cosmetic-ingredients' && (
                  <div className="col-span-2 space-y-6 border-t border-slate-100 pt-4 mt-2">
                    <p className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 leading-relaxed">
                      💡 <strong>Hướng dẫn:</strong> Bản đồ hoạt chất được cấu trúc dưới dạng danh sách hoạt chất tương tác (Ingredient Intelligence Map). Mỗi hoạt chất kết nối trực tiếp với sản phẩm, routine stage, và các chỉ định phục hồi da.
                    </p>

                    {/* Global Logic fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                      <div className="md:col-span-2">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                          Tiêu đề phần Logic công thức (Formula Logic Strip)
                        </h4>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Tiêu đề Logic</label>
                        <input
                          type="text"
                          value={ingLogicTitle}
                          onChange={e => setIngLogicTitle(e.target.value)}
                          className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Mô tả Logic</label>
                        <textarea
                          value={ingLogicDescription}
                          onChange={e => setIngLogicDescription(e.target.value)}
                          rows={2}
                          className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Repeater List */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                          Danh sách hoạt chất ({ingItems.length})
                        </h4>
                      </div>

                      <div className="space-y-4">
                        {ingItems.map((item, idx) => {
                          const isMissingIntelligence = !item.id || !item.category || !item.routineStage ||
                            !item.supports || (Array.isArray(item.supports) && item.supports.length === 0) ||
                            !item.bestFor || (Array.isArray(item.bestFor) && item.bestFor.length === 0) ||
                            !item.foundIn || (Array.isArray(item.foundIn) && item.foundIn.length === 0);

                          return (
                            <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/30 space-y-3 relative">
                              {/* Header row */}
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center">
                                  <span className="text-xs font-bold text-slate-400 font-mono">Hoạt chất #{idx + 1}</span>
                                  {isMissingIntelligence && (
                                    <span className="ml-2 text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 inline-flex items-center gap-1 shadow-sm">
                                      <AlertCircle className="h-2.5 w-2.5" />
                                      <span>Thiếu dữ liệu Intelligence</span>
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    const l = [...ingItems];
                                    const temp = l[idx];
                                    l[idx] = l[idx - 1];
                                    l[idx - 1] = temp;
                                    setIngItems(l);
                                  }}
                                  className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 transition"
                                  title="Di chuyển lên"
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === ingItems.length - 1}
                                  onClick={() => {
                                    const l = [...ingItems];
                                    const temp = l[idx];
                                    l[idx] = l[idx + 1];
                                    l[idx + 1] = temp;
                                    setIngItems(l);
                                  }}
                                  className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 transition"
                                  title="Di chuyển xuống"
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm('Xóa hoạt chất này?')) {
                                      setIngItems(ingItems.filter((_, i) => i !== idx));
                                    }
                                  }}
                                  className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                                  title="Xóa hoạt chất"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Item Inputs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mã hoạt chất (ID)</label>
                                <input
                                  type="text"
                                  value={item.id || ''}
                                  onChange={e => {
                                    const l = [...ingItems];
                                    l[idx] = { ...l[idx], id: e.target.value };
                                    setIngItems(l);
                                  }}
                                  className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                                  placeholder="Ví dụ: exosome, peptide"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tên hoạt chất</label>
                                <input
                                  type="text"
                                  value={item.name || ''}
                                  onChange={e => {
                                    const l = [...ingItems];
                                    l[idx] = { ...l[idx], name: e.target.value };
                                    setIngItems(l);
                                  }}
                                  className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                                  placeholder="Ví dụ: Exosome"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Phân loại (Category)</label>
                                <input
                                  type="text"
                                  value={item.category || ''}
                                  onChange={e => {
                                    const l = [...ingItems];
                                    l[idx] = { ...l[idx], category: e.target.value };
                                    setIngItems(l);
                                  }}
                                  className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                                  placeholder="Ví dụ: Renewal Signal"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Biểu tượng (Icon)</label>
                                <select
                                  value={item.icon || 'flask-conical'}
                                  onChange={e => {
                                    const l = [...ingItems];
                                    l[idx] = { ...l[idx], icon: e.target.value };
                                    setIngItems(l);
                                  }}
                                  className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white h-[34px]"
                                >
                                  {['atom', 'flask-conical', 'microscope', 'droplet', 'shield-check', 'sparkles', 'leaf', 'scan-heart', 'badge-check', 'sun', 'waves', 'gem'].map(iconName => (
                                    <option key={iconName} value={iconName}>{iconName}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Routine Stage</label>
                                <select
                                  value={item.routineStage || 'RECOVER'}
                                  onChange={e => {
                                    const l = [...ingItems];
                                    l[idx] = { ...l[idx], routineStage: e.target.value };
                                    setIngItems(l);
                                  }}
                                  className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white h-[34px]"
                                >
                                  {['PREPARE', 'TREAT', 'RECOVER', 'SEAL', 'PROTECT', 'PREPARE / SEAL'].map(stage => (
                                    <option key={stage} value={stage}>{stage}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Usage (Tần suất)</label>
                                <select
                                  value={item.usage || 'AM · PM'}
                                  onChange={e => {
                                    const l = [...ingItems];
                                    l[idx] = { ...l[idx], usage: e.target.value };
                                    setIngItems(l);
                                  }}
                                  className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white h-[34px]"
                                >
                                  {['AM', 'PM', 'AM · PM'].map(u => (
                                    <option key={u} value={u}>{u}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vai trò ngắn</label>
                                <input
                                  type="text"
                                  value={item.shortRole || ''}
                                  onChange={e => {
                                    const l = [...ingItems];
                                    l[idx] = { ...l[idx], shortRole: e.target.value };
                                    setIngItems(l);
                                  }}
                                  className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                                  placeholder="Ví dụ: Hỗ trợ vẻ ngoài mịn màng, rạng rỡ."
                                />
                              </div>
                              <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mô tả khoa học chi tiết</label>
                                <textarea
                                  value={item.description || ''}
                                  onChange={e => {
                                    const l = [...ingItems];
                                    l[idx] = { ...l[idx], description: e.target.value };
                                    setIngItems(l);
                                  }}
                                  rows={3}
                                  className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                                  placeholder="Nhập đoạn mô tả chuyên sâu về cơ chế hoạt động của hoạt chất..."
                                />
                              </div>
                              <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Key Support Claims (Ngăn cách bằng dấu phẩy)</label>
                                <input
                                  type="text"
                                  value={Array.isArray(item.supports) ? item.supports.join(', ') : item.supports || ''}
                                  onChange={e => {
                                    const l = [...ingItems];
                                    l[idx] = { ...l[idx], supports: e.target.value.split(',').map(s => s.trim()).filter(Boolean) };
                                    setIngItems(l);
                                  }}
                                  className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                                  placeholder="Ví dụ: Radiance support, Texture refinement"
                                />
                              </div>
                              <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Recommended For (Ngăn cách bằng dấu phẩy)</label>
                                <input
                                  type="text"
                                  value={Array.isArray(item.bestFor) ? item.bestFor.join(', ') : item.bestFor || ''}
                                  onChange={e => {
                                    const l = [...ingItems];
                                    l[idx] = { ...l[idx], bestFor: e.target.value.split(',').map(s => s.trim()).filter(Boolean) };
                                    setIngItems(l);
                                  }}
                                  className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                                  placeholder="Ví dụ: Da xỉn màu, Da nhạy cảm"
                                />
                              </div>
                              <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Có trong sản phẩm (Ngăn cách bằng dấu phẩy)</label>
                                <input
                                  type="text"
                                  value={Array.isArray(item.foundIn) ? item.foundIn.join(', ') : item.foundIn || ''}
                                  onChange={e => {
                                    const l = [...ingItems];
                                    l[idx] = { ...l[idx], foundIn: e.target.value.split(',').map(s => s.trim()).filter(Boolean) };
                                    setIngItems(l);
                                  }}
                                  className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                                  placeholder="Ví dụ: Gentle Activation Renew Ampoule, CELLUREVIVE Ampoule"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      </div>

                      <button
                        type="button"
                        onClick={() => setIngItems([...ingItems, { id: '', name: '', category: 'Clinical Support', icon: 'flask-conical', routineStage: 'RECOVER', usage: 'AM · PM', shortRole: '', description: '', supports: [], bestFor: [], foundIn: [] }])}
                        className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline mt-1 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Thêm hoạt chất mới</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Premium Program / Spa Bridge custom editor ── */}
                {editingBlock.block_type === 'cosmetic-premium-program' && (
                  <div className="col-span-2 space-y-6 border-t border-slate-100 pt-4 mt-2">
                    <p className="text-[11px] text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 leading-relaxed">
                      💡 <strong>Hướng dẫn:</strong> Section này dùng để kết nối VAVAW Cosmetic với trải nghiệm chăm sóc tại VAVAW Beauty & Co. Nên dùng video spa dọc hoặc ảnh spa/clinic có sản phẩm VAVAW xuất hiện tự nhiên.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dòng tiêu đề phụ (Headline)</label>
                        <input
                          type="text"
                          value={premHeadline}
                          onChange={e => setPremHeadline(e.target.value)}
                          className="w-full text-sm p-2 border border-slate-300 rounded-md bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Ví dụ: Sản phẩm VAVAW được ứng dụng trong trải nghiệm chăm sóc phục hồi chuyên sâu tại spa."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Media Slot (Chọn video hoặc ảnh)</label>
                        <select
                          value={premMediaSlot}
                          onChange={e => setPremMediaSlot(e.target.value)}
                          className="w-full text-sm p-2 border border-slate-300 rounded-md bg-white h-[38px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="cosmetic-premium-program-spa-video">cosmetic-premium-program-spa-video (Video trải nghiệm tại spa / clinic)</option>
                          <option value="cosmetic-premium-program">cosmetic-premium-program (Ảnh Premium Program / Spa Clinic)</option>
                        </select>
                      </div>

                      <div className="hidden md:block" />

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nhãn nút phụ (Secondary CTA Label)</label>
                        <input
                          type="text"
                          value={premSecondaryCtaLabel}
                          onChange={e => setPremSecondaryCtaLabel(e.target.value)}
                          className="w-full text-sm p-2 border border-slate-300 rounded-md bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Ví dụ: Nhận tư vấn sản phẩm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Đường dẫn nút phụ (Secondary CTA Link)</label>
                        <input
                          type="text"
                          value={premSecondaryCtaHref}
                          onChange={e => setPremSecondaryCtaHref(e.target.value)}
                          className="w-full text-sm p-2 border border-slate-300 rounded-md bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Ví dụ: /contact?type=cosmetic_interest&source=premium_program"
                        />
                      </div>
                    </div>

                    {/* Pillars repeater */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                        Các cột trụ chương trình (Program Pillars)
                      </h4>

                      <div className="space-y-4">
                        {premPillars.map((pillar, idx) => (
                          <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/30 space-y-3 relative">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <span className="text-xs font-bold text-slate-400 font-mono">Trụ cột #{idx + 1}</span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    const l = [...premPillars];
                                    const temp = l[idx];
                                    l[idx] = l[idx - 1];
                                    l[idx - 1] = temp;
                                    setPremPillars(l);
                                  }}
                                  className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 transition"
                                  title="Di chuyển lên"
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === premPillars.length - 1}
                                  onClick={() => {
                                    const l = [...premPillars];
                                    const temp = l[idx];
                                    l[idx] = l[idx + 1];
                                    l[idx + 1] = temp;
                                    setPremPillars(l);
                                  }}
                                  className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 transition"
                                  title="Di chuyển xuống"
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm('Xóa trụ cột này?')) {
                                      setPremPillars(premPillars.filter((_, i) => i !== idx));
                                    }
                                  }}
                                  className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                                  title="Xóa trụ cột"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tiêu đề</label>
                                <input
                                  type="text"
                                  value={pillar.title || pillar.icon || ''}
                                  onChange={e => {
                                    const l = [...premPillars];
                                    l[idx] = { ...l[idx], title: e.target.value };
                                    setPremPillars(l);
                                  }}
                                  className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                                  placeholder="Ví dụ: Spa-use recovery ritual"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mô tả ngắn</label>
                                <textarea
                                  value={pillar.description || pillar.text || ''}
                                  onChange={e => {
                                    const l = [...premPillars];
                                    l[idx] = { ...l[idx], description: e.target.value };
                                    setPremPillars(l);
                                  }}
                                  rows={2}
                                  className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                                  placeholder="Ví dụ: Ứng dụng sản phẩm trong quy trình chăm sóc phục hồi tại spa."
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setPremPillars([...premPillars, { title: '', description: '' }])}
                        className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline mt-1 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Thêm trụ cột mới</span>
                      </button>
                    </div>
                  </div>
                )}

                {editingBlock.block_type === 'cosmetic-final-cta' && (
                  <div className="col-span-2 space-y-6 border-t border-slate-100 pt-4 mt-2">
                    <p className="text-[11px] text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 leading-relaxed">
                      💡 <strong>Hướng dẫn:</strong> Section này dùng để hiển thị CTA cuối trang (ngay trên footer). CTA này nên ngắn gọn, tập trung vào chuyển đổi.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nhãn nút phụ (Secondary CTA Label)</label>
                        <input
                          type="text"
                          value={finalSecondaryCtaLabel}
                          onChange={e => setFinalSecondaryCtaLabel(e.target.value)}
                          className="w-full text-sm p-2 border border-slate-300 rounded-md bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Ví dụ: Trải nghiệm tại VAVAW Beauty & Co"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Đường dẫn nút phụ (Secondary CTA Link)</label>
                        <input
                          type="text"
                          value={finalSecondaryCtaHref}
                          onChange={e => setFinalSecondaryCtaHref(e.target.value)}
                          className="w-full text-sm p-2 border border-slate-300 rounded-md bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Ví dụ: /go/beauty"
                        />
                      </div>
                    </div>

                    {/* Trust points list repeater */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                        Điểm uy tín (Trust Points)
                      </h4>

                      <div className="space-y-2">
                        {finalTrustPoints.map((point, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={point}
                              onChange={e => {
                                const l = [...finalTrustPoints];
                                l[idx] = e.target.value;
                                setFinalTrustPoints(l);
                              }}
                              className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                              placeholder={`Điểm uy tín #${idx + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => setFinalTrustPoints(finalTrustPoints.filter((_, i) => i !== idx))}
                              className="p-2 text-slate-400 hover:text-red-600 rounded transition shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setFinalTrustPoints([...finalTrustPoints, ''])}
                        className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline mt-1 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Thêm điểm uy tín mới</span>
                      </button>
                    </div>
                  </div>
                )}

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
                <h3 className="text-base font-bold text-slate-900">Chọn {isPickerVideoSlot ? 'video' : 'ảnh'} từ thư viện cho slot</h3>
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
              {libraryAssets.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                  Không tìm thấy {isPickerVideoSlot ? 'video' : 'ảnh'} nào trong thư viện Media Assets.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {libraryAssets.slice(0, 50).map(asset => (
                    <div key={asset.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-blue-500 transition-colors">
                      <div className="relative aspect-video sm:aspect-square bg-slate-50 flex items-center justify-center">
                        {isPickerVideoSlot ? (
                          <Video className="h-8 w-8 text-slate-400" />
                        ) : (
                          <img src={asset.url} alt={asset.alt_text || ''} className="w-full h-full object-cover" />
                        )}
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
                          {isSaving ? 'Đang chọn...' : (isPickerVideoSlot ? 'Chọn video' : 'Chọn ảnh')}
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
