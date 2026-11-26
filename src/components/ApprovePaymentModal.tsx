import { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { formatMoney, parseMoneyInput } from '../utils/money';

/** The invoice an approval settles. Money is a decimal string. */
export interface ApprovalTargetInvoice {
    id: string;
    billingType: string;
    billingMonth: string;
    totalAmount: string;
}

interface ApprovePaymentModalProps {
    customerName: string;
    targetInvoice: ApprovalTargetInvoice | null;
    /** Why the API would refuse this approval (e.g. the linked invoice is already paid). */
    targetInvoiceProblem: string | null;
    isSubmitting: boolean;
    /** Called with the slip amount the admin typed, as a normalized decimal string. */
    onConfirm: (amount: string) => void;
    onCancel: () => void;
}

const NO_INVOICE_MESSAGE = 'This customer has no open invoice, so the approval will be refused.';

/**
 * Approve confirmation: shows the invoice the slip settles and asks the admin to type the amount
 * shown on the bank slip. The API refuses (422) an amount that differs from the invoice total.
 * Mount it with a `key` per document so the typed amount never carries over to another slip.
 */
export default function ApprovePaymentModal({
    customerName,
    targetInvoice,
    targetInvoiceProblem,
    isSubmitting,
    onConfirm,
    onCancel,
}: ApprovePaymentModalProps): JSX.Element {
    const [slipAmount, setSlipAmount] = useState('');
    const parsedAmount = parseMoneyInput(slipAmount);
    const problem = targetInvoice ? targetInvoiceProblem : (targetInvoiceProblem ?? NO_INVOICE_MESSAGE);
    const canSubmit = targetInvoice !== null && problem === null && parsedAmount !== null && !isSubmitting;
    const showFormatHint = slipAmount.trim().length > 0 && parsedAmount === null;

    const submit = (): void => {
        if (canSubmit && parsedAmount !== null) onConfirm(parsedAmount);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div role="dialog" aria-modal="true" aria-labelledby="approve-slip-title" className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <CheckCircle2 className="text-blue-600" size={20} />
                        </div>
                        <h2 id="approve-slip-title" className="text-lg font-bold text-gray-900">Approve bank slip</h2>
                    </div>
                    <button onClick={onCancel} aria-label="Close" className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
                        <X size={18} />
                    </button>
                </div>

                <form
                    className="px-6 py-5 space-y-4"
                    onSubmit={(event) => { event.preventDefault(); submit(); }}
                >
                    <p className="text-sm text-gray-600 leading-6">Approve the bank slip from <span className="font-semibold text-gray-900">{customerName}</span>?</p>

                    {targetInvoice && (
                        <dl className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm grid grid-cols-2 gap-y-1">
                            <dt className="text-gray-500">Invoice</dt>
                            <dd className="text-right font-medium text-gray-900 capitalize">{targetInvoice.billingType.toLowerCase()} · {targetInvoice.billingMonth}</dd>
                            <dt className="text-gray-500">Invoice total</dt>
                            <dd className="text-right font-semibold text-gray-900">Rs {formatMoney(targetInvoice.totalAmount)}</dd>
                        </dl>
                    )}

                    {problem !== null ? (
                        <p role="alert" className="text-sm text-red-600">{problem}</p>
                    ) : (
                        <div className="space-y-1.5">
                            <label htmlFor="slip-amount" className="block text-sm font-medium text-gray-700">Amount shown on the bank slip (Rs)</label>
                            <input
                                id="slip-amount"
                                type="text"
                                inputMode="decimal"
                                autoComplete="off"
                                autoFocus
                                value={slipAmount}
                                onChange={(event) => setSlipAmount(event.target.value)}
                                placeholder="e.g. 2500.00"
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className={`text-xs ${showFormatHint ? 'text-red-600' : 'text-gray-500'}`}>
                                {showFormatHint
                                    ? 'Enter a number with up to 2 decimals, without commas.'
                                    : 'Type the amount exactly as it appears on the slip. The approval is refused if it differs from the invoice total.'}
                            </p>
                        </div>
                    )}

                    <div className="pt-1 flex gap-3 justify-end">
                        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className="px-5 py-2.5 rounded-xl text-white font-semibold transition-colors shadow-lg bg-blue-600 hover:bg-blue-700 shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Approving…' : 'Approve'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
