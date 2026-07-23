export function scrubPII(obj: any, maxDepth = 3, currentDepth = 0): any {
  if (currentDepth > maxDepth) return '[Truncated]';
  if (obj === null || obj === undefined) return obj;

  if (typeof obj !== 'object') {
    if (typeof obj === 'string' && obj.length > 1000) {
      return obj.slice(0, 1000) + '...[Truncated]';
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => scrubPII(item, maxDepth, currentDepth + 1));
  }

  const redactedKeys = [
    'email', 'phone', 'password', 'token', 'secret', 'key', 'message',
    'full_name', 'fullName', 'company_name', 'companyName', 'lead', 'user'
  ];

  const scrubbed: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const lowerKey = key.toLowerCase();
      const isRedacted = redactedKeys.some(rKey => lowerKey.includes(rKey.toLowerCase()));
      
      if (isRedacted) {
        scrubbed[key] = '[REDACTED]';
      } else {
        scrubbed[key] = scrubPII(obj[key], maxDepth, currentDepth + 1);
      }
    }
  }

  return scrubbed;
}
