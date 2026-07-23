import { AnalyticsEventName, AnalyticsEventPayload, AnalyticsProvider } from './types';

// Memoize config for performance
let isEnabled: boolean | null = null;
let provider: AnalyticsProvider | null = null;

export function isAnalyticsEnabled(): boolean {
  if (isEnabled === null) {
    // Determine enabled state from env. Defaults to false.
    const envValue = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED;
    isEnabled = envValue === 'true';
  }
  return isEnabled;
}

export function getAnalyticsProvider(): AnalyticsProvider {
  if (provider === null) {
    const envValue = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER as AnalyticsProvider;
    const validProviders: AnalyticsProvider[] = ['noop', 'console', 'vercel', 'custom'];
    
    provider = validProviders.includes(envValue) ? envValue : 'noop';
  }
  return provider;
}

/**
 * Tracks an analytics event using the configured provider.
 * This function wraps the tracking logic in a try-catch to ensure it never throws.
 */
export function trackEvent(name: AnalyticsEventName, payload: AnalyticsEventPayload): void {
  try {
    if (!isAnalyticsEnabled()) return;

    const currentProvider = getAnalyticsProvider();

    if (currentProvider === 'noop') {
      return;
    }

    if (currentProvider === 'console') {
      if (process.env.NODE_ENV === 'development') {
        console.info(`[Analytics] ${name}`, payload);
      }
      return;
    }

    if (currentProvider === 'vercel') {
      // Placeholder for Vercel Web Analytics integration
      // e.g. va.track(name, payload)
      if (process.env.NODE_ENV === 'development') {
        console.info(`[Analytics:Vercel] ${name}`, payload);
      }
      return;
    }

    if (currentProvider === 'custom') {
      // Placeholder for future custom provider logic
      if (process.env.NODE_ENV === 'development') {
        console.info(`[Analytics:Custom] ${name}`, payload);
      }
      return;
    }

  } catch (error) {
    // Suppress errors to prevent analytics from crashing the app
    if (process.env.NODE_ENV === 'development') {
      console.error('[Analytics Error]', error);
    }
  }
}
