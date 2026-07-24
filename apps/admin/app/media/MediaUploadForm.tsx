"use client";

import { useState, useRef } from 'react';
import { Upload, XCircle, CheckCircle2 } from 'lucide-react';
import { uploadMediaAction } from './actions';

export function MediaUploadForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [siteKey, setSiteKey] = useState('main');
  const [type, setType] = useState('image');
  const [altText, setAltText] = useState('');
  const [brandSlot, setBrandSlot] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) {
      setError('Please select an image file to upload.');
      return;
    }

    const file = files[0];
    const isVideo = file.type.startsWith('video');
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    const maxMb = isVideo ? 50 : 5;

    if (file.size > maxSize) {
      setError(`File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum ${maxMb}MB limit.`);
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('site_key', siteKey);
    formData.append('type', type);
    formData.append('alt_text', altText);
    if (brandSlot) {
      formData.append('brand_slot', brandSlot);
    }

    try {
      const result = await uploadMediaAction(formData);

      if (!result.success) {
        setError(result.error || 'Upload failed.');
      } else {
        setSuccess('Media asset uploaded and registered successfully!');
        setAltText('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (err: any) {
      // If Next.js rejects the request (e.g. 413 Payload Too Large) it throws an Error here
      setError(err.message || 'An unexpected error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded-lg border border-slate-200 space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        <Upload className="h-5 w-5 text-blue-600" />
        <span>Upload New Asset</span>
      </h2>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
          <XCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-md flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
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

          <div>
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

          <div>
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

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Select File *</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime"
            required
            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="mt-1 text-xs text-slate-500">
            Images: JPG, PNG, WEBP, AVIF (Max 5MB) &bull; Videos: MP4, WEBM, MOV (Max 50MB)
          </p>
          {brandSlot && (
            <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 border border-slate-200 p-2 rounded-md">
              <strong>Brand Logo Recommended specs:</strong> PNG transparent, 1200x300px, under 1MB. Do not upload JPG or screenshots for logos. Use white logo for dark backgrounds, dark/blue logo for light backgrounds.
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            <Upload className="h-4 w-4" />
            <span>{isUploading ? 'Uploading to Supabase...' : 'Upload File'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
