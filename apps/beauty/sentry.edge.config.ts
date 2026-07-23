import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_MONITORING_ENABLED === 'true' ? process.env.SENTRY_DSN : undefined,
  enabled: process.env.NEXT_PUBLIC_MONITORING_ENABLED === 'true' && process.env.NEXT_PUBLIC_MONITORING_PROVIDER === 'sentry',
  tracesSampleRate: 0.1,
  debug: false,
});
import { registerSentryAdapter } from '@vavaw/monitoring';
registerSentryAdapter(Sentry);
