"use client";

import { useState, useRef, useEffect } from 'react';
import { Upload, XCircle, CheckCircle2, AlertCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { uploadMediaAction } from './actions';
import { Suspense } from 'react';
import Link from 'next/link';

const HUMAN_SLOTS: Record<string, { name: string; size: string }> = {
  'cosmetic-product-luminous-set': { name: 'Ảnh bộ sản phẩm Luminous Set', size: '1600x2000 hoặc 1800x2200, dưới 1MB' },
  'cosmetic-product-regenaglow-cream': { name: 'Kem dưỡng Regenaglow Nourish Cream', size: '1200x1500, dưới 1MB' },
  'cosmetic-product-calmiance-gel': { name: 'Gel phục hồi Calmiance Gel', size: '1200x1500, dưới 1MB' },
  'cosmetic-product-renew-ampoule': { name: 'Tinh chất Renew Ampoule', size: '1200x1500, dưới 1MB' },
  'cosmetic-product-p30-moisturizer': { name: 'Kem dưỡng ẩm P30 Moisturizer', size: '1200x1500, dưới 1MB' },
  'cosmetic-product-p30-toner': { name: 'Toner cân bằng P30 Toner', size: '1200x1500, dưới 1MB' },
  'cosmetic-premium-program': { name: 'Premium Program', size: '1800x1200, dưới 1.5MB' },
  'cosmetic-gallery-ritual-panel': { name: 'Ảnh banner quy trình Ritual Panel', size: '1800x1200, dưới 1.5MB' },
  'cosmetic-gallery-product-set': { name: 'Thư viện - Bộ sản phẩm overview', size: '1600x2000, dưới 1.5MB' },
  'cosmetic-gallery-texture': { name: 'Thư viện - Kết cấu sản phẩm', size: '1600x1600, dưới 1.5MB' },
  'cosmetic-gallery-clinic': { name: 'Thư viện - Phòng khám / Trị liệu', size: '1800x1200, dưới 1.5MB' },
  'cosmetic-gallery-skin': { name: 'Thư viện - Làn da cận cảnh', size: '1600x2000, dưới 1.5MB' },
  'cosmetic-gallery-serum': { name: 'Thư viện - Tinh chất serum cận cảnh', size: '1600x2000, dưới 1.5MB' },
  'cosmetic-gallery-packaging': { name: 'Thư viện - Bao bì sản phẩm', size: '1600x2000, dưới 1.5MB' },
  'cosmetic-set-cellurevive-ampoule': { name: 'Ảnh chi tiết CELLUREVIVE Ampoule trong set', size: '1200x1500 hoặc 1600x2000, dưới 1MB' },
  'cosmetic-set-regenaglow-sheer-cream': { name: 'Ảnh chi tiết REGENAGLOW NOURISH SHEER CREAM trong set', size: '1200x1500 hoặc 1600x2000, dưới 1MB' },
};

function UploadFormInner({ mediaAssets = [] }: { mediaAssets?: any[] }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vavaw-main.vercel.app';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  const purposeParam = searchParams.get('purpose');
  const slotParam = searchParams.get('slot');
  const returnTo = searchParams.get('returnTo') || '/cosmetic-page';

  const isCosmeticSlotMode = purposeParam === 'cosmetic-page-media' && slotParam;

  const [siteKey, setSiteKey] = useState('main');
  const [type, setType] = useState('image');
  const [altText, setAltText] = useState('');
  const [brandSlot, setBrandSlot] = useState('');

  // Local file preview states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isCosmeticSlotMode) {
      setSiteKey('main');
      setType('image');
    }
  }, [isCosmeticSlotMode]);

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Find existing asset for this slot (if any)
  const currentSlotAsset = isCosmeticSlotMode && slotParam
    ? mediaAssets.find(m => m.metadata?.slot === slotParam && !m.metadata?.archivedFromSlot)
    : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) {
      setError('Vui lòng chọn một file ảnh để tải lên.');
      return;
    }

    const file = files[0];
    const isVideo = file.type.startsWith('video');
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    const maxMb = isVideo ? 50 : 5;

    if (file.size > maxSize) {
      setError(`Dung lượng file (${(file.size / (1024 * 1024)).toFixed(2)}MB) vượt quá dung lượng cho phép tối đa ${maxMb}MB.`);
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('site_key', siteKey);
    formData.append('type', type);
    formData.append('alt_text', altText || (isCosmeticSlotMode ? `VAVAW Cosmetic ${HUMAN_SLOTS[slotParam!]?.name || slotParam}` : ''));
    if (brandSlot && !isCosmeticSlotMode) {
      formData.append('brand_slot', brandSlot);
    }
    if (purposeParam) formData.append('purpose', purposeParam);
    if (slotParam) formData.append('slot', slotParam);

    try {
      const result = await uploadMediaAction(formData);

      if (!result.success) {
        setError(result.error || 'Upload failed.');
      } else {
        setSuccess('Media asset uploaded and registered successfully!');
        setAltText('');
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra trong quá trình tải lên.');
    } finally {
      setIsUploading(false);
    }
  };

  // Upload success screen in Cosmetic Slot Mode
  if (success && isCosmeticSlotMode) {
    const slotDetails = HUMAN_SLOTS[slotParam!];
    const displayName = slotDetails?.name || slotParam;
    return (
      <div className="bg-white p-8 shadow rounded-2xl border border-slate-200 space-y-6 text-center max-w-lg mx-auto animate-fade-in">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900">Đã cập nhật ảnh thành công!</h3>
          <p className="text-sm text-slate-600">Đã cập nhật ảnh cho slot: <strong>{displayName}</strong></p>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Link 
            href={returnTo}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow transition"
          >
            Quay lại Cosmetic Page
          </Link>
          <a 
            href={`${siteUrl}/cosmetic`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm rounded-lg transition inline-flex items-center justify-center gap-1.5"
          >
            <span>Xem trang public</span>
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            onClick={() => {
              setSuccess(null);
            }}
            className="w-full py-2.5 text-slate-500 hover:text-slate-700 text-xs font-semibold"
          >
            Tải lên ảnh khác cho vị trí này
          </button>
        </div>
      </div>
    );
  }

  const activeSlotInfo = isCosmeticSlotMode ? HUMAN_SLOTS[slotParam!] : null;

  return (
    <div className="bg-white p-6 shadow rounded-lg border border-slate-200 space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        <Upload className="h-5 w-5 text-blue-600" />
        <span>{isCosmeticSlotMode ? 'Tải lên hình ảnh vị trí Cosmetic' : 'Upload New Asset'}</span>
      </h2>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
          <XCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && !isCosmeticSlotMode && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-md flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Cosmetic Slot Context Mode Info Box */}
      {isCosmeticSlotMode && activeSlotInfo && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 space-y-2">
          <div className="flex gap-2 items-center">
            <ImageIcon className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-sm">Bạn đang tải ảnh cho: {activeSlotInfo.name}</span>
          </div>
          <div className="text-xs text-slate-600 pl-7 space-y-1">
            <p><strong>Technical Slot:</strong> <code className="bg-blue-100/50 px-1 py-0.5 rounded font-mono text-[10px] text-blue-700">{slotParam}</code></p>
            <p><strong>Khuyên dùng:</strong> {activeSlotInfo.size}</p>
          </div>
        </div>
      )}

      {/* Current Image Details */}
      {isCosmeticSlotMode && currentSlotAsset && (
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-4">
          <div className="w-16 h-16 rounded bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
            <img src={currentSlotAsset.url} alt="Ảnh hiện tại" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Ảnh hiện tại</span>
            <p className="text-xs text-slate-600 mt-1">Ảnh mới sẽ thay thế slot này, nhưng file cũ sẽ không bị xóa.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className={isCosmeticSlotMode ? 'hidden' : ''}>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Site Key *</label>
            <select
              value={siteKey}
              onChange={(e) => setSiteKey(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-md p-2 bg-white"
            >
              <option value="main">main</option>
              <option value="beauty">beauty</option>
              <option value="franchise">franchise</option>
              <option value="admin">admin</option>
              <option value="shared">shared</option>
            </select>
          </div>

          <div className={isCosmeticSlotMode ? 'hidden' : ''}>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Asset Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-md p-2 bg-white"
            >
              <option value="image">image</option>
              <option value="video">video</option>
              <option value="og-image">og-image</option>
              <option value="hero-image">hero-image</option>
              <option value="preview-image">preview-image</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Alt Text</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Descriptive alt text"
              className="w-full text-sm border border-slate-300 rounded-md p-2"
            />
          </div>

          <div className={isCosmeticSlotMode ? 'hidden' : ''}>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Brand Asset Slot</label>
            <select
              value={brandSlot}
              onChange={(e) => setBrandSlot(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-md p-2 bg-white"
            >
              <option value="">None</option>
              <option value="logo-main-white">Main Logo White</option>
              <option value="logo-main-dark">Main Logo Dark</option>
              <option value="logo-main-blue">Main Logo Blue</option>
              <option value="logo-cosmetic-blue">Cosmetic Logo Blue</option>
              <option value="logo-admin-dark">Admin Logo Dark</option>
            </select>
          </div>
        </div>

        {/* Selected File local preview card */}
        {previewUrl && selectedFile && (
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Xem trước ảnh sắp tải lên</span>
            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 rounded bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                <img src={previewUrl} alt="Local preview" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Tên file:</strong> {selectedFile.name}</p>
                <p><strong>Dung lượng:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <p><strong>Định dạng:</strong> {selectedFile.type}</p>
                {selectedFile.size > 5 * 1024 * 1024 && (
                  <p className="text-red-600 font-bold flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Cảnh báo: File vượt quá kích thước 5MB khuyên dùng!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Chọn file ảnh *</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            required
            onChange={handleFileChange}
            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="mt-1 text-xs text-slate-500">
            Hỗ trợ định dạng: JPG, PNG, WEBP, AVIF (Tối đa 5MB)
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            <Upload className="h-4 w-4" />
            <span>{isUploading ? 'Đang tải lên Supabase...' : 'Upload File'}</span>
          </button>
          
          {isCosmeticSlotMode && (
            <Link
              href={returnTo}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-md shadow-sm transition-colors"
            >
              Hủy bỏ
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}

export function MediaUploadForm({ mediaAssets = [] }: { mediaAssets?: any[] }) {
  return (
    <Suspense fallback={<div>Loading upload form...</div>}>
      <UploadFormInner mediaAssets={mediaAssets} />
    </Suspense>
  );
}
