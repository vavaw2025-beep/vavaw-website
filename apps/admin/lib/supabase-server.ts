import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@vavaw/auth';

export async function getAdminServerSupabaseClient() {
  const cookieStore = await cookies();
  return createServerSupabaseClient(cookieStore);
}
