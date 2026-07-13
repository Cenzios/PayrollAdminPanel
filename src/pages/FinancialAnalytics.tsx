import { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setPageTitle } from '../store/uiSlice';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/axios';
import { DollarSign, CreditCard, Receipt, AlertCircle, Search, Calendar, ArrowRight, Download, Mail, Target } from 'lucide-react';
import StatsCard from '../components/StatsCard';

const FinancialAnalytics = () => {
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        dispatch(setPageTitle({ title: 'Financial & Invoice Analytics', subtitle: 'Overview of revenue and billing' }));
    }, [dispatch]);

    const { data: statsData, isLoading: isStatsLoading } = useQuery({
        queryKey: ['financialStats'],
        queryFn: async () => {
            const response = await api.get('/admin/revenue/summary');
            return response.data.data;
        },
    });

    const { data: overdueData, isLoading: isOverdueLoading } = useQuery({
        queryKey: ['overdueInvoices'],
        queryFn: async () => {
            const response = await api.get('/admin/revenue/invoices', {
                params: { status: 'OVERDUE', limit: 5 }
            });
            return response.data.data.invoices;
        },
    });

    const { data: searchResults, isLoading: isSearching } = useQuery({
        queryKey: ['userInvoices', debouncedSearch],
        queryFn: async () => {
            const response = await api.get('/admin/revenue/invoices', {
                params: { search: debouncedSearch, limit: 10 }
            });
            return response.data.data.invoices;
        },
        enabled: debouncedSearch.length > 2,
    });

    if (isStatsLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium tracking-wide">Loading financial insights...</p>
                </div>
            </div>
        );
    }

    const onlinePercent = statsData?.totalRevenue > 0 ? (statsData.onlineRevenue / statsData.totalRevenue) * 100 : 0;
    const manualPercent = statsData?.totalRevenue > 0 ? (statsData.manualRevenue / statsData.totalRevenue) * 100 : 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* Revenue Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="TOTAL REVENUE"
                    value={`Rs ${statsData?.totalRevenue?.toLocaleString() || 0}`}
                    icon={DollarSign}
                    iconBgColor="bg-blue-50"
                    iconColor="text-blue-600"
                // trend={{ value: 12, isUp: true, label: 'vs last month' }}
                />
                <StatsCard
                    title="ONLINE REVENUE"
                    value={`Rs ${statsData?.onlineRevenue?.toLocaleString() || 0}`}
                    icon={CreditCard}
                    iconBgColor="bg-indigo-50"
                    iconColor="text-indigo-600"
                // trend={{ value: onlinePercent.toFixed(1) + '%', isUp: true, label: 'of total' }}
                />
                <StatsCard
                    title="MANUAL REVENUE"
                    value={`Rs ${statsData?.manualRevenue?.toLocaleString() || 0}`}
                    icon={Receipt}
                    iconBgColor="bg-amber-50"
                    iconColor="text-amber-600"
                // trend={{ value: manualPercent.toFixed(1) + '%', isUp: false, label: 'of total' }}
                />
                <StatsCard
                    title="OVERDUE INVOICES"
                    value={statsData?.overdueCount?.toString() || "0"}
                    icon={AlertCircle}
                    iconBgColor="bg-red-50"
                    iconColor="text-red-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Overdue Invoices List */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Critical Overdue</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Top unpaid invoices requiring attention</p>
                        </div>
                        <span className="bg-red-50 text-red-600 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border border-red-100">Urgent</span>
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-[400px] overscroll-contain">
                        {isOverdueLoading ? (
                            <div className="p-10 text-center text-gray-400">Loading...</div>
                        ) : overdueData?.length > 0 ? (
                            overdueData.map((invoice: any, index: number) => (
                                <div key={invoice.id} className={`p-5 flex items-center justify-between hover:bg-gray-50 transition-colors ${index !== overdueData.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                                            {invoice.user.fullName.split(' ').map((n: string) => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{invoice.user.fullName}</p>
                                            <p className="text-[11px] text-gray-500 font-medium">Invoice: {invoice.billingMonth} Plan</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-red-600">LKR {invoice.totalAmount.toLocaleString()}</p>
                                        <button className="text-[10px] text-blue-600 font-bold hover:underline mt-1 flex items-center gap-1 ml-auto">
                                            <Mail size={12} /> Remind
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
                                    <AlertCircle size={24} />
                                </div>
                                <p className="text-sm font-bold text-gray-800">Clear Records!</p>
                                <p className="text-xs text-gray-400 mt-1">There are no critical overdue invoices at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* User Search & Timeline */}
                <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-50">
                        <h3 className="text-lg font-bold text-gray-800">User Billing Timeline</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Search for a user to see their payment history</p>

                        <div className="mt-4 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[400px] overscroll-contain">
                        {isSearching ? (
                            <div className="p-10 text-center">
                                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-sm text-gray-400 font-medium">Searching records...</p>
                            </div>
                        ) : debouncedSearch.length < 3 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                                    <Calendar size={32} />
                                </div>
                                <h4 className="text-base font-bold text-gray-800 mb-2">History Lookup</h4>
                                <p className="text-sm text-gray-400 max-w-[280px]">Type at least 3 characters to search for a user's payment history and billing timeline.</p>
                            </div>
                        ) : searchResults?.length > 0 ? (
                            <div className="p-4 space-y-4">
                                {searchResults.map((inv: any) => (
                                    <div key={inv.id} className="p-4 rounded-2xl border border-gray-50 bg-gray-50/30 flex items-center justify-between group hover:border-blue-100 hover:bg-blue-50/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${inv.status === 'PAID' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                {inv.status === 'PAID' ? <DollarSign size={20} /> : <AlertCircle size={20} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-gray-900">{inv.billingMonth}</span>
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${inv.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {inv.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 font-medium">{inv.user.fullName} • {inv.billingType}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-4">
                                            <div className="hidden sm:block">
                                                <p className="text-sm font-black text-gray-900">LKR {inv.totalAmount.toLocaleString()}</p>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">{new Date(inv.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            {/* <button className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Download size={14} />
                                            </button> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                                <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-6">
                                    <Search size={32} />
                                </div>
                                <h4 className="text-base font-bold text-gray-800 mb-2">No Records Found</h4>
                                <p className="text-sm text-gray-400 max-w-[280px]">We couldn't find any billing records matching "{debouncedSearch}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Revenue Channel Analysis */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 overflow-hidden relative">
                <div className="relative z-10 grid grid-cols-[2fr_1fr] gap-20">
                    <div className="w-full">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Revenue Channel Breakdown</h3>
                        <p className="text-sm text-gray-500 mb-8">Performance comparison between Online and Manual payment methods</p>

                        <div className="grid grid-cols-1 md:grid-cols-1 w-full">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Online Payments</p>
                                        <p className="text-lg font-black text-gray-900">{onlinePercent.toFixed(1)}%</p>
                                    </div>
                                    <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                                            style={{ width: `${onlinePercent}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-400">Via Stripe Credit/Debit Cards</p>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between items-end">
                                        <p className="text-sm font-bold text-amber-600 uppercase tracking-wider">Manual Payments</p>
                                        <p className="text-lg font-black text-gray-900">{manualPercent.toFixed(1)}%</p>
                                    </div>
                                    <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-500 to-amber-700 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                                            style={{ width: `${manualPercent}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-400">Via Direct Bank Slips & Uploads</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50/50 rounded-3xl flex flex-col justify-center items-center text-center border border-gray-100">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600">
                            <Target size={40} />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Targeted Growth</h4>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-[300px]">
                            Automating manual payment verification can reduce admin workload by up to 80%. Consider promoting online payments for smoother cashflow.
                        </p>
                    </div>
                </div>

                {/* Background Decorative Element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl z-0"></div>
            </div>
        </div >
    );
};

export default FinancialAnalytics;

