import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmTone?: 'danger' | 'primary';
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    confirmTone = 'danger',
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    const confirmButtonClass =
        confirmTone === 'danger'
            ? 'bg-red-600 hover:bg-red-700 shadow-red-100'
            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100';

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                            <AlertTriangle className="text-amber-500" size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 py-5">
                    <p className="text-sm text-gray-600 leading-6">{message}</p>
                </div>

                <div className="px-6 pb-6 flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-5 py-2.5 rounded-xl text-white font-semibold transition-colors shadow-lg ${confirmButtonClass}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;