import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPageTitle } from '../store/uiSlice';
import { Search, MoreVertical, Check, X, FileText, ChevronLeft, ChevronRight } from 'lucide-react'; import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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

const SESSION_KEY = 'manualPayments_activeTab';

export default function ManualPayments() {
    const { token } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    // const [activeTab, setActiveTab] = useState<TabType>('PENDING');
    const [activeTab, setActiveTab] = useState<TabType>(() => {
        const saved = sessionStorage.getItem(SESSION_KEY);
        return (saved === 'PENDING' || saved === 'APPROVED') ? saved : 'PENDING';
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [selectedFileName, setSelectedFileName] = useState<string>('');
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(setPageTitle({ title: 'Payroll Review', subtitle: 'Manual Payment Verification' }));
    }, [dispatch]);

    useEffect(() => {
        sessionStorage.setItem(SESSION_KEY, activeTab);
    }, [activeTab]);



    // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:6092/api';
    const API_BASE_URL = (window as any).RUNTIME_CONFIG?.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL;

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

    const loadPdfAsBlob = async (url: string) => {
        setPdfLoading(true);
        setPdfBlobUrl(null);
        try {
            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            setPdfBlobUrl(objectUrl);
        } catch (error) {
            console.error('PDF fetch failed:', error);
        } finally {
            setPdfLoading(false);
        }
    };

    const handleDownload = async (url: string, fileName: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    const filteredDocuments = documents.filter(doc =>
        doc.user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRecords = filteredDocuments.length;
    const paginatedDocuments = filteredDocuments.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div className="flex flex-col h-full space-y-2 p-2 bg-gray-50">
            {/* Tabs / Filter at the top */}
            <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 w-fit shrink-0">
                <button
                    onClick={() => { setActiveTab('PENDING'); setCurrentPage(1); }}
                    className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'PENDING' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                >
                    Pending Reviews
                </button>
                <button
                    onClick={() => { setActiveTab('APPROVED'); setCurrentPage(1); }}
                    className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'APPROVED' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                >
                    Approved History
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 shrink-0">
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

                <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0 overscroll-contain [scrollbar-gutter:stable]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-wider sticky top-0 z-10">
                                <th className="px-6 py-4 text-center"></th>
                                <th className="px-6 py-4">User Details</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Uploaded Document</th>
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
                            ) : paginatedDocuments.map((doc, index) => {
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
                                                onClick={() => {
                                                    setSelectedImageUrl(doc.fileUrl);
                                                    setSelectedFileName(doc.fileName);
                                                    if (doc.fileName.toLowerCase().endsWith('.pdf')) {
                                                        loadPdfAsBlob(doc.fileUrl);
                                                    }
                                                }}
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
                                                    <div className={`absolute right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-10 ${filteredDocuments.length - index <= 3 ? 'bottom-full mb-2 origin-bottom-right' : 'top-full mt-2 origin-top-right'
                                                        }`}>
                                                        {activeTab === 'PENDING' ? (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        approveMutation.mutate(doc.id);
                                                                        setActiveMenuId(null);
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                                                                >
                                                                    <Check size={16} /> Approve Bank Slip
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        rejectMutation.mutate(doc.id);
                                                                        setActiveMenuId(null);
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                                >
                                                                    <X size={16} /> Reject Bank Slip
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

                <div className="p-6 border-t border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Rows per page</span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="text-sm text-gray-500">
                            {((currentPage - 1) * rowsPerPage) + 1}–{Math.min(currentPage * rowsPerPage, totalRecords)} of {totalRecords}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: Math.ceil(totalRecords / rowsPerPage) }, (_, i) => i + 1)
                                .slice(Math.max(0, currentPage - 3), Math.min(Math.ceil(totalRecords / rowsPerPage), currentPage + 2))
                                .map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${page === currentPage ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                        </div>
                        <button
                            disabled={currentPage >= Math.ceil(totalRecords / rowsPerPage)}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            {selectedImageUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800">Payment Proof Preview</h3>
                            <button
                                onClick={() => {
                                    setSelectedImageUrl(null);
                                    setSelectedFileName('');
                                    setPageNumber(1);
                                    setNumPages(0);
                                    if (pdfBlobUrl) {
                                        URL.revokeObjectURL(pdfBlobUrl);
                                        setPdfBlobUrl(null);
                                    }
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 bg-gray-50 flex items-center justify-center">
                            {/* <img
                                src={selectedImageUrl}
                                alt="Payment proof"
                                className="max-w-full h-auto rounded-lg shadow-sm"
                            /> */}
                            {selectedFileName.toLowerCase().endsWith('.pdf') ? (
                                <iframe
                                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedImageUrl!)}&embedded=true`}
                                    className="w-full rounded-lg shadow-sm"
                                    style={{ height: '70vh' }}
                                    title="PDF Preview"
                                    onLoad={(e) => {
                                        // Google viewer loaded
                                    }}
                                />
                            ) : (
                                // Image viewer
                                <img
                                    src={selectedImageUrl}
                                    alt="Payment proof"
                                    className="max-w-full h-auto rounded-lg shadow-sm"
                                />
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => handleDownload(selectedImageUrl!, selectedFileName)}
                                className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm"
                            >
                                Download Original
                            </button>
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