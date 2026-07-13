import React from 'react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const icons = {
        success: <CheckCircle className="text-green-500" size={20} />,
        error: <AlertCircle className="text-red-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />,
        warning: <AlertTriangle className="text-amber-500" size={20} />,
    };

    const bgColors = {
        success: 'bg-green-50 border-green-100',
        error: 'bg-red-50 border-red-100',
        info: 'bg-blue-50 border-blue-100',
        warning: 'bg-amber-50 border-amber-100',
    };

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-in slide-in-from-right-full duration-300 pointer-events-auto ${bgColors[type]}`}>
            <div className="flex-shrink-0">{icons[type]}</div>
            <div
                className="flex-1 text-sm font-medium text-gray-800"
                dangerouslySetInnerHTML={{ __html: message }}
            />
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
