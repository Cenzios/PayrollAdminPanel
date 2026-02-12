import React from 'react';
import { X, UserPlus, CreditCard, Calendar, Mail } from 'lucide-react';

interface UserDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData: any;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
    isOpen,
    onClose,
    userData,
}) => {
    if (!isOpen || !userData) return null;

    const { user, currentSubscription, companies, stats } = userData;
    const initials = user.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '??';

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-5">
                        <div className="w-16 h-16 rounded-full bg-[#008080] flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                            {initials}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
                            <p className="text-gray-500 font-medium">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="bg-green-50 text-green-600 text-sm font-semibold px-4 py-1.5 rounded-full border border-green-100">
                            {currentSubscription?.status || 'Active'}
                        </span>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column - Account Info */}
                        <div className="space-y-6">
                            {/* Current Plan Card */}
                            <div className="p-5 border border-gray-100 rounded-2xl shadow-sm bg-white hover:border-blue-100 transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Plan</span>
                                    <span className="text-xl font-bold text-blue-600">{currentSubscription?.planName || 'No Plan'}</span>
                                </div>
                            </div>

                            {/* Purchase Date Card */}
                            <div className="p-5 border border-gray-100 rounded-2xl shadow-sm bg-white hover:border-gray-200 transition-colors">
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Purchase Date</span>
                                <span className="text-lg font-bold text-gray-800">{formatDate(currentSubscription?.startDate)}</span>
                            </div>

                            {/* Expiry Date Card */}
                            <div className="p-5 border border-gray-100 rounded-2xl shadow-sm bg-white hover:border-gray-200 transition-colors">
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Expiry Date</span>
                                <span className="text-lg font-bold text-gray-800">{formatDate(currentSubscription?.endDate)}</span>
                            </div>

                            {/* Extra Slots Taken Card */}
                            <div className="p-5 bg-gray-50/50 border border-gray-100 rounded-2xl flex items-center space-x-4">
                                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                                    <UserPlus size={24} />
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Extra Slots Taken</span>
                                    <div className="flex items-center space-x-1 mt-1">
                                        <span className="text-sm font-bold text-orange-500">{stats.totalEmployees} slots used</span>
                                        <span className="text-sm text-gray-400 font-medium">out of</span>
                                        <span className="text-sm font-bold text-gray-900">{currentSubscription?.maxEmployees + currentSubscription?.extraSlots}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Companies List */}
                        <div className="flex flex-col h-full min-h-[400px]">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                Companies
                                <span className="ml-2 bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {companies?.length || 0}
                                </span>
                            </h3>
                            <div className="flex-1 bg-gray-50/30 border border-gray-100 rounded-2xl overflow-hidden flex flex-col">
                                <div className="flex-1 overflow-y-auto">
                                    {companies && companies.length > 0 ? (
                                        companies.map((company: any, index: number) => (
                                            <div
                                                key={company.id}
                                                className={`px-6 py-4 flex items-center justify-between hover:bg-white transition-colors ${index !== companies.length - 1 ? 'border-b border-gray-50' : ''
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 rounded-full bg-[#008080] flex items-center justify-center text-white font-bold text-sm">
                                                        {company.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800">{company.name}</p>
                                                        <p className="text-xs text-gray-400 font-medium">{company.employeeCount} Employees</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                                            <p>No companies registered yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Billing Section */}
                    <div className="mt-8 p-8 bg-blue-50/50 border border-blue-100 rounded-3xl flex flex-col md:flex-row md:items-center justify-between">
                        <div className="mb-4 md:mb-0">
                            <p className="text-blue-600 font-semibold mb-1">Monthly Bill:</p>
                            <div className="flex items-baseline space-x-2">
                                <span className="text-3xl font-extrabold text-blue-700">RS: {stats.monthlyBill.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-blue-600 font-semibold mb-1">Next payment date</p>
                            <p className="text-lg font-bold text-blue-700">{formatDate(stats.nextPaymentDate)}</p>
                        </div>
                    </div>

                    {/* Footer Action Button */}
                    <div className="mt-8 flex justify-end">
                        <button className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-blue-200 group">
                            <Mail size={20} className="group-hover:translate-x-0.5 transition-transform" />
                            <span>Send purchase history to the email</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsModal;
