export function isValidImageUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed === '-') return false;
  if (trimmed.includes('PASTE_')) return false;
  if (trimmed.toLowerCase().startsWith('javascript:')) return false;
  if (trimmed.toLowerCase().startsWith('data:')) return false;
  
  // Must be http or https
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return false;
  }
  
  return true;
}
