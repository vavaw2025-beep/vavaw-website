export type AdminRole = "owner" | "admin" | "editor" | "viewer";

export interface AdminUser {
  id: string; // uuid from auth provider
  email: string;
  role: AdminRole;
  created_at: string;
  last_login?: string;
}

export type AuthStatus = "authenticated" | "unauthenticated" | "loading";
