import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPageTitle } from '../store/uiSlice';
import { Search, Eye, MoreVertical, Check, X, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface User {
    id: string;
    fullName: string;
    email: string;
}

interface UserDocument {
    id: string;
    userId: string;
    fileName: string;
    fileUrl: string;
    status: string;
    createdAt: string;
    user: User;
}

type TabType = 'PENDING' | 'APPROVED';

export default function ManualPayments() {
    const { token } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    useEffect(() => {
        dispatch(setPageTitle({ title: 'Payroll Review', subtitle: 'Manual Payment Verification' }));
    }, [dispatch]);
    const [activeTab, setActiveTab] = useState<TabType>('PENDING');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://payrolladminbackend.cenzios.com/api';

    // Fetch payments based on active tab
    const { data: documents = [], isLoading } = useQuery<UserDocument[]>({
        queryKey: ['manual-payments', activeTab],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE_URL}/admin/manual-payments?status=${activeTab}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.data;
        },
        enabled: !!token,
    });

    // Approve Mutation
    const approveMutation = useMutation({
        mutationFn: async (id: string) => {
            await axios.post(`${API_BASE_URL}/admin/manual-payments/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['manual-payments', 'PENDING'] });
            queryClient.invalidateQueries({ queryKey: ['manual-payments', 'APPROVED'] });
            setActiveMenuId(null);
        }
    });

    // Reject Mutation
    const rejectMutation = useMutation({
        mutationFn: async (id: string) => {
            await axios.post(`${API_BASE_URL}/admin/manual-payments/${id}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['manual-payments', 'PENDING'] });
            setActiveMenuId(null);
        }
    });

    const filteredDocuments = documents.filter(doc =>
        doc.user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-2 p-2 bg-gray-50 min-h-[calc(100vh-80px)]">
            {/* Tabs / Filter at the top */}
            <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 w-fit">
                <button
                    onClick={() => setActiveTab('PENDING')}
                    className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'PENDING' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                >
                    Pending Reviews
                </button>
                <button
                    onClick={() => setActiveTab('APPROVED')}
                    className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'APPROVED' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                >
                    Approved History
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {activeTab === 'PENDING' ? 'Pending Payments' : 'Payment History'}
                        </h2>
                        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {filteredDocuments.length} records
                        </span>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email or file..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-4 text-center">Avatar</th>
                                <th className="px-6 py-4">User Details</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">File Name</th>
                                <th className="px-6 py-4 text-center">Preview</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">Loading payments...</td>
                                </tr>
                            ) : filteredDocuments.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-gray-400 italic">No records found.</td>
                                </tr>
                            ) : filteredDocuments.map((doc) => {
                                const initials = doc.user.fullName
                                    ? doc.user.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
                                    : 'U';

                                return (
                                    <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-center">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm mx-auto shadow-sm">
                                                {initials}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900">{doc.user.fullName || 'Unknown User'}</div>
                                                <div className="text-xs text-gray-500">{doc.user.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700 font-medium">
                                                {new Date(doc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {new Date(doc.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <FileText size={16} className="text-gray-400" />
                                                <span className="truncate max-w-[150px]" title={doc.fileName}>{doc.fileName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => setSelectedImageUrl(doc.fileUrl)}
                                                className="inline-flex items-center justify-center p-2 text-blue-600 transition-colors group/btn"
                                            >
                                                <p className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase bg-blue-50 text-blue-600 border border-blue-200 hover:text-blue-800 hover:bg-blue-100 transition-colors">View</p>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${activeTab === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'
                                                }`}>
                                                {doc.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="relative">
                                                <button
                                                    onClick={() => setActiveMenuId(activeMenuId === doc.id ? null : doc.id)}
                                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                                >
                                                    <MoreVertical size={18} />
                                                </button>

                                                {activeMenuId === doc.id && (
                                                    <div className="fixed right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-10">
                                                        {activeTab === 'PENDING' ? (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        approveMutation.mutate(doc.id);
                                                                        setActiveMenuId(null);
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                                                                >
                                                                    <Check size={16} /> Approve Payment
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        rejectMutation.mutate(doc.id);
                                                                        setActiveMenuId(null);
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                                >
                                                                    <X size={16} /> Reject Payment !!!
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <div className="px-4 py-2 text-xs text-gray-400 italic">No actions available</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Image Preview Modal */}
            {selectedImageUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800">Payment Proof Preview</h3>
                            <button
                                onClick={() => setSelectedImageUrl(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 bg-gray-50 flex items-center justify-center">
                            <img
                                src={selectedImageUrl}
                                alt="Payment proof"
                                className="max-w-full h-auto rounded-lg shadow-sm"
                            />
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-end">
                            <a
                                href={selectedImageUrl}
                                target="_blank"
                                rel="noreferrer"
                                download
                                className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm"
                            >
                                Download Original
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Click outside to close menu backdrop */}
            {activeMenuId && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setActiveMenuId(null)}
                />
            )}
        </div>
    );
}
