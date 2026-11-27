/**
 * Invoice status display (PENDING | PAID | OVERDUE | FAILED | VOID). A VOID invoice belonged to a
 * plan that was replaced before it was paid: it is not owed, not payable and not revenue.
 */

const INVOICE_STATUS_LABELS: Record<string, string> = {
    PAID: 'Paid',
    PENDING: 'Pending',
    OVERDUE: 'Overdue',
    FAILED: 'Failed',
    VOID: 'Void',
};

/** Badge colours: paid green, pending orange, overdue/failed red, void neutral grey. */
const INVOICE_STATUS_STYLES: Record<string, string> = {
    PAID: 'bg-green-50 text-green-600 border-green-100',
    PENDING: 'bg-orange-50 text-orange-600 border-orange-100',
    OVERDUE: 'bg-red-50 text-red-600 border-red-100',
    FAILED: 'bg-red-50 text-red-600 border-red-100',
    VOID: 'bg-gray-100 text-gray-500 border-gray-200',
};

const NEUTRAL_STYLE = 'bg-gray-50 text-gray-600 border-gray-100';

export const invoiceStatusLabel = (status: string): string => INVOICE_STATUS_LABELS[status] ?? status;

export const invoiceStatusStyle = (status: string): string => INVOICE_STATUS_STYLES[status] ?? NEUTRAL_STYLE;
