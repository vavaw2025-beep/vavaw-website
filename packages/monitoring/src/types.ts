export type MonitoringProvider = 'noop' | 'console' | 'sentry';
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface MonitoringContext {
  app: 'main' | 'beauty' | 'franchise' | 'admin';
  path?: string;
  feature?: string;
  severity?: ErrorSeverity;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface SanitizedError {
  name: string;
  message: string;
}
