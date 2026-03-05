import React from 'react';
import { X } from 'lucide-react';

interface UserDetailsModalSkeletonProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserDetailsModalSkeleton: React.FC<UserDetailsModalSkeletonProps> = ({
    isOpen,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between animate-pulse">
                    <div className="flex items-center space-x-5">
                        <div className="w-16 h-16 rounded-full bg-gray-200" />
                        <div className="space-y-2">
                            <div className="h-6 w-48 bg-gray-200 rounded" />
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-20 bg-gray-200 rounded-full" />
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-8 animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column - Account Info */}
                        <div className="space-y-6">
                            {/* Current Plan Card */}
                            <div className="p-5 border border-gray-100 rounded-2xl shadow-sm bg-white">
                                <div className="flex items-center justify-between">
                                    <div className="h-4 w-24 bg-gray-200 rounded" />
                                    <div className="h-6 w-32 bg-gray-200 rounded" />
                                </div>
                            </div>

                            {/* Purchase Date Card */}
                            <div className="p-5 border border-gray-100 rounded-2xl shadow-sm bg-white">
                                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                                <div className="h-6 w-32 bg-gray-200 rounded" />
                            </div>

                            {/* Expiry Date Card */}
                            <div className="p-5 border border-gray-100 rounded-2xl shadow-sm bg-white">
                                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                                <div className="h-6 w-32 bg-gray-200 rounded" />
                            </div>

                            {/* Extra Slots Taken Card */}
                            <div className="p-5 bg-gray-50/50 border border-gray-100 rounded-2xl flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-32 bg-gray-200 rounded" />
                                    <div className="h-4 w-24 bg-gray-200 rounded" />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Companies List */}
                        <div className="flex flex-col h-full min-h-[400px]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-6 w-24 bg-gray-200 rounded" />
                                <div className="h-5 w-8 bg-gray-200 rounded-full" />
                            </div>
                            <div className="flex-1 bg-gray-50/30 border border-gray-100 rounded-2xl overflow-hidden p-4 space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 w-32 bg-gray-200 rounded" />
                                            <div className="h-3 w-20 bg-gray-200 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Billing Section */}
                    <div className="mt-8 p-8 bg-gray-50 border border-gray-100 rounded-3xl flex flex-col md:flex-row md:items-center justify-between">
                        <div className="mb-4 md:mb-0 space-y-2">
                            <div className="h-4 w-24 bg-gray-200 rounded" />
                            <div className="h-8 w-40 bg-gray-200 rounded" />
                        </div>
                        <div className="text-right space-y-2">
                            <div className="h-4 w-32 bg-gray-200 rounded ml-auto" />
                            <div className="h-6 w-24 bg-gray-200 rounded ml-auto" />
                        </div>
                    </div>

                    {/* Footer Action Button */}
                    <div className="mt-8 flex justify-end">
                        <div className="h-14 w-64 bg-gray-200 rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsModalSkeleton;
