import { MonitoringContext, SanitizedError } from './types';

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

    if (provider === 'console' && process.env.NODE_ENV !== 'production') {
      console.error('[Monitoring] Captured Error:', {
        ...safeError,
        context,
      });
    }
    // Sentry placeholder could go here
  } catch (e) {
    // Never throw from monitoring
  }
}

export function captureMessage(message: string, context: MonitoringContext) {
  try {
    if (!isMonitoringEnabled()) return;

    const provider = getMonitoringProvider();

    if (provider === 'console' && process.env.NODE_ENV !== 'production') {
      console.warn('[Monitoring] Captured Message:', {
        message: message.slice(0, 500),
        context,
      });
    }
    // Sentry placeholder could go here
  } catch (e) {
    // Never throw from monitoring
  }
}
