import React, { useState, useEffect } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';

interface EditPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    plan: any;
}

const EditPlanModal: React.FC<EditPlanModalProps> = ({
    isOpen,
    onClose,
    onSave,
    plan,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        employeePrice: 0,
        registrationFee: 0,
        maxEmployees: 0,
        additionalSlotPrice: 150, // Default or from slice
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name || '',
                employeePrice: plan.price || 0,
                registrationFee: plan.registrationFee || 0,
                maxEmployees: plan.maxEmployees || 0,
                additionalSlotPrice: 150,
            });
        }
    }, [plan]);

    if (!isOpen || !plan) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave({
                id: plan.id,
                data: {
                    name: formData.name,
                    employeePrice: formData.employeePrice,
                    registrationFee: formData.registrationFee,
                    maxEmployees: formData.maxEmployees,
                },
            });
            onClose();
        } catch (error) {
            console.error('Failed to update plan:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleNumberChange = (field: string, value: string) => {
        const num = parseInt(value) || 0;
        setFormData(prev => ({ ...prev, [field]: num }));
    };

    const increment = (field: string) => {
        setFormData(prev => ({ ...prev, [field]: (prev[field as keyof typeof prev] as number) + 1 }));
    };

    const decrement = (field: string) => {
        setFormData(prev => ({ ...prev, [field]: Math.max(0, (prev[field as keyof typeof prev] as number) - 1) }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Edit {plan.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-8 space-y-6">
                        {/* Plan Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-2">Plan Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-800"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Price / Emp */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2">Price / Emp (RS.)</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={formData.employeePrice}
                                        onChange={(e) => handleNumberChange('employeePrice', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-800"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                                        <button type="button" onClick={() => increment('employeePrice')} className="text-gray-400 hover:text-gray-600 p-0.5"><ChevronUp size={16} /></button>
                                        <button type="button" onClick={() => decrement('employeePrice')} className="text-gray-400 hover:text-gray-600 p-0.5"><ChevronDown size={16} /></button>
                                    </div>
                                </div>
                            </div>

                            {/* Registration Fee */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2">Registration Fee (RS.)</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={formData.registrationFee}
                                        onChange={(e) => handleNumberChange('registrationFee', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-800"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                                        <button type="button" onClick={() => increment('registrationFee')} className="text-gray-400 hover:text-gray-600 p-0.5"><ChevronUp size={16} /></button>
                                        <button type="button" onClick={() => decrement('registrationFee')} className="text-gray-400 hover:text-gray-600 p-0.5"><ChevronDown size={16} /></button>
                                    </div>
                                </div>
                            </div>

                            {/* Max Employees */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2">Max Employees</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={formData.maxEmployees}
                                        onChange={(e) => handleNumberChange('maxEmployees', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-800"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                                        <button type="button" onClick={() => increment('maxEmployees')} className="text-gray-400 hover:text-gray-600 p-0.5"><ChevronUp size={16} /></button>
                                        <button type="button" onClick={() => decrement('maxEmployees')} className="text-gray-400 hover:text-gray-600 p-0.5"><ChevronDown size={16} /></button>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Slot Price (Non-editable as requested) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2">Additional Slot Price</label>
                                <input
                                    type="text"
                                    value={formData.additionalSlotPrice}
                                    readOnly
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none transition-all font-medium text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-10 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-10 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPlanModal;
