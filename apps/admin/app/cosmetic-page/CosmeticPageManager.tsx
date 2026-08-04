"use client";

import { useState } from 'react';
import { updateContentBlockAction } from '../content/actions';
import { ContentBlockRecord, MediaAssetRecord } from '@vavaw/db';
import Link from 'next/link';

interface CosmeticPageManagerProps {
  initialBlocks: ContentBlockRecord[];
  mediaAssets: MediaAssetRecord[];
  role: string;
}

const REQUIRED_SLOTS = [
  'cosmetic-product-luminous-set',
  'cosmetic-product-regenaglow-cream',
  'cosmetic-product-calmiance-gel',
  'cosmetic-product-renew-ampoule',
  'cosmetic-product-p30-moisturizer',
  'cosmetic-product-p30-toner',
  'cosmetic-premium-program',
  'cosmetic-gallery-ritual-panel',
  'cosmetic-gallery-product-set',
  'cosmetic-gallery-texture',
  'cosmetic-gallery-clinic',
  'cosmetic-gallery-skin',
  'cosmetic-gallery-serum',
  'cosmetic-gallery-packaging'
];

export function CosmeticPageManager({ initialBlocks, mediaAssets, role }: CosmeticPageManagerProps) {
  const [blocks, setBlocks] = useState<ContentBlockRecord[]>(initialBlocks);
  const [editingBlock, setEditingBlock] = useState<ContentBlockRecord | null>(null);
  
  // Editor state
  const [editTitle, setEditTitle] = useState('');
  const [editEyebrow, setEditEyebrow] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCtaLabel, setEditCtaLabel] = useState('');
  const [editCtaHref, setEditCtaHref] = useState('');
  const [editItemsJson, setEditItemsJson] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canEdit = ['owner', 'admin', 'editor'].includes(role);

  const missingSlotsCount = REQUIRED_SLOTS.filter(slot => !mediaAssets.find(m => m.metadata?.slot === slot)).length;

  const startEditing = (block: ContentBlockRecord) => {
    setEditingBlock(block);
    setError(null);
    const content = block.content || {};
    setEditTitle(content.title || '');
    setEditEyebrow(content.eyebrow || '');
    setEditDesc(content.description || '');
    setEditCtaLabel(content.ctaLabel || '');
    setEditCtaHref(content.ctaHref || '');
    setEditItemsJson(content.items ? JSON.stringify(content.items, null, 2) : '');
    setEditIsActive(block.is_active);
  };

  const handleSave = async () => {
    if (!editingBlock) return;
    setError(null);
    setIsSaving(true);
    
    let parsedItems = undefined;
    if (editItemsJson.trim()) {
      try {
        parsedItems = JSON.parse(editItemsJson);
        if (parsedItems && !Array.isArray(parsedItems) && typeof parsedItems === 'object') {
          // Sometimes items is actually an object like featuredProduct, it's fine.
        }
      } catch (e) {
        setError("Content JSON is invalid. Please check commas and brackets.");
        setIsSaving(false);
        return;
      }
    }

    const newContent = {
      ...editingBlock.content,
      title: editTitle,
      eyebrow: editEyebrow,
      description: editDesc,
      ctaLabel: editCtaLabel,
      ctaHref: editCtaHref,
    };
    if (parsedItems !== undefined) {
      newContent.items = parsedItems;
    }

    const result = await updateContentBlockAction(editingBlock.id, {
      content: newContent,
      is_active: editIsActive,
    });

    if (!result.success) {
      setError(result.error || "Failed to save");
    } else {
      setBlocks(blocks.map(b => b.id === editingBlock.id ? { ...b, content: newContent, is_active: editIsActive } : b));
      setEditingBlock(null);
    }
    
    setIsSaving(false);
  };

  return (
    <div className="space-y-8">
      {/* Header & Status */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Cosmetic Page</h1>
        <p className="text-sm text-slate-500 mb-6">Manage the lower sections of the /cosmetic page.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Blocks</div>
            <div className="text-2xl font-bold text-slate-900">{blocks.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Missing Media Slots</div>
            <div className={`text-2xl font-bold ${missingSlotsCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {missingSlotsCount}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-center items-start">
            <Link 
              href="/cosmetic" 
              target="_blank"
              className="text-sm text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
            >
              Preview Live Page ↗
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sections List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Page Sections</h2>
          {blocks.length === 0 ? (
            <div className="bg-white p-6 rounded-lg border border-slate-200 text-center text-sm text-slate-500">
              No content blocks found. Please run the seed script.
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
              {blocks.map(block => (
                <div key={block.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{block.content?.title || block.block_type}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{block.block_type}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                      block.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {block.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {canEdit && (
                      <button 
                        onClick={() => startEditing(block)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Media Slots Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Media Slots</h2>
            <Link href="/media" className="text-xs font-medium text-blue-600 hover:underline">
              Go to Upload
            </Link>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm max-h-[600px] overflow-y-auto">
            {REQUIRED_SLOTS.map(slot => {
              const asset = mediaAssets.find(m => m.metadata?.slot === slot);
              return (
                <div key={slot} className="p-3 border-b border-slate-100 last:border-0 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {asset ? (
                      <img src={asset.url} alt={slot} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-[10px] text-slate-400 font-bold">X</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-900 truncate" title={slot}>{slot}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                      {asset ? (
                        <span className="text-emerald-600 font-medium">Uploaded</span>
                      ) : (
                        <span className="text-amber-600 font-medium">Missing</span>
                      )}
                    </div>
                  </div>
                  {!asset && canEdit && (
                    <Link 
                      href={`/media?purpose=cosmetic-page-media&slot=${slot}`}
                      className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                    >
                      Upload
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Editor Modal/Form */}
      {editingBlock && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Edit Section</h3>
                <p className="text-xs font-mono text-slate-500">{editingBlock.block_type}</p>
              </div>
              <button 
                onClick={() => setEditingBlock(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full text-sm p-2 border border-slate-300 rounded-md" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Eyebrow</label>
                  <input 
                    type="text" 
                    value={editEyebrow} 
                    onChange={e => setEditEyebrow(e.target.value)}
                    className="w-full text-sm p-2 border border-slate-300 rounded-md" 
                  />
                </div>
                <div className="flex items-center mt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsActive}
                      onChange={(e) => setEditIsActive(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-bold text-slate-700 uppercase">Is Active</span>
                  </label>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                  <textarea 
                    value={editDesc} 
                    onChange={e => setEditDesc(e.target.value)}
                    rows={3}
                    className="w-full text-sm p-2 border border-slate-300 rounded-md" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">CTA Label</label>
                  <input 
                    type="text" 
                    value={editCtaLabel} 
                    onChange={e => setEditCtaLabel(e.target.value)}
                    className="w-full text-sm p-2 border border-slate-300 rounded-md" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">CTA Href</label>
                  <input 
                    type="text" 
                    value={editCtaHref} 
                    onChange={e => setEditCtaHref(e.target.value)}
                    className="w-full text-sm p-2 border border-slate-300 rounded-md" 
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">JSON Content (items)</label>
                  <textarea 
                    value={editItemsJson} 
                    onChange={e => setEditItemsJson(e.target.value)}
                    rows={8}
                    className="w-full text-xs font-mono p-2 border border-slate-300 rounded-md bg-slate-50" 
                    placeholder="[ { ... } ]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Must be valid JSON array/object.</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
              <button 
                onClick={() => setEditingBlock(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
