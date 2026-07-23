export type NormalizedContentBlock = {
  id: string;
  siteKey: string;
  pagePath: string;
  blockType: string;
  content: Record<string, unknown>;
  sortOrder: number;
  isActive: boolean;
};
