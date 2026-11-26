/**
 * Range label for a paginated table, e.g. "11–20 of 45".
 * An empty table shows "0–0 of 0" instead of "1–0 of 0".
 */
export function formatPageRange(page: number, pageSize: number, total: number): string {
  if (total <= 0) return '0–0 of 0';
  const start = Math.min((page - 1) * pageSize + 1, total);
  const end = Math.min(page * pageSize, total);
  return `${start}–${end} of ${total}`;
}
