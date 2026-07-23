// Auth types for the VAVAW admin ecosystem
// Framework-agnostic — no Next.js or Supabase imports

export type AdminRole = "owner" | "admin" | "editor" | "viewer";

export const ADMIN_ROLES: readonly AdminRole[] = [
  "owner",
  "admin",
  "editor",
  "viewer",
] as const;

export interface AdminUser {
  id: string; // uuid from auth provider
  name: string;
  email: string;
  role: AdminRole;
  status: "active" | "invited" | "disabled";
  created_at: string;
  last_login?: string;
}

export type AuthStatus = "mock" | "not-connected" | "connected";

/** Mock admin user for development and placeholder UI */
export const MOCK_ADMIN_USER: AdminUser = {
  id: "00000000-0000-0000-0000-000000000000",
  name: "VAVAW Owner",
  email: "admin@vavaw.vn",
  role: "owner",
  status: "active",
  created_at: "2025-01-01T00:00:00Z",
  last_login: "2025-01-01T00:00:00Z",
};

/** Check if a role can manage content (create, edit, delete entries) */
export function canManageContent(role: AdminRole): boolean {
  return role === "owner" || role === "admin" || role === "editor";
}

/** Check if a role can manage system settings */
export function canManageSettings(role: AdminRole): boolean {
  return role === "owner" || role === "admin";
}

/** Check if a role can create or update business entries */
export function canManageBusiness(role: AdminRole): boolean {
  return role === "owner" || role === "admin";
}

/** Check if a role can delete business entries */
export function canDeleteBusiness(role: AdminRole): boolean {
  return role === "owner" || role === "admin";
}

/** Check if a role can create or update hero slides */
export function canManageHero(role: AdminRole): boolean {
  return role === "owner" || role === "admin" || role === "editor";
}

/** Check if a role can delete hero slides */
export function canDeleteHero(role: AdminRole): boolean {
  return role === "owner" || role === "admin";
}

/** Check if a role can create or update SEO settings */
export function canManageSeo(role: AdminRole): boolean {
  return role === "owner" || role === "admin" || role === "editor";
}

/** Check if a role can delete SEO settings */
export function canDeleteSeo(role: AdminRole): boolean {
  return role === "owner" || role === "admin";
}

/** Check if a role can create or update content blocks */
export function canManageContentBlocks(role: AdminRole): boolean {
  return role === "owner" || role === "admin" || role === "editor";
}

/** Check if a role can delete content blocks */
export function canDeleteContentBlocks(role: AdminRole): boolean {
  return role === "owner" || role === "admin";
}

/** Check if a role can manage (create, edit, disable) admin users */
export function canManageAdminUsers(role: AdminRole): boolean {
  return role === "owner";
}

/** Check if a role can view admin users */
export function canViewAdminUsers(role: AdminRole): boolean {
  return role === "owner" || role === "admin";
}

/** Check if a role can access CMS Preview */
export function canPreview(role: AdminRole): boolean {
  return role === "owner" || role === "admin" || role === "editor" || role === "viewer";
}

/** Check if a role can export leads as CSV.
 * Restricted to owner and admin because exports contain bulk PII.
 */
export function canExportLeads(role: AdminRole, status: "active" | "disabled"): boolean {
  if (status !== "active") return false;
  return role === "owner" || role === "admin";
}

/** Check if a role can generate public signed preview links */
export function canGeneratePreviewLink(role: AdminRole): boolean {
  return role === "owner" || role === "admin" || role === "editor";
}

/** Check if a role can view audit logs */
export function canViewAuditLogs(profile?: { role: AdminRole; status: 'active' | 'invited' | 'disabled' } | null): boolean {
  if (!profile || profile.status !== 'active') return false;
  return profile.role === 'owner' || profile.role === 'admin';
}
