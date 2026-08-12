export function getSystemUpdateUrl(reason: string, from?: string): string {
  const params = new URLSearchParams();
  params.set("reason", reason);
  if (from) params.set("from", from);
  return `/system-update?${params.toString()}`;
}
