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
  const [landHeroMediaDesktop, setLandHeroMediaDesktop] = useState('');
  const [landHeroMediaMobile, setLandHeroMediaMobile] = useState('');
  const [landSecondaryCtaLabel, setLandSecondaryCtaLabel] = useState('');
  const [landSecondaryCtaHref, setLandSecondaryCtaHref] = useState('');
  
  // Anti-Gravity Solution states
  const [landAntiGravityEyebrow, setLandAntiGravityEyebrow] = useState('');
  const [landAntiGravityTitle, setLandAntiGravityTitle] = useState('');
  const [landAntiGravityHeadline, setLandAntiGravityHeadline] = useState('');
  const [landAntiGravityShowHeadline, setLandAntiGravityShowHeadline] = useState(true);
  const [landAntiGravityDescription, setLandAntiGravityDescription] = useState('');
  const [landAntiGravityShowDescription, setLandAntiGravityShowDescription] = useState(true);
  const [landAntiGravityMediaSlot, setLandAntiGravityMediaSlot] = useState('');
  const [landAntiGravityDesktopMediaSlot, setLandAntiGravityDesktopMediaSlot] = useState("cosmetic-luminous-anti-gravity-desktop");
  const [landAntiGravityMobileMediaSlot, setLandAntiGravityMobileMediaSlot] = useState("cosmetic-luminous-anti-gravity-mobile");
  const [landAntiGravityDesktopImageMode, setLandAntiGravityDesktopImageMode] = useState("cover");
  const [landAntiGravityDesktopObjectPosition, setLandAntiGravityDesktopObjectPosition] = useState("center center");
  const [landAntiGravityMobileObjectPosition, setLandAntiGravityMobileObjectPosition] = useState("center top");
  const [landAntiGravityCaption, setLandAntiGravityCaption] = useState('');
  const [landAntiGravityCallouts, setLandAntiGravityCallouts] = useState<any[]>([]);

  // Who Needs Sheer Set states
  const [landWhoNeedsEyebrow, setLandWhoNeedsEyebrow] = useState('');
  const [landWhoNeedsTitle, setLandWhoNeedsTitle] = useState('');
  const [landWhoNeedsNote, setLandWhoNeedsNote] = useState('');
  const [landWhoNeedsShowNote, setLandWhoNeedsShowNote] = useState(true);
  const [landWhoNeedsDescription, setLandWhoNeedsDescription] = useState('');
  const [landWhoNeedsShowDescription, setLandWhoNeedsShowDescription] = useState(true);
  const [landWhoNeedsMediaSlot, setLandWhoNeedsMediaSlot] = useState('');
  const [landWhoNeedsDesktopMediaSlot, setLandWhoNeedsDesktopMediaSlot] = useState('');
  const [landWhoNeedsMobileMediaSlot, setLandWhoNeedsMobileMediaSlot] = useState('');
  const [landWhoNeedsDesktopImageMode, setLandWhoNeedsDesktopImageMode] = useState('cover');
  const [landWhoNeedsDesktopObjectPosition, setLandWhoNeedsDesktopObjectPosition] = useState('center center');
  const [landWhoNeedsMobileObjectPosition, setLandWhoNeedsMobileObjectPosition] = useState('center top');
  const [landWhoNeedsImageCaption, setLandWhoNeedsImageCaption] = useState('');
  const [landWhoNeedsShowImageCaption, setLandWhoNeedsShowImageCaption] = useState(true);
  const [landWhoNeedsItems, setLandWhoNeedsItems] = useState<any[]>([]);

  // Skin Barrier & MG3-Plus states
  const [landBarrierEyebrow, setLandBarrierEyebrow] = useState('');
  const [landBarrierTitle, setLandBarrierTitle] = useState('');
  const [landBarrierShowTitle, setLandBarrierShowTitle] = useState(true);
  const [landBarrierDescription, setLandBarrierDescription] = useState('');
  const [landBarrierShowDescription, setLandBarrierShowDescription] = useState(true);
  const [landBarrierMediaSlot, setLandBarrierMediaSlot] = useState('');
  const [landBarrierDesktopMediaSlot, setLandBarrierDesktopMediaSlot] = useState('');
  const [landBarrierMobileMediaSlot, setLandBarrierMobileMediaSlot] = useState('');
  const [landBarrierDesktopImageMode, setLandBarrierDesktopImageMode] = useState('cover');
  const [landBarrierDesktopObjectPosition, setLandBarrierDesktopObjectPosition] = useState('center center');
  const [landBarrierMobileObjectPosition, setLandBarrierMobileObjectPosition] = useState('center top');
  const [landSkinBarrierMediaRenderType, setLandSkinBarrierMediaRenderType] = useState('full-bleed-artwork');

  const [landBarrierMg3Eyebrow, setLandBarrierMg3Eyebrow] = useState('');
  const [landBarrierMg3Title, setLandBarrierMg3Title] = useState('');
  const [landBarrierMg3ShowTitle, setLandBarrierMg3ShowTitle] = useState(true);
  const [landBarrierMg3Description, setLandBarrierMg3Description] = useState('');
  const [landBarrierMg3ShowDescription, setLandBarrierMg3ShowDescription] = useState(true);
  const [landBarrierMg3MediaSlot, setLandBarrierMg3MediaSlot] = useState('');
  const [landBarrierMg3DesktopMediaSlot, setLandBarrierMg3DesktopMediaSlot] = useState('');
  const [landBarrierMg3MobileMediaSlot, setLandBarrierMg3MobileMediaSlot] = useState('');
  const [landBarrierMg3DesktopImageMode, setLandBarrierMg3DesktopImageMode] = useState('cover');
  const [landBarrierMg3DesktopObjectPosition, setLandBarrierMg3DesktopObjectPosition] = useState('center center');
  const [landBarrierMg3MobileObjectPosition, setLandBarrierMg3MobileObjectPosition] = useState('center top');
  const [landMg3PlusMediaRenderType, setLandMg3PlusMediaRenderType] = useState('full-bleed-artwork');

  // Active Ingredients (Block 5) states
  const [landAiEyebrow, setLandAiEyebrow] = useState('');
  const [landAiTitle, setLandAiTitle] = useState('');
  const [landAiDescription, setLandAiDescription] = useState('');
  const [landAiCaption, setLandAiCaption] = useState('');
  const [landAiShowDescription, setLandAiShowDescription] = useState(true);
  const [landAiShowCaption, setLandAiShowCaption] = useState(true);
  const [landAiMediaRenderType, setLandAiMediaRenderType] = useState('full-bleed-artwork');
  const [landAiDesktopImageMode, setLandAiDesktopImageMode] = useState('cover');
  const [landAiMobileImageMode, setLandAiMobileImageMode] = useState('cover');
  const [landAiDesktopObjectPosition, setLandAiDesktopObjectPosition] = useState('center center');
  const [landAiMobileObjectPosition, setLandAiMobileObjectPosition] = useState('center top');
  const [landAiEnableMotion, setLandAiEnableMotion] = useState(true);
  const [landAiMotionStyle, setLandAiMotionStyle] = useState('elegant-science');
  const [landAiAutoRotate, setLandAiAutoRotate] = useState(true);
  const [landAiShowIcons, setLandAiShowIcons] = useState(true);
  const [landAiHighlightActive, setLandAiHighlightActive] = useState(true);
  const DEFAULT_AI_ITEMS = [
    { name: 'Exosome', englishName: 'Exosome Technology', role: 'Tín hiệu tế bào', description: 'Truyền tín hiệu sinh học giúp tế bào da nhận ra và phản ứng với quá trình tái tạo.', benefit: 'Phục hồi tế bào', highlight: true },
    { name: 'Peptide Complex', englishName: 'Multi-Peptide Complex', role: 'Nâng đỡ cấu trúc', description: 'Kích hoạt tổng hợp collagen và elastin, cải thiện độ săn chắc từ nền tảng.', benefit: 'Săn chắc da', highlight: true },
    { name: 'Mg3+', englishName: 'Magnesium Ion Complex', role: 'Dẫn truyền hoạt chất', description: 'Phức hợp ion Magie giúp mở kênh thẩm thấu, đưa dưỡng chất vào sâu hơn.', benefit: 'Thẩm thấu sâu', highlight: true },
    { name: 'Centella Asiatica', englishName: 'Cica Extract', role: 'Làm dịu & phục hồi', description: 'Chiết xuất rau má giúp giảm viêm, dịu kích ứng và hỗ trợ liền da nhanh.', benefit: 'Làm dịu da', highlight: false },
    { name: 'Hyaluronic Acid', englishName: 'Sodium Hyaluronate', role: 'Cấp ẩm đa tầng', description: 'Phân tử HA đa kích thước cấp ẩm từ bề mặt đến các lớp biểu bì sâu.', benefit: 'Cấp ẩm sâu', highlight: false },
  ];
  const [landAiItems, setLandAiItems] = useState<any[]>(DEFAULT_AI_ITEMS);

  // Usage Guide states (Block 6)
  const [landUsageEyebrow, setLandUsageEyebrow] = useState('');
  const [landUsageTitle, setLandUsageTitle] = useState('');
  const [landUsageDescription, setLandUsageDescription] = useState('');
  const [landUsageNote, setLandUsageNote] = useState('');
  const [landUsageCaption, setLandUsageCaption] = useState('');
  const [landUsageShowDescription, setLandUsageShowDescription] = useState(true);
  const [landUsageShowNote, setLandUsageShowNote] = useState(true);
  const [landUsageShowCaption, setLandUsageShowCaption] = useState(true);
  const [landUsageMediaRenderType, setLandUsageMediaRenderType] = useState('full-bleed-artwork');
  const [landUsageDesktopImageMode, setLandUsageDesktopImageMode] = useState('cover');
  const [landUsageMobileImageMode, setLandUsageMobileImageMode] = useState('cover');
  const [landUsageDesktopObjectPosition, setLandUsageDesktopObjectPosition] = useState('center center');
  const [landUsageMobileObjectPosition, setLandUsageMobileObjectPosition] = useState('center top');
  const DEFAULT_USAGE_STEPS = [
    { step: 'Step 1', title: 'Prepare', description: 'Apply P30 Toner to balance skin pH.', product: 'P30 Toner', timing: 'Morning/Evening', highlight: false },
    { step: 'Step 2', title: 'Activate', description: 'Apply Renew Ampoule.', product: 'Renew Ampoule', timing: 'Morning/Evening', highlight: true },
    { step: 'Step 3', title: 'Repair', description: 'Apply Calmiance Gel.', product: 'Calmiance Gel', timing: 'Morning/Evening', highlight: false },
    { step: 'Step 4', title: 'Nourish', description: 'Apply Regenaglow Cream.', product: 'Regenaglow Cream', timing: 'Morning/Evening', highlight: true },
    { step: 'Step 5', title: 'Protect', description: 'Apply Lumiglow Sunscreen.', product: 'Lumiglow Sunscreen', timing: 'Morning', highlight: false },
  ];
  const [landUsageSteps, setLandUsageSteps] = useState<any[]>(DEFAULT_USAGE_STEPS);

  // Product Detail Form states
  const [landProductDetailFormEyebrow, setLandProductDetailFormEyebrow] = useState('');
  const [landProductDetailFormTitle, setLandProductDetailFormTitle] = useState('');
  const [landProductDetailFormDescription, setLandProductDetailFormDescription] = useState('');
  const [landProductDetailFormOfflineTitle, setLandProductDetailFormOfflineTitle] = useState('');
  const [landProductDetailFormOfflineDescription, setLandProductDetailFormOfflineDescription] = useState('');
  const [landProductDetailFormOfflineMediaSlot, setLandProductDetailFormOfflineMediaSlot] = useState('');
  const [landDetailOfflineShow, setLandDetailOfflineShow] = useState(true);
  const [landDetailOfflineDesktopImageMode, setLandDetailOfflineDesktopImageMode] = useState('cover');
  const [landDetailOfflineMobileImageMode, setLandDetailOfflineMobileImageMode] = useState('cover');
  const [landDetailOfflineDesktopObjectPosition, setLandDetailOfflineDesktopObjectPosition] = useState('center center');
  const [landDetailOfflineMobileObjectPosition, setLandDetailOfflineMobileObjectPosition] = useState('center center');
  const [landDetailOfflineTextAlign, setLandDetailOfflineTextAlign] = useState('left');
  const [landDetailOfflineOverlayStrength, setLandDetailOfflineOverlayStrength] = useState('medium');
  const [landProductDetailFormInfo, setLandProductDetailFormInfo] = useState<any[]>([]);
  const [landProductDetailFormIngredientGroups, setLandProductDetailFormIngredientGroups] = useState<any[]>([]);
  const [landProductDetailFormCautions, setLandProductDetailFormCautions] = useState<string[]>([]);
  const [landProductDetailFormStorage, setLandProductDetailFormStorage] = useState('');
  const [landProductDetailFormQualityGuarantee, setLandProductDetailFormQualityGuarantee] = useState('');

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
      let fallbackSlot = content.heroMediaSlot || 'cosmetic-product-luminous-set';
      if (fallbackSlot === 'cosmetic-set-regenaglow-sheer-cream') {
        fallbackSlot = 'cosmetic-product-luminous-set';
      }
      setLandHeroMediaSlot(fallbackSlot);
      setLandHeroMediaDesktop(content.heroDesktopMediaSlot || content.heroMediaDesktop || '');
      setLandHeroMediaMobile(content.heroMobileMediaSlot || content.heroMediaMobile || '');
      setLandSecondaryCtaLabel(content.secondaryCtaLabel || '');
      setLandSecondaryCtaHref(content.secondaryCtaHref || '');
      
      const antiGravity = content.antiGravity || {};
      setLandAntiGravityEyebrow(antiGravity.eyebrow || 'ANTI-GRAVITY SOLUTION');
      setLandAntiGravityTitle(antiGravity.title || 'Phục hồi cấu trúc da từ nền tảng hàng rào bảo vệ');
      setLandAntiGravityHeadline(antiGravity.headline || 'Tập trung cải thiện cảm giác săn chắc, ẩm mượt và độ rạng rỡ');
      setLandAntiGravityShowHeadline(antiGravity.showHeadline ?? true);
      setLandAntiGravityDescription(antiGravity.description || 'Công thức tập trung vào phục hồi bề mặt da, hỗ trợ cấp ẩm và truyền tải các hoạt chất quan trọng cho làn da đang cần chăm sóc chuyên sâu.');
      setLandAntiGravityShowDescription(antiGravity.showDescription ?? true);
      setLandAntiGravityMediaSlot(antiGravity.mediaSlot || 'cosmetic-luminous-anti-gravity-image');
      setLandAntiGravityDesktopMediaSlot(antiGravity.desktopMediaSlot || 'cosmetic-luminous-anti-gravity-desktop');
      setLandAntiGravityMobileMediaSlot(antiGravity.mobileMediaSlot || 'cosmetic-luminous-anti-gravity-mobile');
      setLandAntiGravityDesktopImageMode(antiGravity.desktopImageMode || 'cover');
      setLandAntiGravityDesktopObjectPosition(antiGravity.desktopObjectPosition || 'center center');
      setLandAntiGravityMobileObjectPosition(antiGravity.mobileObjectPosition || 'center top');
      setLandAntiGravityCaption(antiGravity.caption || 'Focused recovery care for barrier, hydration and radiance.');
      
      const defaultCallouts = [
        { label: 'Collagen Water', value: 'Hỗ trợ cấp ẩm', x: 18, y: 42, align: 'left' },
        { label: 'Exosome', value: 'Hỗ trợ chăm sóc sau treatment', x: 14, y: 60, align: 'left' },
        { label: 'Peptide Complex', value: 'Hỗ trợ hàng rào bảo vệ', x: 22, y: 76, align: 'left' },
        { label: 'Complex Berry Extracts', value: 'Hỗ trợ vẻ rạng rỡ', x: 58, y: 76, align: 'center' }
      ];
      setLandAntiGravityCallouts(antiGravity.callouts && antiGravity.callouts.length ? antiGravity.callouts : defaultCallouts);

      const whoNeedsSet = content.whoNeedsSheerSet || content.whoNeedsSet || {};
      setLandWhoNeedsEyebrow(whoNeedsSet.eyebrow || 'LÀN DA NÀO CẦN');
      setLandWhoNeedsTitle(whoNeedsSet.title || 'Luminous Revitalization Sheer Set?');
      setLandWhoNeedsNote(whoNeedsSet.note || 'Lý tưởng cho da mỏng yếu, nhạy cảm hoặc đang trong quá trình phục hồi sau các liệu trình công nghệ cao.');
      setLandWhoNeedsShowNote(whoNeedsSet.showNote ?? true);
      setLandWhoNeedsDescription(whoNeedsSet.description || 'Bộ sản phẩm không chứa các thành phần dễ gây kích ứng, tối ưu hóa khả năng thẩm thấu qua các lớp biểu bì. Khi được sử dụng theo quy trình chuẩn, các dưỡng chất từ phức hợp Cellurevive và Mg3+ sẽ tạo ra môi trường lý tưởng để tế bào da tự sửa chữa và tái tạo, trả lại bề mặt da căng mướt và sáng khỏe.');
      setLandWhoNeedsShowDescription(whoNeedsSet.showDescription ?? true);
      setLandWhoNeedsMediaSlot(whoNeedsSet.mediaSlot || 'cosmetic-luminous-who-for-image');
      setLandWhoNeedsDesktopMediaSlot(whoNeedsSet.desktopMediaSlot || 'cosmetic-luminous-who-for-desktop');
      setLandWhoNeedsMobileMediaSlot(whoNeedsSet.mobileMediaSlot || 'cosmetic-luminous-who-for-mobile');
      setLandWhoNeedsDesktopImageMode(whoNeedsSet.desktopImageMode || 'cover');
      setLandWhoNeedsDesktopObjectPosition(whoNeedsSet.desktopObjectPosition || 'center center');
      setLandWhoNeedsMobileObjectPosition(whoNeedsSet.mobileObjectPosition || 'center top');
      setLandWhoNeedsImageCaption(whoNeedsSet.imageCaption || 'Ảnh: Người dùng sau 4 tuần trải nghiệm Luminous Revitalization Sheer Set.');
      setLandWhoNeedsShowImageCaption(whoNeedsSet.showImageCaption ?? true);
      setLandWhoNeedsItems(whoNeedsSet.items || [
        { text: 'Da mỏng yếu, tổn thương', description: 'Hàng rào bảo vệ suy giảm, dễ kích ứng với các sản phẩm thông thường.' },
        { text: 'Da sau xâm lấn, treatment', description: 'Cần một quy trình phục hồi an toàn, chuyên sâu, không bào mòn.' },
        { text: 'Da khô ráp, thiếu ẩm', description: 'Bề mặt da sần sùi, mất nước qua biểu bì (TEWL) cao.' }
      ]);

      const barrierData = content.skinBarrierMg3Plus || content.barrierScience || {};
      const skinBarrier = barrierData.skinBarrier || barrierData;
      const mg3Plus = barrierData.mg3Plus || barrierData;

      setLandBarrierEyebrow(skinBarrier.eyebrow || '');
      setLandBarrierTitle(skinBarrier.title || 'Khoa học về Hàng rào bảo vệ da');
      setLandBarrierShowTitle(skinBarrier.showTitle ?? true);
      setLandBarrierDescription(skinBarrier.description || 'Luminous Sheer Set áp dụng cơ chế tự sửa chữa tự nhiên của làn da...');
      setLandBarrierShowDescription(skinBarrier.showDescription ?? true);
      setLandBarrierMediaSlot(skinBarrier.mediaSlot || 'cosmetic-luminous-skin-barrier-image');
      setLandBarrierDesktopMediaSlot(skinBarrier.desktopMediaSlot || 'cosmetic-luminous-skin-barrier-desktop');
      setLandBarrierMobileMediaSlot(skinBarrier.mobileMediaSlot || 'cosmetic-luminous-skin-barrier-mobile');
      setLandBarrierDesktopImageMode(skinBarrier.desktopImageMode || 'cover');
      setLandBarrierDesktopObjectPosition(skinBarrier.desktopObjectPosition || 'center center');
      setLandBarrierMobileObjectPosition(skinBarrier.mobileObjectPosition || 'center top');
      setLandSkinBarrierMediaRenderType(skinBarrier.mediaRenderType || 'diagram');

      setLandBarrierMg3Eyebrow(mg3Plus.mg3Eyebrow || mg3Plus.eyebrow || '');
      setLandBarrierMg3Title(mg3Plus.mg3Title || mg3Plus.title || 'Phương pháp phục hồi đa tầng');
      setLandBarrierMg3ShowTitle(mg3Plus.showTitle ?? true);
      setLandBarrierMg3Description(mg3Plus.mg3Description || mg3Plus.description || 'Cơ chế MG3+ độc quyền giúp dẫn truyền dưỡng chất sâu hơn...');
      setLandBarrierMg3ShowDescription(mg3Plus.showDescription ?? true);
      setLandBarrierMg3MediaSlot(mg3Plus.mg3MediaSlot || mg3Plus.mediaSlot || 'cosmetic-luminous-mg3-plus-image');
      setLandBarrierMg3DesktopMediaSlot(mg3Plus.desktopMediaSlot || 'cosmetic-luminous-mg3-plus-desktop');
      setLandBarrierMg3MobileMediaSlot(mg3Plus.mobileMediaSlot || 'cosmetic-luminous-mg3-plus-mobile');
      setLandBarrierMg3DesktopImageMode(mg3Plus.desktopImageMode || 'cover');
      setLandBarrierMg3DesktopObjectPosition(mg3Plus.desktopObjectPosition || 'center center');
      setLandBarrierMg3MobileObjectPosition(mg3Plus.mobileObjectPosition || 'center top');
      setLandMg3PlusMediaRenderType(mg3Plus.mediaRenderType || 'diagram');

      const aiMap = content.activeIngredientsMap || content.activeIngredients || {};
      setLandAiEyebrow(aiMap.eyebrow || '');
      setLandAiTitle(aiMap.title || '');
      setLandAiDescription(aiMap.description || '');
      setLandAiCaption(aiMap.caption || '');
      setLandAiShowDescription(aiMap.showDescription ?? true);
      setLandAiShowCaption(aiMap.showCaption ?? true);
      setLandAiMediaRenderType(aiMap.mediaRenderType || 'full-bleed-artwork');
      setLandAiDesktopImageMode(aiMap.desktopImageMode || 'cover');
      setLandAiMobileImageMode(aiMap.mobileImageMode || 'cover');
      setLandAiDesktopObjectPosition(aiMap.desktopObjectPosition || 'center center');
      setLandAiMobileObjectPosition(aiMap.mobileObjectPosition || 'center top');
      setLandAiItems(aiMap.items && aiMap.items.length ? aiMap.items : DEFAULT_AI_ITEMS);
      setLandAiEnableMotion(aiMap.enableMotion ?? true);
      setLandAiMotionStyle(aiMap.motionStyle || 'elegant-science');
      setLandAiAutoRotate(aiMap.autoRotateIngredients ?? true);
      setLandAiShowIcons(aiMap.showIngredientIcons ?? true);
      setLandAiHighlightActive(aiMap.highlightActiveIngredient ?? true);

      const usageGuide = content.usageGuide || content.howToUse || {};
      setLandUsageEyebrow(usageGuide.eyebrow || '');
      setLandUsageTitle(usageGuide.title || '');
      setLandUsageDescription(usageGuide.description || '');
      setLandUsageNote(usageGuide.note || '');
      setLandUsageCaption(usageGuide.caption || '');
      setLandUsageShowDescription(usageGuide.showDescription ?? true);
      setLandUsageShowNote(usageGuide.showNote ?? true);
      setLandUsageShowCaption(usageGuide.showCaption ?? true);
      setLandUsageMediaRenderType(usageGuide.mediaRenderType || 'full-bleed-artwork');
      setLandUsageDesktopImageMode(usageGuide.desktopImageMode || 'cover');
      setLandUsageMobileImageMode(usageGuide.mobileImageMode || 'cover');
      setLandUsageDesktopObjectPosition(usageGuide.desktopObjectPosition || 'center center');
      setLandUsageMobileObjectPosition(usageGuide.mobileObjectPosition || 'center top');
      setLandUsageSteps(usageGuide.steps && usageGuide.steps.length > 0 ? usageGuide.steps : DEFAULT_USAGE_STEPS);

      const detailForm = content.productDetailForm || {};
      setLandProductDetailFormEyebrow(detailForm.eyebrow || '');
      setLandProductDetailFormTitle(detailForm.title || '');
      setLandProductDetailFormDescription(detailForm.description || '');
      setLandProductDetailFormOfflineTitle(detailForm.offlineTitle || '');
      setLandProductDetailFormOfflineDescription(detailForm.offlineDescription || '');
      setLandProductDetailFormOfflineMediaSlot(detailForm.offlineMediaSlot || 'cosmetic-luminous-offline-experience-image');
      setLandDetailOfflineShow(detailForm.offlineShow ?? true);
      setLandDetailOfflineDesktopImageMode(detailForm.offlineDesktopImageMode || 'cover');
      setLandDetailOfflineMobileImageMode(detailForm.offlineMobileImageMode || 'cover');
      setLandDetailOfflineDesktopObjectPosition(detailForm.offlineDesktopObjectPosition || 'center center');
      setLandDetailOfflineMobileObjectPosition(detailForm.offlineMobileObjectPosition || 'center center');
      setLandDetailOfflineTextAlign(detailForm.offlineTextAlign || 'left');
      setLandDetailOfflineOverlayStrength(detailForm.offlineOverlayStrength || 'medium');
      setLandProductDetailFormInfo(detailForm.info || []);
      setLandProductDetailFormIngredientGroups(detailForm.ingredientGroups || []);
      setLandProductDetailFormCautions(detailForm.cautions || []);
      setLandProductDetailFormStorage(detailForm.storage || '');
      setLandProductDetailFormQualityGuarantee(detailForm.qualityGuarantee || '');

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
      setLandSpaBridgeCtaHref(spaBridge.spaBridgeCtaHref || content.spaBridgeCtaHref || '');

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
        updatedContent.heroDesktopMediaSlot = landHeroMediaDesktop;
        updatedContent.heroMobileMediaSlot = landHeroMediaMobile;
        updatedContent.heroMediaDesktop = landHeroMediaDesktop;
        updatedContent.heroMediaMobile = landHeroMediaMobile;
        updatedContent.secondaryCtaLabel = landSecondaryCtaLabel;
        updatedContent.secondaryCtaHref = landSecondaryCtaHref;
        
        // Only include antiGravity if it's the Luminous Set landing block
        if (editingBlock.block_type === 'cosmetic-product-landing-luminous-set') {
          // Force luminous set media slots safely to ensure robust rendering
          updatedContent.heroMediaSlot = 'cosmetic-product-luminous-set';
          updatedContent.heroDesktopMediaSlot = 'cosmetic-luminous-hero-desktop';
          updatedContent.heroMobileMediaSlot = 'cosmetic-luminous-hero-mobile';
          updatedContent.heroMediaDesktop = 'cosmetic-luminous-hero-desktop';
          updatedContent.heroMediaMobile = 'cosmetic-luminous-hero-mobile';

          updatedContent.antiGravity = {
            eyebrow: landAntiGravityEyebrow,
            title: landAntiGravityTitle,
            headline: landAntiGravityHeadline,
            showHeadline: landAntiGravityShowHeadline,
            description: landAntiGravityDescription,
            showDescription: landAntiGravityShowDescription,
            mediaSlot: landAntiGravityMediaSlot,
            desktopMediaSlot: landAntiGravityDesktopMediaSlot,
            mobileMediaSlot: landAntiGravityMobileMediaSlot,
            desktopImageMode: landAntiGravityDesktopImageMode,
            desktopObjectPosition: landAntiGravityDesktopObjectPosition,
            mobileObjectPosition: landAntiGravityMobileObjectPosition,
            caption: landAntiGravityCaption,
            callouts: landAntiGravityCallouts
          };
          updatedContent.whoNeedsSheerSet = {
            eyebrow: landWhoNeedsEyebrow,
            title: landWhoNeedsTitle,
            note: landWhoNeedsNote,
            showNote: landWhoNeedsShowNote,
            description: landWhoNeedsDescription,
            showDescription: landWhoNeedsShowDescription,
            mediaSlot: landWhoNeedsMediaSlot,
            desktopMediaSlot: landWhoNeedsDesktopMediaSlot,
            mobileMediaSlot: landWhoNeedsMobileMediaSlot,
            desktopImageMode: landWhoNeedsDesktopImageMode,
            desktopObjectPosition: landWhoNeedsDesktopObjectPosition,
            mobileObjectPosition: landWhoNeedsMobileObjectPosition,
            imageCaption: landWhoNeedsImageCaption,
            showImageCaption: landWhoNeedsShowImageCaption,
            items: landWhoNeedsItems
          };
          updatedContent.skinBarrierMg3Plus = {
            skinBarrier: {
              eyebrow: landBarrierEyebrow,
              title: landBarrierTitle,
              showTitle: landBarrierShowTitle,
              description: landBarrierDescription,
              showDescription: landBarrierShowDescription,
              mediaSlot: 'cosmetic-luminous-skin-barrier-image',
              desktopMediaSlot: 'cosmetic-luminous-skin-barrier-desktop',
              mobileMediaSlot: 'cosmetic-luminous-skin-barrier-mobile',
              desktopImageMode: landBarrierDesktopImageMode,
              desktopObjectPosition: landBarrierDesktopObjectPosition,
              mobileObjectPosition: landBarrierMobileObjectPosition,
              mediaRenderType: landSkinBarrierMediaRenderType
            },
            mg3Plus: {
              eyebrow: landBarrierMg3Eyebrow,
              title: landBarrierMg3Title,
              showTitle: landBarrierMg3ShowTitle,
              description: landBarrierMg3Description,
              showDescription: landBarrierMg3ShowDescription,
              mediaSlot: 'cosmetic-luminous-mg3-plus-image',
              desktopMediaSlot: 'cosmetic-luminous-mg3-plus-desktop',
              mobileMediaSlot: 'cosmetic-luminous-mg3-plus-mobile',
              desktopImageMode: landBarrierMg3DesktopImageMode,
              desktopObjectPosition: landBarrierMg3DesktopObjectPosition,
              mobileObjectPosition: landBarrierMg3MobileObjectPosition,
              mediaRenderType: landMg3PlusMediaRenderType
            }
          };
          updatedContent.activeIngredientsMap = {
            eyebrow: landAiEyebrow,
            title: landAiTitle,
            description: landAiDescription,
            caption: landAiCaption,
            showDescription: landAiShowDescription,
            showCaption: landAiShowCaption,
            mediaRenderType: landAiMediaRenderType,
            mediaSlot: 'cosmetic-luminous-active-ingredients-image',
            desktopMediaSlot: 'cosmetic-luminous-active-ingredients-desktop',
            mobileMediaSlot: 'cosmetic-luminous-active-ingredients-mobile',
            desktopImageMode: landAiDesktopImageMode,
            mobileImageMode: landAiMobileImageMode,
            desktopObjectPosition: landAiDesktopObjectPosition,
            mobileObjectPosition: landAiMobileObjectPosition,
            items: landAiItems,
            enableMotion: landAiEnableMotion,
            motionStyle: landAiMotionStyle,
            autoRotateIngredients: landAiAutoRotate,
            showIngredientIcons: landAiShowIcons,
            highlightActiveIngredient: landAiHighlightActive,
          };
          updatedContent.usageGuide = {
            eyebrow: landUsageEyebrow,
            title: landUsageTitle,
            description: landUsageDescription,
            note: landUsageNote,
            caption: landUsageCaption,
            showDescription: landUsageShowDescription,
            showNote: landUsageShowNote,
            showCaption: landUsageShowCaption,
            mediaRenderType: landUsageMediaRenderType,
            mediaSlot: 'cosmetic-luminous-usage-set-image',
            desktopMediaSlot: 'cosmetic-luminous-usage-desktop',
            mobileMediaSlot: 'cosmetic-luminous-usage-mobile',
            instructionMediaSlot: 'cosmetic-luminous-ampoule-instruction-image',
            creamInstructionMediaSlot: 'cosmetic-luminous-cream-instruction-image',
            desktopImageMode: landUsageDesktopImageMode,
            mobileImageMode: landUsageMobileImageMode,
            desktopObjectPosition: landUsageDesktopObjectPosition,
            mobileObjectPosition: landUsageMobileObjectPosition,
            steps: landUsageSteps
          };
          updatedContent.productDetailForm = {
            eyebrow: landProductDetailFormEyebrow,
            title: landProductDetailFormTitle,
            description: landProductDetailFormDescription,
            offlineTitle: landProductDetailFormOfflineTitle,
            offlineDescription: landProductDetailFormOfflineDescription,
            offlineDesktopMediaSlot: 'cosmetic-luminous-offline-experience-image',
            offlineMobileMediaSlot: 'cosmetic-luminous-offline-experience-mobile',
            offlineShow: landDetailOfflineShow,
            offlineDesktopImageMode: landDetailOfflineDesktopImageMode,
            offlineMobileImageMode: landDetailOfflineMobileImageMode,
            offlineDesktopObjectPosition: landDetailOfflineDesktopObjectPosition,
            offlineMobileObjectPosition: landDetailOfflineMobileObjectPosition,
            offlineTextAlign: landDetailOfflineTextAlign,
            offlineOverlayStrength: landDetailOfflineOverlayStrength,
            info: landProductDetailFormInfo,
            ingredientGroups: landProductDetailFormIngredientGroups,
            cautions: landProductDetailFormCautions,
            storage: landProductDetailFormStorage,
            qualityGuarantee: landProductDetailFormQualityGuarantee
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

  const renderSlotCard = (slot: { id: string, name: string, size: string }) => {
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
              onClick={(e) => { e.preventDefault(); setPickerOpenSlot(slot.id); }}
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
                onClick={(e) => { e.preventDefault(); handleRemoveMediaSlot(slot.id); }}
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
                        <div className="col-span-2 space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                          <h4 className="text-[11px] font-bold text-[#050A5C] uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">Hero Media Settings</h4>
                          
                          {editingBlock.block_type === 'cosmetic-product-landing-luminous-set' ? (
                            <div className="space-y-4 mb-4">
                              <p className="text-xs text-blue-800 bg-blue-50 p-3 rounded-md border border-blue-100">
                                <strong>💡 Hướng dẫn:</strong> Chọn slot chỉ là nơi lưu ảnh. Nếu banner chưa hiển thị, hãy tải ảnh vào đúng slot Desktop/Mobile bên dưới.
                                <br />Desktop banner dùng cho màn hình lớn. Mobile banner dùng cho điện thoại. Nếu chưa có banner, trang sẽ dùng ảnh packshot fallback.
                              </p>
                              
                              <div className="space-y-4">
                                {renderSlotCard({ id: 'cosmetic-luminous-hero-desktop', name: 'Desktop campaign banner', size: '2400 × 1200 px or 2560 × 1200 px' })}
                                {renderSlotCard({ id: 'cosmetic-luminous-hero-mobile', name: 'Mobile vertical banner', size: '1080 × 1600 px or 1080 × 1920 px' })}
                                {renderSlotCard({ id: 'cosmetic-product-luminous-set', name: 'Fallback product packshot', size: '1200 × 1500 px or square/portrait packshot' })}
                              </div>
                              
                              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md mt-4">
                                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Trạng thái Render (Debug)</h5>
                                <ul className="text-[11px] text-slate-600 space-y-1 font-mono">
                                  <li>Desktop resolved: <span className="font-semibold text-slate-800 break-all">{mediaAssets.find(m => m.metadata?.slot === 'cosmetic-luminous-hero-desktop' && !m.metadata?.archivedFromSlot)?.url || 'Chưa có ảnh'}</span></li>
                                  <li>Mobile resolved: <span className="font-semibold text-slate-800 break-all">{mediaAssets.find(m => m.metadata?.slot === 'cosmetic-luminous-hero-mobile' && !m.metadata?.archivedFromSlot)?.url || 'Chưa có ảnh'}</span></li>
                                  <li>Fallback resolved: <span className="font-semibold text-slate-800 break-all">{mediaAssets.find(m => m.metadata?.slot === 'cosmetic-product-luminous-set' && !m.metadata?.archivedFromSlot)?.url || 'Chưa có ảnh'}</span></li>
                                </ul>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Hero Image Slot (Main Visual)</label>
                              <select value={landHeroMediaSlot} onChange={e => setLandHeroMediaSlot(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white">
                                <option value="cosmetic-product-luminous-set">Luminous Revitalization Sheer Set (cosmetic-product-luminous-set)</option>
                                <option value="cosmetic-set-cellurevive-ampoule">CELLUREVIVE Ampoule (cosmetic-set-cellurevive-ampoule)</option>
                                <option value="cosmetic-set-regenaglow-sheer-cream">REGENAGLOW Sheer Cream (cosmetic-set-regenaglow-sheer-cream)</option>
                              </select>
                            </div>
                          )}
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

                    {/* 2. Anti-Gravity Solution Details (Only for Luminous Set) */}
                    {editingBlock.block_type === 'cosmetic-product-landing-luminous-set' && (
                      <details className="group border border-slate-200 rounded-xl overflow-hidden">
                        <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-700 select-none transition flex items-center justify-between">
                          <span>2. Anti-Gravity Solution (Phục hồi cấu trúc da)</span>
                          <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nhãn nhỏ (Eyebrow)</label>
                            <input type="text" value={landAntiGravityEyebrow} onChange={e => setLandAntiGravityEyebrow(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mô tả ảnh (Caption)</label>
                            <input type="text" value={landAntiGravityCaption} onChange={e => setLandAntiGravityCaption(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                          </div>
                          <div className="col-span-2 space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                            <h4 className="text-[11px] font-bold text-[#050A5C] uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">Anti-Gravity Media</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase">Desktop Background</label>
                                {renderSlotCard({ id: landAntiGravityDesktopMediaSlot || 'cosmetic-luminous-anti-gravity-desktop', name: 'Anti-Gravity Desktop Background', size: '1200x760 or 1600x1000' })}
                                
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Image Mode</label>
                                    <select value={landAntiGravityDesktopImageMode} onChange={e => setLandAntiGravityDesktopImageMode(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-300 rounded bg-white">
                                      <option value="cover">Cover (Phủ kín)</option>
                                      <option value="contain-blur">Contain + Blur</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Object Position</label>
                                    <select value={landAntiGravityDesktopObjectPosition} onChange={e => setLandAntiGravityDesktopObjectPosition(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-300 rounded bg-white">
                                      <option value="center center">Center Center</option>
                                      <option value="center right">Center Right</option>
                                      <option value="center left">Center Left</option>
                                      <option value="top center">Top Center</option>
                                      <option value="bottom center">Bottom Center</option>
                                    </select>
                                  </div>
                                </div>
                                <p className="text-[9px] text-slate-500 italic">Nếu chỉ có ảnh dọc nhưng dùng cho desktop ngang, chọn contain-blur để giữ trọn ảnh và tự tạo nền mờ phía sau.</p>
                              </div>
                              <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase">Mobile Background</label>
                                {renderSlotCard({ id: landAntiGravityMobileMediaSlot || 'cosmetic-luminous-anti-gravity-mobile', name: 'Anti-Gravity Mobile Background', size: '1080x1600 or 1080x1920' })}
                                
                                <div className="mt-3">
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Object Position</label>
                                  <select value={landAntiGravityMobileObjectPosition} onChange={e => setLandAntiGravityMobileObjectPosition(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-300 rounded bg-white">
                                    <option value="center top">Center Top</option>
                                    <option value="center center">Center Center</option>
                                    <option value="center bottom">Center Bottom</option>
                                  </select>
                                </div>
                              </div>
                              <div className="space-y-2 md:col-span-2 mt-2 pt-3 border-t border-slate-200">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase">Fallback Feature Image (Cũ)</label>
                                {renderSlotCard({ id: landAntiGravityMediaSlot || 'cosmetic-luminous-anti-gravity-image', name: 'Anti-Gravity Fallback Image', size: '1200x760' })}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tiêu đề chính (Title)</label>
                            <input type="text" value={landAntiGravityTitle} onChange={e => setLandAntiGravityTitle(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white font-semibold" />
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">Mô tả phụ (Headline)</label>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="show-headline" checked={landAntiGravityShowHeadline} onChange={(e) => setLandAntiGravityShowHeadline(e.target.checked)} className="w-3 h-3 text-[#050A5C] border-slate-300 rounded focus:ring-[#050A5C]" />
                                <label htmlFor="show-headline" className="text-[10px] text-slate-600 font-medium cursor-pointer">Hiển thị</label>
                              </div>
                            </div>
                            <input type="text" value={landAntiGravityHeadline} onChange={e => setLandAntiGravityHeadline(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                            <p className="text-[10px] text-slate-500 mt-1">Khi tắt, nội dung vẫn được lưu trong CMS nhưng không hiển thị trên public.</p>
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">Đoạn văn giới thiệu (Description)</label>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="show-description" checked={landAntiGravityShowDescription} onChange={(e) => setLandAntiGravityShowDescription(e.target.checked)} className="w-3 h-3 text-[#050A5C] border-slate-300 rounded focus:ring-[#050A5C]" />
                                <label htmlFor="show-description" className="text-[10px] text-slate-600 font-medium cursor-pointer">Hiển thị</label>
                              </div>
                            </div>
                            <textarea value={landAntiGravityDescription} onChange={e => setLandAntiGravityDescription(e.target.value)} rows={3} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                            <p className="text-[10px] text-slate-500 mt-1">Khi tắt, nội dung vẫn được lưu trong CMS nhưng không hiển thị trên public.</p>
                          </div>
                          
                          <div className="col-span-2 mt-2 pt-2 border-t border-slate-100">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Các thông số nổi bật (Callouts)</label>
                            <p className="text-[9px] text-slate-400 mb-2">X/Y là vị trí callout trên ảnh desktop (%). Mobile sẽ tự động xếp thành danh sách để dễ đọc.</p>
                            <div className="space-y-3">
                              {landAntiGravityCallouts.map((callout: any, idx: number) => (
                                <div key={idx} className="p-2.5 border border-slate-200 rounded-lg bg-slate-50 grid grid-cols-2 gap-2 relative">
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
                                  <div className="grid grid-cols-3 gap-2 col-span-2">
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Desktop X %</label>
                                      <input type="number" min={0} max={100} value={callout.x ?? ''} onChange={e => { const l = [...landAntiGravityCallouts]; l[idx] = { ...l[idx], x: e.target.value ? Number(e.target.value) : undefined }; setLandAntiGravityCallouts(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white font-mono" placeholder="18" />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Desktop Y %</label>
                                      <input type="number" min={0} max={100} value={callout.y ?? ''} onChange={e => { const l = [...landAntiGravityCallouts]; l[idx] = { ...l[idx], y: e.target.value ? Number(e.target.value) : undefined }; setLandAntiGravityCallouts(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white font-mono" placeholder="42" />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Align</label>
                                      <select value={callout.align || 'left'} onChange={e => { const l = [...landAntiGravityCallouts]; l[idx] = { ...l[idx], align: e.target.value }; setLandAntiGravityCallouts(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white">
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                      </select>
                                    </div>
                                  </div>
                                  <button type="button" onClick={() => setLandAntiGravityCallouts(landAntiGravityCallouts.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-slate-400 hover:text-red-600">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ))}
                              <button type="button" onClick={() => setLandAntiGravityCallouts([...landAntiGravityCallouts, { label: '', value: '', description: '', x: undefined, y: undefined, align: 'left' }])} className="w-full py-1.5 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-1">
                                <Plus className="h-3.5 w-3.5" />
                                Thêm Callout
                              </button>
                            </div>
                          </div>
                        </div>
                      </details>
                    )}
                    {editingBlock.block_type !== 'cosmetic-product-landing-luminous-set' && (
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
                    )}
                    
                    {/* 3. Who Needs Sheer Set Details (Only for Luminous Set) */}
                    {editingBlock.block_type === 'cosmetic-product-landing-luminous-set' && (
                      <details className="group border border-slate-200 rounded-xl overflow-hidden">
                        <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-700 select-none transition flex items-center justify-between">
                          <span>3. Who Needs Sheer Set (Đối tượng sử dụng)</span>
                          <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-2 gap-6">
                          <div className="col-span-2 md:col-span-1 space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                            <h4 className="text-[11px] font-bold text-[#050A5C] uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">Hình ảnh & Hiển thị</h4>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase">Desktop Background</label>
                                {renderSlotCard({ id: landWhoNeedsDesktopMediaSlot || 'cosmetic-luminous-who-for-desktop', name: 'Who Needs Desktop Background', size: '2560x1080 or 1920x1080' })}
                                
                                <div className="grid grid-cols-2 gap-2 mt-3">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Chế độ hiển thị</label>
                                    <select value={landWhoNeedsDesktopImageMode} onChange={e => setLandWhoNeedsDesktopImageMode(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-300 rounded bg-white">
                                      <option value="cover">Phủ kín (Cover)</option>
                                      <option value="contain-blur">Giữ trọn ảnh & Nền mờ</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Object Position</label>
                                    <select value={landWhoNeedsDesktopObjectPosition} onChange={e => setLandWhoNeedsDesktopObjectPosition(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-300 rounded bg-white">
                                      <option value="center center">Center Center</option>
                                      <option value="center right">Center Right</option>
                                      <option value="center left">Center Left</option>
                                      <option value="top center">Top Center</option>
                                      <option value="bottom center">Bottom Center</option>
                                    </select>
                                  </div>
                                </div>
                                <p className="text-[9px] text-slate-500 italic">Nếu chỉ có ảnh dọc nhưng dùng cho desktop ngang, chọn contain-blur để giữ trọn ảnh và tự tạo nền mờ phía sau.</p>
                              </div>
                              <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase">Mobile Background</label>
                                {renderSlotCard({ id: landWhoNeedsMobileMediaSlot || 'cosmetic-luminous-who-for-mobile', name: 'Who Needs Mobile Background', size: '1080x1600 or 1080x1920' })}
                                
                                <div className="mt-3">
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Object Position</label>
                                  <select value={landWhoNeedsMobileObjectPosition} onChange={e => setLandWhoNeedsMobileObjectPosition(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-300 rounded bg-white">
                                    <option value="center top">Center Top</option>
                                    <option value="center center">Center Center</option>
                                    <option value="center bottom">Center Bottom</option>
                                  </select>
                                </div>
                              </div>
                              <div className="space-y-2 md:col-span-2 mt-2 pt-3 border-t border-slate-200">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase">Fallback Feature Image (Cũ)</label>
                                {renderSlotCard({ id: landWhoNeedsMediaSlot || 'cosmetic-luminous-who-for-image', name: 'Who Needs Fallback Image', size: '1200x760' })}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2 md:col-span-1 space-y-3">
                            <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-2">Tùy chọn hiển thị</label>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="show-who-needs-note" checked={landWhoNeedsShowNote} onChange={e => setLandWhoNeedsShowNote(e.target.checked)} className="w-3.5 h-3.5 text-[#050A5C] border-slate-300 rounded focus:ring-[#050A5C]" />
                                <label htmlFor="show-who-needs-note" className="text-[11px] text-slate-600 cursor-pointer">Hiển thị ghi chú</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="show-who-needs-desc" checked={landWhoNeedsShowDescription} onChange={e => setLandWhoNeedsShowDescription(e.target.checked)} className="w-3.5 h-3.5 text-[#050A5C] border-slate-300 rounded focus:ring-[#050A5C]" />
                                <label htmlFor="show-who-needs-desc" className="text-[11px] text-slate-600 cursor-pointer">Hiển thị đoạn mô tả</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="show-who-needs-cap" checked={landWhoNeedsShowImageCaption} onChange={e => setLandWhoNeedsShowImageCaption(e.target.checked)} className="w-3.5 h-3.5 text-[#050A5C] border-slate-300 rounded focus:ring-[#050A5C]" />
                                <label htmlFor="show-who-needs-cap" className="text-[11px] text-slate-600 cursor-pointer">Hiển thị caption trên ảnh</label>
                              </div>
                              <p className="text-[9px] text-slate-500 italic mt-1 pt-1 border-t border-slate-200">Khi tắt, nội dung vẫn được lưu trong CMS nhưng không hiển thị trên public.</p>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nhãn nhỏ (Eyebrow)</label>
                              <input type="text" value={landWhoNeedsEyebrow} onChange={e => setLandWhoNeedsEyebrow(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tiêu đề chính (Title)</label>
                              <input type="text" value={landWhoNeedsTitle} onChange={e => setLandWhoNeedsTitle(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white font-semibold" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ghi chú (Note)</label>
                              <input type="text" value={landWhoNeedsNote} onChange={e => setLandWhoNeedsNote(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white italic" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Đoạn văn mô tả (Description)</label>
                              <textarea value={landWhoNeedsDescription} onChange={e => setLandWhoNeedsDescription(e.target.value)} rows={3} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ghi chú trên ảnh (Image Caption)</label>
                              <input type="text" value={landWhoNeedsImageCaption} onChange={e => setLandWhoNeedsImageCaption(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                            </div>
                          </div>
                          
                          <div className="col-span-2 mt-2 pt-2 border-t border-slate-100">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Checklist (Items)</label>
                            <p className="text-[10px] text-slate-500 italic mb-3">Checklist sẽ hiển thị dạng hàng có icon check trên desktop và dạng card dọc trên mobile.</p>
                            <div className="space-y-3">
                              {landWhoNeedsItems.map((item: any, idx: number) => (
                                <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-slate-50 relative">
                                  <button type="button" onClick={() => setLandWhoNeedsItems(landWhoNeedsItems.filter((_, i) => i !== idx))} className="absolute top-3 right-3 text-slate-400 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                  <div className="grid grid-cols-2 gap-3 mt-2 pr-6">
                                    <div className="col-span-2">
                                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Tiêu đề (Text)</label>
                                      <input type="text" value={item.text || ''} onChange={e => { const l = [...landWhoNeedsItems]; l[idx] = { ...l[idx], text: e.target.value }; setLandWhoNeedsItems(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white" />
                                    </div>
                                    <div className="col-span-2">
                                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Mô tả chi tiết (Description)</label>
                                      <textarea value={item.description || ''} onChange={e => { const l = [...landWhoNeedsItems]; l[idx] = { ...l[idx], description: e.target.value }; setLandWhoNeedsItems(l); }} rows={2} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white" />
                                    </div>
                                    <div className="col-span-2 flex items-center gap-2">
                                      <input type="checkbox" id={`highlight-${idx}`} checked={item.highlight || false} onChange={e => { const l = [...landWhoNeedsItems]; l[idx] = { ...l[idx], highlight: e.target.checked }; setLandWhoNeedsItems(l); }} className="w-3 h-3 text-[#050A5C] border-slate-300 rounded focus:ring-[#050A5C]" />
                                      <label htmlFor={`highlight-${idx}`} className="text-[10px] text-slate-600 font-medium cursor-pointer">Nổi bật (Highlight)</label>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <button type="button" onClick={() => setLandWhoNeedsItems([...landWhoNeedsItems, { text: '', description: '', highlight: false }])} className="w-full py-1.5 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-1">
                                <Plus className="h-3.5 w-3.5" />
                                Thêm mục checklist
                              </button>
                            </div>
                          </div>
                        </div>
                      </details>
                    )}
                    {/* 4. Skin Barrier & MG3-Plus (Only for Luminous Set) */}
                    {editingBlock.block_type === 'cosmetic-product-landing-luminous-set' && (
                      <details className="group border border-slate-200 rounded-xl overflow-hidden">
                        <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-700 select-none transition flex items-center justify-between">
                          <span>4. Skin Barrier & MG3-Plus (Khoa học & Công nghệ)</span>
                          <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-2 gap-6">
                          
                          {/* Skin Barrier */}
                          <div className="col-span-2 space-y-6 p-5 border border-slate-100 rounded-xl bg-slate-50/50">
                            <h4 className="text-[13px] font-bold text-[#050A5C] uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">Skin Barrier</h4>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="col-span-2 md:col-span-1 space-y-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nhãn nhỏ (Eyebrow)</label>
                                  <input type="text" value={landBarrierEyebrow} onChange={e => setLandBarrierEyebrow(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                                </div>
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Tiêu đề (Title)</label>
                                    <label className="flex items-center gap-1 cursor-pointer">
                                      <input type="checkbox" checked={landBarrierShowTitle} onChange={e => setLandBarrierShowTitle(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 bg-white" />
                                      <span className="text-[10px] text-slate-500 font-semibold">Hiển thị</span>
                                    </label>
                                  </div>
                                  <input type="text" value={landBarrierTitle} onChange={e => setLandBarrierTitle(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white font-semibold" />
                                </div>
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Mô tả (Description)</label>
                                    <label className="flex items-center gap-1 cursor-pointer">
                                      <input type="checkbox" checked={landBarrierShowDescription} onChange={e => setLandBarrierShowDescription(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 bg-white" />
                                      <span className="text-[10px] text-slate-500 font-semibold">Hiển thị</span>
                                    </label>
                                  </div>
                                  <textarea value={landBarrierDescription} onChange={e => setLandBarrierDescription(e.target.value)} rows={4} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                                </div>
                              </div>
                              
                              <div className="col-span-2 md:col-span-1 space-y-4">
                                <p className="text-[11px] text-amber-600 font-medium bg-amber-50 p-2 rounded-md border border-amber-100">
                                  Desktop và mobile là 2 slot độc lập. Hệ thống không tự đảo ảnh theo kích thước.
                                </p>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Ảnh desktop ngang — Skin Barrier</label>
                                  <div className="flex gap-2 mb-2">
                                    <input type="text" value={landBarrierDesktopMediaSlot} onChange={e => setLandBarrierDesktopMediaSlot(e.target.value)} placeholder="Ví dụ: cosmetic-luminous-skin-barrier-desktop" className="flex-1 text-xs p-1.5 border border-slate-300 rounded bg-white font-mono text-slate-500" />
                                  </div>
                                  {renderSlotCard({ id: landBarrierDesktopMediaSlot || 'cosmetic-luminous-skin-barrier-desktop', name: 'Ảnh desktop ngang — Skin Barrier', size: '1600x1000 hoặc 1200x760' })}
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Ảnh mobile dọc — Skin Barrier</label>
                                  <div className="flex gap-2 mb-2">
                                    <input type="text" value={landBarrierMobileMediaSlot} onChange={e => setLandBarrierMobileMediaSlot(e.target.value)} placeholder="Ví dụ: cosmetic-luminous-skin-barrier-mobile" className="flex-1 text-xs p-1.5 border border-slate-300 rounded bg-white font-mono text-slate-500" />
                                  </div>
                                  {renderSlotCard({ id: landBarrierMobileMediaSlot || 'cosmetic-luminous-skin-barrier-mobile', name: 'Ảnh mobile dọc — Skin Barrier', size: '800x1000' })}
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Ảnh fallback — Skin Barrier</label>
                                  <div className="flex gap-2 mb-2">
                                    <input type="text" value={landBarrierMediaSlot} onChange={e => setLandBarrierMediaSlot(e.target.value)} placeholder="Ví dụ: cosmetic-luminous-skin-barrier-image" className="flex-1 text-xs p-1.5 border border-slate-300 rounded bg-white font-mono text-slate-500" />
                                  </div>
                                </div>
                                
                                <div className="mt-4 border-t border-slate-200 pt-4">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Dạng hiển thị ảnh</label>
                                  <select value={landSkinBarrierMediaRenderType} onChange={e => setLandSkinBarrierMediaRenderType(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white text-slate-700 font-semibold mb-2">
                                    <option value="full-bleed-artwork">Artwork full khung / banner thiết kế sẵn</option>
                                    <option value="diagram">Sơ đồ / hình khoa học nhỏ</option>
                                    <option value="photo">Ảnh sản phẩm / lifestyle</option>
                                  </select>
                                  {landSkinBarrierMediaRenderType === 'full-bleed-artwork' && (
                                    <p className="text-[11px] text-slate-500 mb-4">Ảnh sẽ phủ kín vùng hiển thị, phù hợp banner/graphic đã thiết kế sẵn.</p>
                                  )}
                                  {landSkinBarrierMediaRenderType === 'diagram' && (
                                    <p className="text-[11px] text-slate-500 mb-4">Ảnh được giữ nguyên, không crop. Phù hợp icon/diagram nhỏ.</p>
                                  )}
                                  {landSkinBarrierMediaRenderType === 'photo' && (
                                    <p className="text-[11px] text-slate-500 mb-4">Hỗ trợ cover hoặc contain-blur. Phù hợp ảnh sản phẩm/lifestyle.</p>
                                  )}
                                  
                                  {(landSkinBarrierMediaRenderType === 'diagram' || landSkinBarrierMediaRenderType === 'full-bleed-artwork') && (
                                    <p className="text-[11px] text-blue-600 bg-blue-50 p-2 rounded border border-blue-100 mb-4">
                                      Lưu ý: Các thiết lập Image Mode bên dưới sẽ bị bỏ qua.
                                    </p>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Desktop Image Mode</label>
                                    <select value={landBarrierDesktopImageMode} onChange={e => setLandBarrierDesktopImageMode(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-700">
                                      <option value="cover">Cover (Phủ kín)</option>
                                      <option value="contain">Contain (Vừa khung)</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Desktop Object Position</label>
                                    <select value={landBarrierDesktopObjectPosition} onChange={e => setLandBarrierDesktopObjectPosition(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-700">
                                      <option value="center center">Giữa (Center)</option>
                                      <option value="center top">Giữa trên (Top Center)</option>
                                      <option value="center bottom">Giữa dưới (Bottom Center)</option>
                                      <option value="left center">Trái (Left Center)</option>
                                      <option value="right center">Phải (Right Center)</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Mobile Object Position</label>
                                    <select value={landBarrierMobileObjectPosition} onChange={e => setLandBarrierMobileObjectPosition(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-700">
                                      <option value="center center">Giữa (Center)</option>
                                      <option value="center top">Giữa trên (Top Center)</option>
                                      <option value="center bottom">Giữa dưới (Bottom Center)</option>
                                      <option value="left center">Trái (Left Center)</option>
                                      <option value="right center">Phải (Right Center)</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* MG3-Plus */}
                          <div className="col-span-2 space-y-6 p-5 border border-slate-100 rounded-xl bg-slate-50/50">
                            <h4 className="text-[13px] font-bold text-[#050A5C] uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">MG3-Plus Method</h4>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="col-span-2 md:col-span-1 space-y-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nhãn nhỏ (Eyebrow)</label>
                                  <input type="text" value={landBarrierMg3Eyebrow} onChange={e => setLandBarrierMg3Eyebrow(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                                </div>
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Tiêu đề (Title)</label>
                                    <label className="flex items-center gap-1 cursor-pointer">
                                      <input type="checkbox" checked={landBarrierMg3ShowTitle} onChange={e => setLandBarrierMg3ShowTitle(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 bg-white" />
                                      <span className="text-[10px] text-slate-500 font-semibold">Hiển thị</span>
                                    </label>
                                  </div>
                                  <input type="text" value={landBarrierMg3Title} onChange={e => setLandBarrierMg3Title(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white font-semibold" />
                                </div>
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Mô tả (Description)</label>
                                    <label className="flex items-center gap-1 cursor-pointer">
                                      <input type="checkbox" checked={landBarrierMg3ShowDescription} onChange={e => setLandBarrierMg3ShowDescription(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 bg-white" />
                                      <span className="text-[10px] text-slate-500 font-semibold">Hiển thị</span>
                                    </label>
                                  </div>
                                  <textarea value={landBarrierMg3Description} onChange={e => setLandBarrierMg3Description(e.target.value)} rows={4} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                                </div>
                              </div>
                              
                              <div className="col-span-2 md:col-span-1 space-y-4">
                                <p className="text-[11px] text-amber-600 font-medium bg-amber-50 p-2 rounded-md border border-amber-100">
                                  Desktop và mobile là 2 slot độc lập. Hệ thống không tự đảo ảnh theo kích thước.
                                </p>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Ảnh desktop ngang — MG3-Plus</label>
                                  <div className="flex gap-2 mb-2">
                                    <input type="text" value={landBarrierMg3DesktopMediaSlot} onChange={e => setLandBarrierMg3DesktopMediaSlot(e.target.value)} placeholder="Ví dụ: cosmetic-luminous-mg3-plus-desktop" className="flex-1 text-xs p-1.5 border border-slate-300 rounded bg-white font-mono text-slate-500" />
                                  </div>
                                  {renderSlotCard({ id: landBarrierMg3DesktopMediaSlot || 'cosmetic-luminous-mg3-plus-desktop', name: 'Ảnh desktop ngang — MG3-Plus', size: '1600x1000 hoặc 1200x760' })}
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Ảnh mobile dọc — MG3-Plus</label>
                                  <div className="flex gap-2 mb-2">
                                    <input type="text" value={landBarrierMg3MobileMediaSlot} onChange={e => setLandBarrierMg3MobileMediaSlot(e.target.value)} placeholder="Ví dụ: cosmetic-luminous-mg3-plus-mobile" className="flex-1 text-xs p-1.5 border border-slate-300 rounded bg-white font-mono text-slate-500" />
                                  </div>
                                  {renderSlotCard({ id: landBarrierMg3MobileMediaSlot || 'cosmetic-luminous-mg3-plus-mobile', name: 'Ảnh mobile dọc — MG3-Plus', size: '800x1000' })}
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Ảnh fallback — MG3-Plus</label>
                                  <div className="flex gap-2 mb-2">
                                    <input type="text" value={landBarrierMg3MediaSlot} onChange={e => setLandBarrierMg3MediaSlot(e.target.value)} placeholder="Ví dụ: cosmetic-luminous-mg3-plus-image" className="flex-1 text-xs p-1.5 border border-slate-300 rounded bg-white font-mono text-slate-500" />
                                  </div>
                                </div>
                                
                                <div className="mt-4 border-t border-slate-200 pt-4">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Dạng hiển thị ảnh</label>
                                  <select value={landMg3PlusMediaRenderType} onChange={e => setLandMg3PlusMediaRenderType(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white text-slate-700 font-semibold mb-2">
                                    <option value="full-bleed-artwork">Artwork full khung / banner thiết kế sẵn</option>
                                    <option value="diagram">Sơ đồ / hình khoa học nhỏ</option>
                                    <option value="photo">Ảnh sản phẩm / lifestyle</option>
                                  </select>
                                  {landMg3PlusMediaRenderType === 'full-bleed-artwork' && (
                                    <p className="text-[11px] text-slate-500 mb-4">Ảnh sẽ phủ kín vùng hiển thị, phù hợp banner/graphic đã thiết kế sẵn.</p>
                                  )}
                                  {landMg3PlusMediaRenderType === 'diagram' && (
                                    <p className="text-[11px] text-slate-500 mb-4">Ảnh được giữ nguyên, không crop. Phù hợp icon/diagram nhỏ.</p>
                                  )}
                                  {landMg3PlusMediaRenderType === 'photo' && (
                                    <p className="text-[11px] text-slate-500 mb-4">Hỗ trợ cover hoặc contain-blur. Phù hợp ảnh sản phẩm/lifestyle.</p>
                                  )}
                                  
                                  {(landMg3PlusMediaRenderType === 'diagram' || landMg3PlusMediaRenderType === 'full-bleed-artwork') && (
                                    <p className="text-[11px] text-blue-600 bg-blue-50 p-2 rounded border border-blue-100 mb-4">
                                      Lưu ý: Các thiết lập Image Mode bên dưới sẽ bị bỏ qua.
                                    </p>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Desktop Image Mode</label>
                                    <select value={landBarrierMg3DesktopImageMode} onChange={e => setLandBarrierMg3DesktopImageMode(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-700">
                                      <option value="cover">Cover (Phủ kín)</option>
                                      <option value="contain">Contain (Vừa khung)</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Desktop Object Position</label>
                                    <select value={landBarrierMg3DesktopObjectPosition} onChange={e => setLandBarrierMg3DesktopObjectPosition(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-700">
                                      <option value="center center">Giữa (Center)</option>
                                      <option value="center top">Giữa trên (Top Center)</option>
                                      <option value="center bottom">Giữa dưới (Bottom Center)</option>
                                      <option value="left center">Trái (Left Center)</option>
                                      <option value="right center">Phải (Right Center)</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Mobile Object Position</label>
                                    <select value={landBarrierMg3MobileObjectPosition} onChange={e => setLandBarrierMg3MobileObjectPosition(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-700">
                                      <option value="center center">Giữa (Center)</option>
                                      <option value="center top">Giữa trên (Top Center)</option>
                                      <option value="center bottom">Giữa dưới (Bottom Center)</option>
                                      <option value="left center">Trái (Left Center)</option>
                                      <option value="right center">Phải (Right Center)</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </details>
                    )}
                    {/* 5. Active Ingredients (Only for Luminous Set) */}
                    {editingBlock.block_type === 'cosmetic-product-landing-luminous-set' && (
                      <details className="group border border-slate-200 rounded-xl overflow-hidden">
                        <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-700 select-none transition flex items-center justify-between">
                          <span>5. Active Ingredients (Thành phần)</span>
                          <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="p-4 border-t border-slate-200 bg-white space-y-6">

                          {/* Text fields */}
                          <div className="grid grid-cols-2 gap-6 p-5 border border-slate-100 rounded-xl bg-slate-50/50">
                            <h4 className="col-span-2 text-[13px] font-bold text-[#050A5C] uppercase tracking-wider border-b border-slate-200 pb-2">Nội dung văn bản</h4>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nhãn nhỏ (Eyebrow)</label>
                              <input type="text" value={landAiEyebrow} onChange={e => setLandAiEyebrow(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tiêu đề (Title)</label>
                              <input type="text" value={landAiTitle} onChange={e => setLandAiTitle(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white font-semibold" />
                            </div>
                            <div className="col-span-2">
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Mô tả (Description)</label>
                                <label className="flex items-center gap-1 cursor-pointer">
                                  <input type="checkbox" checked={landAiShowDescription} onChange={e => setLandAiShowDescription(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 bg-white" />
                                  <span className="text-[10px] text-slate-500 font-semibold">Hiển thị</span>
                                </label>
                              </div>
                              <textarea value={landAiDescription} onChange={e => setLandAiDescription(e.target.value)} rows={3} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                            </div>
                            <div className="col-span-2">
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Caption</label>
                                <label className="flex items-center gap-1 cursor-pointer">
                                  <input type="checkbox" checked={landAiShowCaption} onChange={e => setLandAiShowCaption(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 bg-white" />
                                  <span className="text-[10px] text-slate-500 font-semibold">Hiển thị</span>
                                </label>
                              </div>
                              <input type="text" value={landAiCaption} onChange={e => setLandAiCaption(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white italic text-slate-500" />
                            </div>
                          </div>

                          {/* Media Render Type + Upload Cards */}
                          <div className="grid grid-cols-2 gap-6 p-5 border border-slate-100 rounded-xl bg-slate-50/50">
                            <h4 className="col-span-2 text-[13px] font-bold text-[#050A5C] uppercase tracking-wider border-b border-slate-200 pb-2">Hình ảnh</h4>

                            {/* Render type select */}
                            <div className="col-span-2">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Dạng hiển thị ảnh</label>
                              <select value={landAiMediaRenderType} onChange={e => setLandAiMediaRenderType(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white text-slate-700 font-semibold mb-2">
                                <option value="full-bleed-artwork">Artwork full khung / banner thiết kế sẵn</option>
                                <option value="diagram">Sơ đồ / hình khoa học nhỏ</option>
                                <option value="photo">Ảnh sản phẩm / lifestyle</option>
                              </select>
                              {landAiMediaRenderType === 'full-bleed-artwork' && (
                                <p className="text-[11px] text-slate-500 mb-2">Ảnh sẽ phủ kín vùng hiển thị, phù hợp banner/graphic đã thiết kế sẵn.</p>
                              )}
                              {landAiMediaRenderType === 'diagram' && (
                                <p className="text-[11px] text-slate-500 mb-2">Ảnh được giữ nguyên, không crop. Phù hợp icon/diagram nhỏ.</p>
                              )}
                              {landAiMediaRenderType === 'photo' && (
                                <p className="text-[11px] text-slate-500 mb-2">Hỗ trợ cover hoặc contain-blur. Phù hợp ảnh sản phẩm/lifestyle.</p>
                              )}
                              {(landAiMediaRenderType === 'diagram' || landAiMediaRenderType === 'full-bleed-artwork') && (
                                <p className="text-[11px] text-blue-600 bg-blue-50 p-2 rounded border border-blue-100">Lưu ý: Các thiết lập Image Mode bên dưới sẽ bị bỏ qua.</p>
                              )}
                            </div>

                            {/* Helper note */}
                            <div className="col-span-2">
                              <p className="text-[11px] text-amber-600 font-medium bg-amber-50 p-2 rounded-md border border-amber-100">
                                Desktop và mobile là 2 slot độc lập. Hệ thống không tự đảo ảnh theo kích thước.
                              </p>
                            </div>

                            {/* Desktop upload card */}
                            <div className="col-span-2">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Ảnh desktop ngang — Active Ingredients</label>
                              <p className="text-[10px] text-slate-400 mb-2">Khuyến nghị: 1600×1000 px</p>
                              {renderSlotCard({ id: 'cosmetic-luminous-active-ingredients-desktop', name: 'Ảnh desktop ngang — Active Ingredients', size: '1600×1000' })}
                            </div>

                            {/* Mobile upload card */}
                            <div className="col-span-2">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Ảnh mobile dọc — Active Ingredients</label>
                              <p className="text-[10px] text-slate-400 mb-2">Khuyến nghị: 1080×1600 px</p>
                              {renderSlotCard({ id: 'cosmetic-luminous-active-ingredients-mobile', name: 'Ảnh mobile dọc — Active Ingredients', size: '1080×1600' })}
                            </div>

                            {/* Fallback upload card */}
                            <div className="col-span-2">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Ảnh fallback — Active Ingredients</label>
                              {renderSlotCard({ id: 'cosmetic-luminous-active-ingredients-image', name: 'Ảnh fallback — Active Ingredients', size: '1600×1000' })}
                            </div>

                            {/* Image mode & position selects */}
                            <div className="col-span-2 grid grid-cols-2 gap-4 mt-2">
                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Desktop Image Mode</label>
                                <select value={landAiDesktopImageMode} onChange={e => setLandAiDesktopImageMode(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-700">
                                  <option value="cover">Cover (Phủ kín)</option>
                                  <option value="contain">Contain (Vừa khung)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Mobile Image Mode</label>
                                <select value={landAiMobileImageMode} onChange={e => setLandAiMobileImageMode(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-700">
                                  <option value="cover">Cover (Phủ kín)</option>
                                  <option value="contain">Contain (Vừa khung)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Desktop Object Position</label>
                                <select value={landAiDesktopObjectPosition} onChange={e => setLandAiDesktopObjectPosition(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-700">
                                  <option value="center center">Giữa (Center)</option>
                                  <option value="center top">Giữa trên (Top Center)</option>
                                  <option value="center bottom">Giữa dưới (Bottom Center)</option>
                                  <option value="left center">Trái (Left Center)</option>
                                  <option value="right center">Phải (Right Center)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Mobile Object Position</label>
                                <select value={landAiMobileObjectPosition} onChange={e => setLandAiMobileObjectPosition(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-700">
                                  <option value="center center">Giữa (Center)</option>
                                  <option value="center top">Giữa trên (Top Center)</option>
                                  <option value="center bottom">Giữa dưới (Bottom Center)</option>
                                  <option value="left center">Trái (Left Center)</option>
                                  <option value="right center">Phải (Right Center)</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Motion & Science Panel */}
                          <details className="group border border-indigo-100 rounded-xl overflow-hidden">
                            <summary className="px-4 py-3 bg-indigo-50 hover:bg-indigo-100 cursor-pointer font-bold text-xs text-indigo-800 select-none transition flex items-center justify-between">
                              <span>✨ Motion & Khoa học</span>
                              <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                            </summary>
                            <div className="p-4 border-t border-indigo-100 bg-white space-y-4">
                              {/* Enable motion toggle */}
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] font-semibold text-slate-700">Bật hiệu ứng chuyển động</label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" checked={landAiEnableMotion} onChange={e => setLandAiEnableMotion(e.target.checked)} className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500" />
                                  <span className="text-[10px] text-slate-500 font-medium">{landAiEnableMotion ? 'Bật' : 'Tắt'}</span>
                                </label>
                              </div>
                              {/* Motion style select */}
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Phong cách khoa học</label>
                                <select value={landAiMotionStyle} onChange={e => setLandAiMotionStyle(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-700" disabled={!landAiEnableMotion}>
                                  <option value="elegant-science">Khoa học tinh tế</option>
                                  <option value="clinical-diagram">Sơ đồ lâm sàng</option>
                                  <option value="editorial-luxury">Editorial cao cấp</option>
                                </select>
                              </div>
                              {/* Auto rotate toggle */}
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] font-semibold text-slate-700">Tự động xoay thành phần</label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" checked={landAiAutoRotate} onChange={e => setLandAiAutoRotate(e.target.checked)} className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500" disabled={!landAiEnableMotion} />
                                  <span className="text-[10px] text-slate-500 font-medium">{landAiAutoRotate ? 'Bật' : 'Tắt'}</span>
                                </label>
                              </div>
                              {/* Show icons toggle */}
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] font-semibold text-slate-700">Hiển thị icon thành phần</label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" checked={landAiShowIcons} onChange={e => setLandAiShowIcons(e.target.checked)} className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500" />
                                  <span className="text-[10px] text-slate-500 font-medium">{landAiShowIcons ? 'Bật' : 'Tắt'}</span>
                                </label>
                              </div>
                              {/* Highlight active toggle */}
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] font-semibold text-slate-700">Nổi bật thành phần đang chọn</label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" checked={landAiHighlightActive} onChange={e => setLandAiHighlightActive(e.target.checked)} className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500" />
                                  <span className="text-[10px] text-slate-500 font-medium">{landAiHighlightActive ? 'Bật' : 'Tắt'}</span>
                                </label>
                              </div>
                            </div>
                          </details>

                          {/* Ingredients Repeater */}
                          <div className="space-y-3 p-5 border border-slate-100 rounded-xl bg-slate-50/50">
                            <h4 className="text-[13px] font-bold text-[#050A5C] uppercase tracking-wider border-b border-slate-200 pb-2">Danh sách thành phần hoạt chất</h4>
                            <div className="space-y-4">
                              {landAiItems.map((item: any, idx: number) => (
                                <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-white flex items-start gap-3">
                                  <div className="flex-1 grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Tên (Name)</label>
                                      <input type="text" value={item.name || ''} onChange={e => { const l = [...landAiItems]; l[idx] = { ...l[idx], name: e.target.value }; setLandAiItems(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white font-semibold text-[#050A5C]" />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Tên tiếng Anh (English Name)</label>
                                      <input type="text" value={item.englishName || ''} onChange={e => { const l = [...landAiItems]; l[idx] = { ...l[idx], englishName: e.target.value }; setLandAiItems(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-500 italic" />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Vai trò (Role)</label>
                                      <input type="text" value={item.role || ''} onChange={e => { const l = [...landAiItems]; l[idx] = { ...l[idx], role: e.target.value }; setLandAiItems(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-indigo-700" />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Lợi ích (Benefit)</label>
                                      <input type="text" value={item.benefit || ''} onChange={e => { const l = [...landAiItems]; l[idx] = { ...l[idx], benefit: e.target.value }; setLandAiItems(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-emerald-700" />
                                    </div>
                                    <div className="col-span-2">
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Mô tả (Description)</label>
                                      <textarea value={item.description || ''} onChange={e => { const l = [...landAiItems]; l[idx] = { ...l[idx], description: e.target.value }; setLandAiItems(l); }} rows={2} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-600" />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Loại icon (Icon Type)</label>
                                      <select value={item.iconType || ''} onChange={e => { const l = [...landAiItems]; l[idx] = { ...l[idx], iconType: e.target.value || undefined }; setLandAiItems(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-700">
                                        <option value="">— Không chọn —</option>
                                        <option value="exosome">Exosome</option>
                                        <option value="collagen">Collagen</option>
                                        <option value="berry">Berry Antioxidant</option>
                                        <option value="peptide">Peptide Chain</option>
                                        <option value="hyaluronic">Hyaluronic Hydration</option>
                                        <option value="custom">Tùy chỉnh</option>
                                      </select>
                                    </div>
                                    <div className="flex items-center gap-2 pt-4">
                                      <input type="checkbox" id={`ai-highlight-${idx}`} checked={item.highlight || false} onChange={e => { const l = [...landAiItems]; l[idx] = { ...l[idx], highlight: e.target.checked }; setLandAiItems(l); }} className="w-3 h-3 text-[#050A5C] border-slate-300 rounded focus:ring-[#050A5C]" />
                                      <label htmlFor={`ai-highlight-${idx}`} className="text-[10px] text-slate-600 font-medium cursor-pointer">Nổi bật (Highlight)</label>
                                    </div>
                                  </div>
                                  <button type="button" onClick={() => setLandAiItems(landAiItems.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-600 mt-1 shrink-0">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                              <button type="button" onClick={() => setLandAiItems([...landAiItems, { name: '', englishName: '', role: '', description: '', benefit: '', highlight: false }])} className="w-full py-1.5 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-1">
                                <Plus className="h-3.5 w-3.5" />
                                + Thêm thành phần
                              </button>
                            </div>
                          </div>

                        </div>
                      </details>
                    )}
                    {/* 6. How To Use (Only for Luminous Set) */}
                    {editingBlock.block_type === 'cosmetic-product-landing-luminous-set' && (
                      <details className="group border border-slate-200 rounded-xl overflow-hidden">
                        <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-700 select-none transition flex items-center justify-between">
                          <span>6. How To Use (Hướng dẫn sử dụng)</span>
                          <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-2 gap-6">
                          
                          {/* Header section */}
                          <div className="col-span-2 space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                            <h4 className="text-[11px] font-bold text-[#050A5C] uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">Thông tin chung</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2 md:col-span-1">
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Nhãn nhỏ (Eyebrow)</label>
                                <input type="text" value={landUsageEyebrow} onChange={e => setLandUsageEyebrow(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                              </div>
                              <div className="col-span-2 md:col-span-1">
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Tiêu đề (Title)</label>
                                <input type="text" value={landUsageTitle} onChange={e => setLandUsageTitle(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white font-semibold" />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Mô tả (Description)</label>
                                <textarea value={landUsageDescription} onChange={e => setLandUsageDescription(e.target.value)} rows={3} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                              </div>
                              <div className="col-span-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" checked={landUsageShowDescription} onChange={e => setLandUsageShowDescription(e.target.checked)} className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500" />
                                  <span className="text-[11px] text-slate-600 font-medium">Hiển thị mô tả</span>
                                </label>
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Ghi chú (Note)</label>
                                <input type="text" value={landUsageNote} onChange={e => setLandUsageNote(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white italic text-slate-500" />
                              </div>
                              <div className="col-span-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" checked={landUsageShowNote} onChange={e => setLandUsageShowNote(e.target.checked)} className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500" />
                                  <span className="text-[11px] text-slate-600 font-medium">Hiển thị ghi chú</span>
                                </label>
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Chú thích (Caption)</label>
                                <input type="text" value={landUsageCaption} onChange={e => setLandUsageCaption(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white text-slate-500" />
                              </div>
                              <div className="col-span-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" checked={landUsageShowCaption} onChange={e => setLandUsageShowCaption(e.target.checked)} className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500" />
                                  <span className="text-[11px] text-slate-600 font-medium">Hiển thị chú thích</span>
                                </label>
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Media Render Type</label>
                                <select value={landUsageMediaRenderType} onChange={e => setLandUsageMediaRenderType(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-700">
                                  <option value="full-bleed-artwork">Full Bleed Artwork</option>
                                  <option value="diagram">Diagram</option>
                                  <option value="photo">Photo</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Media section */}
                          <div className="col-span-2 space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                            <h4 className="text-[11px] font-bold text-[#050A5C] uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">Hình ảnh hướng dẫn</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {renderSlotCard({ id: 'cosmetic-luminous-usage-desktop', name: 'Ảnh desktop ngang — Usage Guide', size: '1600x1000' })}
                              {renderSlotCard({ id: 'cosmetic-luminous-usage-mobile', name: 'Ảnh mobile dọc — Usage Guide', size: '1080x1600' })}
                              {renderSlotCard({ id: 'cosmetic-luminous-usage-set-image', name: 'Ảnh bộ sản phẩm — Usage Set', size: '1600x1000' })}
                              {renderSlotCard({ id: 'cosmetic-luminous-ampoule-instruction-image', name: 'Ảnh hướng dẫn ampoule', size: '800x800' })}
                              {renderSlotCard({ id: 'cosmetic-luminous-cream-instruction-image', name: 'Ảnh hướng dẫn cream', size: '800x800' })}
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Desktop Image Mode</label>
                                <select value={landUsageDesktopImageMode} onChange={e => setLandUsageDesktopImageMode(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-700">
                                  <option value="cover">Cover (Phủ kín)</option>
                                  <option value="contain">Contain (Vừa khung)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Mobile Image Mode</label>
                                <select value={landUsageMobileImageMode} onChange={e => setLandUsageMobileImageMode(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-700">
                                  <option value="cover">Cover (Phủ kín)</option>
                                  <option value="contain">Contain (Vừa khung)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Desktop Object Position</label>
                                <select value={landUsageDesktopObjectPosition} onChange={e => setLandUsageDesktopObjectPosition(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-700">
                                  <option value="center center">Giữa (Center)</option>
                                  <option value="center top">Giữa trên (Top Center)</option>
                                  <option value="center bottom">Giữa dưới (Bottom Center)</option>
                                  <option value="left center">Trái (Left Center)</option>
                                  <option value="right center">Phải (Right Center)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Mobile Object Position</label>
                                <select value={landUsageMobileObjectPosition} onChange={e => setLandUsageMobileObjectPosition(e.target.value)} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-700">
                                  <option value="center center">Giữa (Center)</option>
                                  <option value="center top">Giữa trên (Top Center)</option>
                                  <option value="center bottom">Giữa dưới (Bottom Center)</option>
                                  <option value="left center">Trái (Left Center)</option>
                                  <option value="right center">Phải (Right Center)</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Steps Repeater */}
                          <div className="col-span-2 space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                            <h4 className="text-[11px] font-bold text-[#050A5C] uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">Danh sách các bước</h4>
                            <div className="space-y-4">
                              {landUsageSteps.map((item: any, idx: number) => (
                                <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-white flex items-start gap-3 relative">
                                  <div className="flex-1 grid grid-cols-2 gap-3">
                                    <div className="col-span-2 md:col-span-1">
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Số hiệu bước (Step)</label>
                                      <input type="text" value={item.step || ''} onChange={e => { const l = [...landUsageSteps]; l[idx] = { ...l[idx], step: e.target.value }; setLandUsageSteps(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white font-mono font-semibold" />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Tên bước (Title)</label>
                                      <input type="text" value={item.title || ''} onChange={e => { const l = [...landUsageSteps]; l[idx] = { ...l[idx], title: e.target.value }; setLandUsageSteps(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white font-semibold text-[#050A5C]" />
                                    </div>
                                    <div className="col-span-2">
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Mô tả (Description)</label>
                                      <textarea value={item.description || ''} onChange={e => { const l = [...landUsageSteps]; l[idx] = { ...l[idx], description: e.target.value }; setLandUsageSteps(l); }} rows={2} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white text-slate-600" />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Sản phẩm (Product)</label>
                                      <input type="text" value={item.product || ''} onChange={e => { const l = [...landUsageSteps]; l[idx] = { ...l[idx], product: e.target.value }; setLandUsageSteps(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white font-semibold" />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Thời gian (Timing)</label>
                                      <input type="text" value={item.timing || ''} onChange={e => { const l = [...landUsageSteps]; l[idx] = { ...l[idx], timing: e.target.value }; setLandUsageSteps(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white font-semibold" />
                                    </div>
                                    <div className="col-span-2 flex items-center gap-2 mt-2">
                                      <input type="checkbox" checked={item.highlight || false} onChange={e => { const l = [...landUsageSteps]; l[idx] = { ...l[idx], highlight: e.target.checked }; setLandUsageSteps(l); }} className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500" />
                                      <span className="text-[11px] text-slate-600 font-medium">Nổi bật (Highlight)</span>
                                    </div>
                                  </div>
                                  <button type="button" onClick={() => setLandUsageSteps(landUsageSteps.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-600 mt-4">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                              <button type="button" onClick={() => setLandUsageSteps([...landUsageSteps, { step: `Step ${landUsageSteps.length + 1}`, title: '', description: '', product: '', timing: '', highlight: false }])} className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-1">
                                <Plus className="h-4 w-4" />
                                + Thêm bước
                              </button>
                            </div>
                          </div>

                        </div>
                      </details>
                    )}
                    {/* 2.96. Product Detail Form (Only for Luminous Set) */}
                    {editingBlock.block_type === 'cosmetic-product-landing-luminous-set' && (
                      <details className="group border border-slate-200 rounded-xl overflow-hidden">
                        <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-700 select-none transition flex items-center justify-between">
                          <span>7. Product Detail Form</span>
                          <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-2 gap-6">
                          
                          {/* Header section */}
                          <div className="col-span-2 space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                            <h4 className="text-[11px] font-bold text-[#050A5C] uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">Thông tin chung</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2 md:col-span-1">
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Nhãn nhỏ (Eyebrow)</label>
                                <input type="text" value={landProductDetailFormEyebrow} onChange={e => setLandProductDetailFormEyebrow(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                              </div>
                              <div className="col-span-2 md:col-span-1">
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Tiêu đề (Title)</label>
                                <input type="text" value={landProductDetailFormTitle} onChange={e => setLandProductDetailFormTitle(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white font-semibold" />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Mô tả (Description)</label>
                                <textarea value={landProductDetailFormDescription} onChange={e => setLandProductDetailFormDescription(e.target.value)} rows={2} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                              </div>
                            </div>
                          </div>

                          {/* Offline Bridge section */}
                          <div className="col-span-2 space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                              <h4 className="text-[11px] font-bold text-[#050A5C] uppercase tracking-wider">Offline Bridge (Tùy chọn)</h4>
                              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                                <input type="checkbox" checked={landDetailOfflineShow} onChange={e => setLandDetailOfflineShow(e.target.checked)} className="rounded border-slate-300 text-[#050A5C] focus:ring-[#050A5C]" />
                                Hiển thị Offline Bridge
                              </label>
                            </div>
                            <p className="text-[10px] text-slate-500 mb-3 bg-white p-2 rounded border border-slate-200">
                              <span className="font-bold">Ghi chú:</span> Khối này dùng ảnh làm background toàn bộ banner. Với ảnh desktop dạng collage ngang như hiện tại, nên dùng tỷ lệ 16:9 hoặc 1200×680 / 1600×900. Không dùng banner quá thấp vì sẽ bị crop mạnh.
                            </p>
                            
                            {landDetailOfflineShow && (
                              <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Tiêu đề Offline (Offline Title)</label>
                                  <input type="text" value={landProductDetailFormOfflineTitle} onChange={e => setLandProductDetailFormOfflineTitle(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Mô tả Offline (Offline Description)</label>
                                  <textarea value={landProductDetailFormOfflineDescription} onChange={e => setLandProductDetailFormOfflineDescription(e.target.value)} rows={2} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white" />
                                </div>
                                <div className="col-span-1">
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Căn lề chữ (Text Align)</label>
                                  <select value={landDetailOfflineTextAlign} onChange={e => setLandDetailOfflineTextAlign(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white">
                                    <option value="left">Trái</option>
                                    <option value="center">Giữa</option>
                                  </select>
                                </div>
                                <div className="col-span-1">
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Độ đậm Overlay (Overlay Strength)</label>
                                  <select value={landDetailOfflineOverlayStrength} onChange={e => setLandDetailOfflineOverlayStrength(e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white">
                                    <option value="light">Nhẹ</option>
                                    <option value="medium">Vừa</option>
                                    <option value="dark">Đậm</option>
                                  </select>
                                </div>

                                <div className="col-span-2 md:col-span-1 space-y-3 p-3 bg-white border border-slate-200 rounded-lg">
                                  <h5 className="text-[10px] font-bold text-slate-600 uppercase mb-2">Ảnh desktop ngang (Banner)</h5>
                                  {renderSlotCard({ id: 'cosmetic-luminous-offline-experience-image', name: 'Ảnh desktop ngang (Banner)', size: '2400 × 1200 px' })}
                                  <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Image Mode</label>
                                      <select value={landDetailOfflineDesktopImageMode} onChange={e => setLandDetailOfflineDesktopImageMode(e.target.value)} className="w-full text-[10px] p-1.5 border border-slate-300 rounded-md bg-white">
                                        <option value="cover">Cover</option>
                                        <option value="contain">Contain</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Object Pos</label>
                                      <select value={landDetailOfflineDesktopObjectPosition} onChange={e => setLandDetailOfflineDesktopObjectPosition(e.target.value)} className="w-full text-[10px] p-1.5 border border-slate-300 rounded-md bg-white">
                                        <option value="center center">Center Center</option>
                                        <option value="center top">Center Top</option>
                                        <option value="center bottom">Center Bottom</option>
                                        <option value="left center">Left Center</option>
                                        <option value="right center">Right Center</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-span-2 md:col-span-1 space-y-3 p-3 bg-white border border-slate-200 rounded-lg">
                                  <h5 className="text-[10px] font-bold text-slate-600 uppercase mb-2">Ảnh mobile dọc (Banner)</h5>
                                  {renderSlotCard({ id: 'cosmetic-luminous-offline-experience-mobile', name: 'Ảnh mobile dọc (Banner)', size: '1080 × 1600 px' })}
                                  <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Image Mode</label>
                                      <select value={landDetailOfflineMobileImageMode} onChange={e => setLandDetailOfflineMobileImageMode(e.target.value)} className="w-full text-[10px] p-1.5 border border-slate-300 rounded-md bg-white">
                                        <option value="cover">Cover</option>
                                        <option value="contain">Contain</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Object Pos</label>
                                      <select value={landDetailOfflineMobileObjectPosition} onChange={e => setLandDetailOfflineMobileObjectPosition(e.target.value)} className="w-full text-[10px] p-1.5 border border-slate-300 rounded-md bg-white">
                                        <option value="center center">Center Center</option>
                                        <option value="center top">Center Top</option>
                                        <option value="center bottom">Center Bottom</option>
                                        <option value="left center">Left Center</option>
                                        <option value="right center">Right Center</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Info Repeater */}
                          <div className="col-span-2 space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                            <h4 className="text-[11px] font-bold text-[#050A5C] uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">Thông tin sản phẩm (Info)</h4>
                            <div className="space-y-4">
                              {landProductDetailFormInfo.map((item: any, idx: number) => (
                                <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-white flex items-start gap-3 relative">
                                  <div className="flex-1 grid grid-cols-2 gap-3">
                                    <div className="col-span-2 md:col-span-1">
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Nhãn (Label)</label>
                                      <input type="text" value={item.label || ''} onChange={e => { const l = [...landProductDetailFormInfo]; l[idx] = { ...l[idx], label: e.target.value }; setLandProductDetailFormInfo(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white font-semibold" />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Giá trị (Value)</label>
                                      <input type="text" value={item.value || ''} onChange={e => { const l = [...landProductDetailFormInfo]; l[idx] = { ...l[idx], value: e.target.value }; setLandProductDetailFormInfo(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white" />
                                    </div>
                                  </div>
                                  <button type="button" onClick={() => setLandProductDetailFormInfo(landProductDetailFormInfo.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-600 mt-4">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                              <button type="button" onClick={() => setLandProductDetailFormInfo([...landProductDetailFormInfo, { label: '', value: '' }])} className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-1">
                                <Plus className="h-4 w-4" />
                                Thêm thông tin
                              </button>
                            </div>
                          </div>

                          {/* Ingredient Groups Repeater */}
                          <div className="col-span-2 space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                            <h4 className="text-[11px] font-bold text-[#050A5C] uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">Nhóm thành phần (Ingredient Groups)</h4>
                            <div className="space-y-4">
                              {landProductDetailFormIngredientGroups.map((item: any, idx: number) => (
                                <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-white flex items-start gap-3 relative">
                                  <div className="flex-1 grid grid-cols-2 gap-3">
                                    <div className="col-span-2 md:col-span-1">
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Tiêu đề (Title)</label>
                                      <input type="text" value={item.title || ''} onChange={e => { const l = [...landProductDetailFormIngredientGroups]; l[idx] = { ...l[idx], title: e.target.value }; setLandProductDetailFormIngredientGroups(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white font-semibold" />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Phụ đề (Subtitle)</label>
                                      <input type="text" value={item.subtitle || ''} onChange={e => { const l = [...landProductDetailFormIngredientGroups]; l[idx] = { ...l[idx], subtitle: e.target.value }; setLandProductDetailFormIngredientGroups(l); }} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white" />
                                    </div>
                                    <div className="col-span-2">
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Thành phần (Ingredients)</label>
                                      <textarea value={item.ingredients || ''} onChange={e => { const l = [...landProductDetailFormIngredientGroups]; l[idx] = { ...l[idx], ingredients: e.target.value }; setLandProductDetailFormIngredientGroups(l); }} rows={3} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white" />
                                    </div>
                                  </div>
                                  <button type="button" onClick={() => setLandProductDetailFormIngredientGroups(landProductDetailFormIngredientGroups.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-600 mt-4">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                              <button type="button" onClick={() => setLandProductDetailFormIngredientGroups([...landProductDetailFormIngredientGroups, { title: '', subtitle: '', ingredients: '' }])} className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-1">
                                <Plus className="h-4 w-4" />
                                Thêm nhóm thành phần
                              </button>
                            </div>
                          </div>

                          {/* Cautions Repeater */}
                          <div className="col-span-2 space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                            <h4 className="text-[11px] font-bold text-[#050A5C] uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">Lưu ý khi sử dụng (Cautions)</h4>
                            <div className="space-y-4">
                              {landProductDetailFormCautions.map((item: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <input type="text" value={item || ''} onChange={e => { const l = [...landProductDetailFormCautions]; l[idx] = e.target.value; setLandProductDetailFormCautions(l); }} className="flex-1 text-[11px] p-1.5 border border-slate-200 rounded bg-white" />
                                  <button type="button" onClick={() => setLandProductDetailFormCautions(landProductDetailFormCautions.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                              <button type="button" onClick={() => setLandProductDetailFormCautions([...landProductDetailFormCautions, ''])} className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-1">
                                <Plus className="h-4 w-4" />
                                Thêm lưu ý
                              </button>
                            </div>
                          </div>

                          {/* Storage & Quality */}
                          <div className="col-span-2 space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                            <h4 className="text-[11px] font-bold text-[#050A5C] uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">Bảo quản & Bảo đảm</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2">
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Bảo quản (Storage)</label>
                                <textarea value={landProductDetailFormStorage} onChange={e => setLandProductDetailFormStorage(e.target.value)} rows={2} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white" />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Bảo đảm chất lượng (Quality Guarantee)</label>
                                <textarea value={landProductDetailFormQualityGuarantee} onChange={e => setLandProductDetailFormQualityGuarantee(e.target.value)} rows={2} className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white" />
                              </div>
                            </div>
                          </div>

                        </div>
                      </details>
                    )}
                    {/* Old Generic Details (Hidden for Luminous Set) */}
                    {editingBlock.block_type !== 'cosmetic-product-landing-luminous-set' && (
                      <div className="space-y-4">
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
                    </div>
                    )}

                    {/* Final CTA Details */}
                    <details className="group border border-slate-200 rounded-xl overflow-hidden">
                      <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-slate-700 select-none transition flex items-center justify-between">
                        <span>{editingBlock.block_type === 'cosmetic-product-landing-luminous-set' ? '8' : '9'}. Final CTA (Khung tư vấn cuối trang)</span>
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
