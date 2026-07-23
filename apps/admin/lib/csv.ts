/**
 * CSV utility for server-side CSV generation.
 * No external dependencies required.
 * Includes CSV injection protection.
 */

// Characters that can trigger formula evaluation in spreadsheet apps
const INJECTION_PREFIX_RE = /^[=+\-@\t\r]/;

/**
 * Escape a single CSV cell value.
 * - Wraps in double quotes if it contains a comma, double quote, or newline.
 * - Escapes internal double quotes by doubling them.
 * - Prefixes formula-injection characters with a single apostrophe.
 * - Normalizes newlines to a space to keep rows single-line.
 * - Handles null/undefined safely.
 */
export function escapeCsvCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';

  // Convert to string
  let str = String(value);

  // CSV injection protection: prefix dangerous leading characters
  if (INJECTION_PREFIX_RE.test(str)) {
    str = `'${str}`;
  }

  // Normalize newlines — replace with a space to keep rows single-line
  str = str.replace(/\r\n/g, ' ').replace(/[\r\n]/g, ' ');

  // Wrap and escape if necessary
  if (str.includes('"') || str.includes(',') || str.includes("'")) {
    str = `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Convert an array of rows to a complete CSV string.
 * @param headers - Column header names in order.
 * @param rows - Array of arrays of values (in same order as headers).
 */
export function rowsToCsv(headers: string[], rows: (string | number | boolean | null | undefined)[][]): string {
  const headerRow = headers.map(escapeCsvCell).join(',');
  const dataRows = rows.map((row) => row.map(escapeCsvCell).join(','));
  return [headerRow, ...dataRows].join('\r\n');
}
