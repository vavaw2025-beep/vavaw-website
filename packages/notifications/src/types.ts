export interface LeadNotificationInput {
  sourceApp: string;
  sourcePath: string;
  leadType: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  companyName: string | null;
  message: string | null;
  leadId: string;
  createdAt: string;
}

export interface EmailSendResult {
  ok: boolean;
  skipped?: boolean;
  error?: string;
}
