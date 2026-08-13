import { trackEvent } from '@vavaw/analytics';

export type RevalidateInput = {
  app: 'main' | 'beauty' | 'franchise' | 'all';
  paths: string[];
  reason: string;
};

export type RevalidateResult = {
  ok: boolean;
  skipped?: boolean;
  results?: Array<{ app: string; success: boolean; paths?: string[]; error?: string }>;
  error?: string;
};

export async function triggerPublicRevalidation(input: RevalidateInput): Promise<RevalidateResult> {
  const secret = process.env.REVALIDATION_SECRET;

  // Revalidation is active whenever REVALIDATION_SECRET is configured.
  // CMS_REVALIDATION_ENABLED is kept as an explicit opt-out escape hatch only.
  const isExplicitlyDisabled = process.env.CMS_REVALIDATION_ENABLED === 'false';

  if (isExplicitlyDisabled) {
    return { ok: true, skipped: true, error: 'Revalidation explicitly disabled via CMS_REVALIDATION_ENABLED=false' };
  }

  if (!secret) {
    console.warn(
      `[revalidate] REVALIDATION_SECRET not set — skipping cross-app revalidation for app="${input.app}" paths=${input.paths.join(',')}. ` +
      'Public homepage will refresh via revalidate=60 fallback.'
    );
    return { ok: true, skipped: true, error: 'REVALIDATION_SECRET not configured' };
  }

  const urls: { name: string; url: string | undefined }[] = [];

  if (input.app === 'main' || input.app === 'all') {
    urls.push({ name: 'main', url: process.env.MAIN_REVALIDATE_URL });
  }
  if (input.app === 'beauty' || input.app === 'all') {
    urls.push({ name: 'beauty', url: process.env.BEAUTY_REVALIDATE_URL });
  }
  if (input.app === 'franchise' || input.app === 'all') {
    urls.push({ name: 'franchise', url: process.env.FRANCHISE_REVALIDATE_URL });
  }

  const results: RevalidateResult['results'] = [];
  let allOk = true;

  for (const target of urls) {
    if (!target.url) {
      results.push({ app: target.name, success: false, error: 'URL not configured' });
      allOk = false;
      continue;
    }

    try {
      const res = await fetch(target.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secret}`
        },
        body: JSON.stringify({
          paths: input.paths,
          source: 'admin',
          reason: input.reason
        })
      });

      if (!res.ok) {
        const text = await res.text();
        results.push({ app: target.name, success: false, error: `HTTP ${res.status}: ${text.substring(0, 50)}` });
        allOk = false;
        
        trackEvent('cms_revalidation_failed', {
          app: 'admin',
          metadata: { targetApp: target.name, paths: input.paths.join(','), reason: input.reason, error: `HTTP ${res.status}` }
        });
      } else {
        const data = await res.json();
        results.push({ app: target.name, success: true, paths: data.paths });
        
        trackEvent('cms_revalidation_triggered', {
          app: 'admin',
          metadata: { targetApp: target.name, paths: input.paths.join(','), reason: input.reason }
        });
      }
    } catch (err: any) {
      results.push({ app: target.name, success: false, error: err?.message || 'Network error' });
      allOk = false;
      
      trackEvent('cms_revalidation_failed', {
        app: 'admin',
        metadata: { targetApp: target.name, paths: input.paths.join(','), reason: input.reason, error: err?.message || 'Network error' }
      });
    }
  }

  return { ok: allOk, results };
}
