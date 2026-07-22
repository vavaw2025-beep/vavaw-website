import { AdminRole, MOCK_ADMIN_USER } from '@vavaw/auth';
import { getAdminDataSourceMode } from './data-source';
import { getAdminServerSupabaseClient } from './supabase-server';

export interface CurrentAdminProfile {
  id: string;
  email: string;
  role: AdminRole;
  status: 'active' | 'disabled';
}

export async function getCurrentAdminProfile(): Promise<CurrentAdminProfile | null> {
  const mode = getAdminDataSourceMode();

  if (mode !== 'supabase') {
    return {
      id: MOCK_ADMIN_USER.id,
      email: MOCK_ADMIN_USER.email,
      role: MOCK_ADMIN_USER.role,
      status: MOCK_ADMIN_USER.status as 'active' | 'disabled',
    };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('id, email, role, status')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      email: profile.email,
      role: profile.role as AdminRole,
      status: profile.status as 'active' | 'disabled',
    };
  } catch (err) {
    return null;
  }
}
