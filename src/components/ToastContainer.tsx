import React from 'react';
import { useToast } from './ToastContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
    const { toasts, hideToast } = useToast();

    return (
        <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => hideToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default ToastContainer;
