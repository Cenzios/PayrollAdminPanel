import Decimal from 'decimal.js';

/** Money as received from the admin API (JSON string) or already parsed. */
export type MoneyValue = string | Decimal;

const MONEY_INPUT_PATTERN = /^\d+(\.\d{1,2})?$/;

/**
 * Parses an API money value into a Decimal. Missing or malformed values become 0
 * so a single bad field never breaks a whole page.
 */
export function toDecimal(value: MoneyValue | null | undefined): Decimal {
  if (value instanceof Decimal) return value;
  if (value === null || value === undefined || value === '') return new Decimal(0);
  try {
    return new Decimal(value);
  } catch {
    console.error('Invalid money value received:', value);
    return new Decimal(0);
  }
}

/** Formats money with 2 decimals and thousands separators, e.g. "12,345.60". */
export function formatMoney(value: MoneyValue | null | undefined): string {
  const fixed = toDecimal(value).toFixed(2, Decimal.ROUND_HALF_UP);
  const [intPart, fraction = '00'] = fixed.split('.');
  const isNegative = intPart.startsWith('-');
  const digits = isNegative ? intPart.slice(1) : intPart;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${isNegative ? '-' : ''}${grouped}.${fraction}`;
}

/**
 * Validates a non-negative money amount typed by an admin (max 2 decimals) and
 * returns it as a normalized decimal string for request bodies, or null if invalid.
 */
export function parseMoneyInput(input: string): string | null {
  const trimmed = input.trim();
  if (!MONEY_INPUT_PATTERN.test(trimmed)) return null;
  return new Decimal(trimmed).toFixed(2);
}

/** Percentage share (0-100) of `part` in `total`, as a plain number for display/styling. */
export function percentOf(part: MoneyValue | null | undefined, total: MoneyValue | null | undefined): number {
  const totalDecimal = toDecimal(total);
  if (totalDecimal.lessThanOrEqualTo(0)) return 0;
  return toDecimal(part).dividedBy(totalDecimal).times(100).toDecimalPlaces(2).toNumber();
}
