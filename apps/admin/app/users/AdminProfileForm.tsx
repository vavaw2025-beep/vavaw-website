"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Mail, Key } from 'lucide-react';
import { createAdminProfileAction, updateAdminProfileAction, inviteAdminUserAction } from './actions';
import { AdminProfileRecord } from '@vavaw/db';
import { AdminRole } from '@vavaw/auth';

interface AdminProfileFormProps {
  initialData?: AdminProfileRecord;
  isEdit?: boolean;
}

export function AdminProfileForm({ initialData, isEdit = false }: AdminProfileFormProps) {
  const router = useRouter();

  const [mode, setMode] = useState<'invite' | 'manual'>('invite');
  const [id, setId] = useState(initialData?.id || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [fullName, setFullName] = useState(initialData?.full_name || '');
  const [role, setRole] = useState<AdminRole>(initialData?.role || 'editor');
  const [status, setStatus] = useState<'active' | 'disabled'>(initialData?.status || 'active');
  const [confirmOwner, setConfirmOwner] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'manual' && !isEdit && !id.trim()) {
      setError('User UID is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('A valid email is required.');
      return;
    }
    
    if (mode === 'invite' && !fullName.trim()) {
      setError('Display name is required for invites.');
      return;
    }

    if (role === 'owner' && mode === 'invite' && !confirmOwner) {
      setError('Please explicitly confirm you want to invite a new Owner.');
      return;
    }

    setIsSubmitting(true);

    let result;
    if (isEdit && initialData?.id) {
      result = await updateAdminProfileAction(initialData.id, {
        email: email.trim(),
        full_name: fullName.trim() || undefined,
        role,
        status,
      });
    } else {
      if (mode === 'invite') {
        result = await inviteAdminUserAction({
          email: email.trim(),
          display_name: fullName.trim(),
          role,
          confirm_owner_invite: confirmOwner,
        });
      } else {
        result = await createAdminProfileAction({
          id: id.trim(),
          email: email.trim(),
          full_name: fullName.trim() || undefined,
          role,
          status,
        });
      }
    }

    if (!result.success) {
      setError(result.error || 'An unexpected error occurred.');
      setIsSubmitting(false);
    } else {
      router.push('/users');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200 text-sm leading-relaxed">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {!isEdit && (
        <div className="flex bg-slate-900 border border-white/10 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setMode('invite')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-colors ${mode === 'invite' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
          >
            <Mail className="h-4 w-4" />
            Invite by Email
          </button>
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-colors ${mode === 'manual' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
          >
            <Key className="h-4 w-4" />
            Manual UID Entry
          </button>
        </div>
      )}

      {!isEdit && mode === 'invite' && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-200 text-sm">
          <ul className="list-disc list-inside space-y-1 opacity-90 text-xs">
            <li>Only active owners can send invites.</li>
            <li>Invited user must accept the email and set a password before logging in.</li>
            <li>Service key must be configured in production for automated invites.</li>
          </ul>
        </div>
      )}

      {!isEdit && mode === 'manual' && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-200 text-sm">
          <p className="font-medium mb-1">Manual User Creation Flow</p>
          <ol className="list-decimal list-inside space-y-1 ml-1 opacity-90 text-xs">
            <li>Create the user in the Supabase Dashboard (Authentication &gt; Users &gt; Add user).</li>
            <li>Copy the generated User UID.</li>
            <li>Paste the UID and matching email below.</li>
          </ol>
        </div>
      )}

      <div className="space-y-6 bg-slate-800/50 p-6 rounded-xl border border-white/5">
        
        {/* User UID */}
        {(mode === 'manual' || isEdit) && (
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-slate-300 mb-1.5">
              Supabase Auth User UID {isEdit ? '' : <span className="text-red-400">*</span>}
            </label>
            <input
              id="id"
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled={isEdit}
              placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
              className="block w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed sm:text-sm"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              {isEdit ? 'UID cannot be changed.' : 'Must exactly match the Supabase Auth UID.'}
            </p>
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@vavaw.vn"
            className="block w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:text-sm"
          />
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-slate-300 mb-1.5">
            Display Name {mode === 'invite' && <span className="text-red-400">*</span>}
          </label>
          <input
            id="full_name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Jane Doe"
            className="block w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1.5">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as AdminRole)}
              className="block w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:text-sm"
            >
              <option value="viewer">Viewer (Read-only)</option>
              <option value="editor">Editor (Manage Content/Media)</option>
              <option value="admin">Admin (Manage Business/Settings)</option>
              <option value="owner">Owner (Full Access & Users)</option>
            </select>
          </div>

          {/* Status */}
          {(mode === 'manual' || isEdit) && (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1.5">
                Account Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'disabled')}
                className="block w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:text-sm"
              >
                <option value="active">Active</option>
                <option value="disabled">Disabled (No Access)</option>
              </select>
              <p className="mt-1.5 text-xs text-slate-500">
                Disabled users cannot log in.
              </p>
            </div>
          )}
        </div>

        {mode === 'invite' && role === 'owner' && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <input
              id="confirmOwner"
              type="checkbox"
              checked={confirmOwner}
              onChange={(e) => setConfirmOwner(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-red-500 focus:ring-red-500/50 focus:ring-offset-slate-900"
            />
            <label htmlFor="confirmOwner" className="text-sm font-medium text-red-200">
              I understand that I am inviting a new Owner with full administrative access.
            </label>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-white/10">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (mode === 'invite' && !isEdit ? 'Sending Invite...' : 'Saving...') : isEdit ? 'Save Changes' : (mode === 'invite' ? 'Send Invite' : 'Create User')}
        </button>
        <Link
          href="/users"
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
