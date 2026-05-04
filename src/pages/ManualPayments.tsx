import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAppSelector } from '../store/hooks';

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
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<TabType>('PENDING');
    const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:6092/api';

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

    const selectedDoc = documents.find(d => d.id === selectedDocId);

    // Determine if we should clear selected doc when switching tabs
    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setSelectedDocId(null);
    };

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
            setSelectedDocId(null);
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
            setSelectedDocId(null);
        }
    });

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 pb-6 pl-6 pr-6 pt-2">
            {/* Page Title & Search Bar Area */}
            <div className="py-4 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Payroll Review</h1>
            </div>

            <div className="flex flex-1 gap-6 min-h-0">
                {/* Left Sidebar: Review Lists */}
                <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col hidden sm:flex">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-100 p-2 gap-1 bg-gray-50/50 rounded-t-xl">
                        <button
                            onClick={() => handleTabChange('PENDING')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'PENDING' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => handleTabChange('APPROVED')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'APPROVED' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                        >
                            History
                        </button>
                    </div>

                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                            {activeTab === 'PENDING' ? 'Pending Reviews' : 'Approved History'}
                        </h2>
                        {activeTab === 'PENDING' && documents.length > 0 && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                {documents.length} New
                            </span>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {isLoading && <div className="p-4 text-gray-500 flex justify-center text-sm">Loading requests...</div>}
                        {!isLoading && documents.length === 0 && (
                            <div className="p-8 text-center text-gray-400 text-sm">No documents found.</div>
                        )}

                        {documents.map((doc) => {
                            const initials = doc.user.fullName
                                ? doc.user.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
                                : 'U';

                            return (
                                <div
                                    key={doc.id}
                                    onClick={() => setSelectedDocId(doc.id)}
                                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 ${selectedDocId === doc.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                                            {initials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                    {doc.user.fullName || 'Unknown User'}
                                                </h3>
                                                <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-2">
                                                    {new Date(doc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate mb-1.5">{doc.user.email}</p>
                                            <div className="mt-1">
                                                <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm ${activeTab === 'PENDING' ? 'text-orange-600 bg-orange-50' : 'text-green-600 bg-green-50'}`}>
                                                    {doc.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Content: Document Details */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    {selectedDoc ? (
                        <>
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10 shadow-sm relative">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedDoc.user.fullName || 'Unknown User'}</h2>
                                    <p className="text-sm text-gray-500 mt-1">{selectedDoc.user.email} • Uploaded: {new Date(selectedDoc.createdAt).toLocaleString()}</p>
                                </div>
                                {activeTab === 'APPROVED' && (
                                    <a
                                        href={selectedDoc.fileUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        download
                                        className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm text-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download PDF
                                    </a>
                                )}
                            </div>

                            {/* Document Preview */}
                            <div className="flex-1 p-6 bg-gray-50 overflow-y-auto flex items-center justify-center">
                                <div className="bg-white p-4 shadow-sm border border-gray-200 rounded-lg max-w-full">
                                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        <span>{selectedDoc.fileName}</span>
                                    </div>
                                    <img
                                        src={selectedDoc.fileUrl}
                                        alt="Payment proof"
                                        className="max-h-[60vh] object-contain rounded border border-gray-100"
                                    />
                                </div>
                            </div>

                            {/* Actions - Only show if PENDING */}
                            {activeTab === 'PENDING' && (
                                <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
                                    <button
                                        onClick={() => rejectMutation.mutate(selectedDoc.id)}
                                        disabled={rejectMutation.isPending || approveMutation.isPending}
                                        className="px-6 py-2.5 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
                                    >
                                        <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => approveMutation.mutate(selectedDoc.id)}
                                        disabled={rejectMutation.isPending || approveMutation.isPending}
                                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm text-sm"
                                    >
                                        <svg className="w-5 h-5 bg-white/20 rounded-full p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Approve Payslip
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-base text-gray-400">Select a review from the left sidebar to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
