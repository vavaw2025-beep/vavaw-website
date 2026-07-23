import { MonitoringContext, SanitizedError } from './types';
import { scrubPII } from './scrubber';

let sentryAdapter: {
  captureException: (error: any, context: any) => void;
  captureMessage: (message: string, context: any) => void;
} | null = null;

export function registerSentryAdapter(adapter: any) {
  sentryAdapter = adapter;
}

export function isMonitoringEnabled(): boolean {
  return process.env.NEXT_PUBLIC_MONITORING_ENABLED === 'true';
}

export function getMonitoringProvider(): string {
  return process.env.NEXT_PUBLIC_MONITORING_PROVIDER || 'console';
}

export function sanitizeError(error: any): SanitizedError {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message.slice(0, 500),
    };
  }
  if (typeof error === 'string') {
    return {
      name: 'Error',
      message: error.slice(0, 500),
    };
  }
  return {
    name: 'UnknownError',
    message: 'An unknown error occurred.',
  };
}

export function captureError(error: any, context: MonitoringContext) {
  try {
    if (!isMonitoringEnabled()) return;

    const provider = getMonitoringProvider();
    const safeError = sanitizeError(error);
    const scrubbedContext = scrubPII(context);

    if (provider === 'console' && process.env.NODE_ENV !== 'production') {
      console.error('[Monitoring] Captured Error:', {
        ...safeError,
        context: scrubbedContext,
      });
    } else if (provider === 'sentry') {
      if (sentryAdapter) {
        sentryAdapter.captureException(error, {
          contexts: {
            vavaw: scrubbedContext
          }
        });
      }
    }
  } catch (e) {
    // Never throw from monitoring
  }
}

export function captureMessage(message: string, context: MonitoringContext) {
  try {
    if (!isMonitoringEnabled()) return;

    const provider = getMonitoringProvider();
    const scrubbedContext = scrubPII(context);

    if (provider === 'console' && process.env.NODE_ENV !== 'production') {
      console.warn('[Monitoring] Captured Message:', {
        message: message.slice(0, 500),
        context: scrubbedContext,
      });
    } else if (provider === 'sentry') {
      if (sentryAdapter) {
        sentryAdapter.captureMessage(message, {
          contexts: {
            vavaw: scrubbedContext
          }
        });
      }
    }
  } catch (e) {
    // Never throw from monitoring
  }
}
