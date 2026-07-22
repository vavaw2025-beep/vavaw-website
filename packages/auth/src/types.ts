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
