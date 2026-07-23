# Lead CSV Export Plan

## Purpose
Allow authorized admin users (owner, admin) to export lead records from the Admin Dashboard as CSV for business follow-up and operations.

## Allowed Roles
| Role | Can Export |
|---|---|
| Owner (active) | ✅ Yes |
| Admin (active) | ✅ Yes |
| Editor | ❌ No |
| Viewer | ❌ No |
| Disabled user | ❌ No |
| Anonymous | ❌ No |

## Export Endpoint
`GET /leads/export`

### Optional Query Parameters
| Parameter | Description | Example |
|---|---|---|
| `status` | Filter by lead status | `new`, `contacted`, `qualified`, `closed`, `spam` |
| `source_app` | Filter by originating app | `main`, `cosmetic`, `beauty`, `franchise` |
| `lead_type` | Filter by type of lead | `general_contact`, `cosmetic_interest`, etc. |
| `date_from` | Filter by minimum creation date (ISO 8601) | `2025-01-01T00:00:00Z` |
| `date_to` | Filter by maximum creation date (ISO 8601) | `2025-12-31T23:59:59Z` |

### Row Limit
- Default: latest 5,000 leads
- Hard maximum: 5,000 rows per export
- Future: pagination / chunked export

## Exported Fields
```
id, created_at, source_app, source_path, lead_type,
status, full_name, email, phone, company_name, message
```

## PII Handling
- Export is server-side only, never client-generated.
- Responses use `Cache-Control: no-store` to prevent caching.
- No PII appears in analytics or monitoring payloads.
- Exported files should be treated as sensitive data and stored securely.

## CSV Injection Protection
If a cell value starts with `=`, `+`, `-`, `@`, tab, or carriage return, it is prefixed with an apostrophe (`'`) to prevent formula execution in spreadsheet apps (Excel, Google Sheets, LibreOffice Calc).

## Privacy Rules
- Do not log exported CSV data.
- Do not send exported lead data to analytics or monitoring.
- Do not allow anonymous or unauthorized access.
- RLS is always respected — the export uses the normal authenticated Supabase client.

## Security
- The export route uses the user's own session (RLS-enforced), NOT the service role key.
- Authorization is double-checked server-side via `canExportLeads(role, status)`.

## Future Improvements
- CRM integration (e.g., HubSpot, Salesforce) to sync leads automatically.
- Scheduled automated exports (e.g., daily/weekly email report).
- Audit log for exports (who exported, when, how many rows).
- Encrypted export storage for compliance.
- Paginated or chunked export for very large lead datasets.
