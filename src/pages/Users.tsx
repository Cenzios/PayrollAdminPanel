import { Search, MessageSquare, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setPageTitle } from '../store/uiSlice';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/axios';
import NotificationModal from '../components/NotificationModal';
import UserDetailsModal from '../components/UserDetailsModal';
import UserDetailsModalSkeleton from '../components/UserDetailsModalSkeleton';
import { useToast } from '../components/ToastContext';

interface User {
  id: string;
  fullName: string;
  email: string;
  companyCount: number;
  employeeCount: number;
  currentPlan: string;
  userStatus: string;
  subscriptionStatus: string;
  paymentMethod: string;
}

const Users = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Registered Users', subtitle: 'Details of registered Users' }));
  }, [dispatch]);

  // Notification Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotificationUser, setSelectedNotificationUser] = useState<{ id: string; name: string } | null>(null);

  // User Details Modal State
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Fetch users with data from API
  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ['users', currentPage, rowsPerPage],
    queryFn: async () => {
      const response = await api.get('/admin/users', {
        params: { page: currentPage, limit: rowsPerPage }
      });
      return response.data;
    },
  });

  console.log('Users Data:', usersData);
  const rawData = usersData?.data;
  const users = (Array.isArray(rawData) ? rawData : rawData?.users || []) as User[];
  const totalUsers = usersData?.pagination?.total || rawData?.pagination?.total || 0;

  // Selective user for detail view
  const { data: userDetails, isLoading: isUserDetailsLoading } = useQuery({
    queryKey: ['userDetails', selectedUserId],
    queryFn: async () => {
      const response = await api.get(`/admin/users/${selectedUserId}`);
      return response.data.data;
    },
    enabled: !!selectedUserId,
  });

  const filteredUsers = users.filter(user =>
    (user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-50 text-green-600 border-green-100';
      case 'PENDING_ACTIVATION':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'EXPIRED':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'CANCELLED':
        return 'bg-gray-50 text-gray-600 border-gray-100';
      case 'SUSPENDED':
        return 'bg-red-50 text-red-600 border-red-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const handleOpenModal = (userId: string, userName: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    setSelectedNotificationUser({ id: userId, name: userName });
    setIsModalOpen(true);
  };

  const handleRowClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsDetailsModalOpen(true);
  };

  const notificationMutation = useMutation({
    mutationFn: async ({ userId, title, message }: { userId: string, title: string, message: string }) => {
      const response = await api.post('/admin/notifications/send', { userId, title, message });
      return response.data;
    },
    onSuccess: () => {
      showToast('Notification sent successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.error || 'Failed to send notification', 'error');
    }
  });

  const handleSendNotification = async (userId: string, title: string, message: string) => {
    notificationMutation.mutate({ userId, title, message });
  };

  const statusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string, status: string }) => {
      const response = await api.put(`/admin/users/${userId}/subscription/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setActiveMenuId(null);
      showToast('User status updated successfully', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.error || 'Failed to update user status', 'error');
    }
  });


  const handleSuspendUser = (userId: string) => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
      statusMutation.mutate({ userId, status: 'SUSPENDED' });
    }
  };

  const handleActivateUser = (userId: string) => {
    if (window.confirm('Are you sure you want to activate this user?')) {
      statusMutation.mutate({ userId, status: 'ACTIVE' });
    }
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedUserId(null);
  };

  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-800">Registered Users</h2>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {totalUsers} users
            </span>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by user name"
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
                <th className="px-6 py-4">User Name</th>
                <th className="px-3 py-4 text-center">No. of companies</th>
                <th className="px-3 py-4 text-center">No. of employees</th>
                <th className="px-3 py-4">Subscription Plan</th>
                <th className="px-3 py-4">Payment Method</th>
                <th className="px-3 py-4 text-center">Message</th>
                <th className="px-3 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isUsersLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500">Loading users...</td>
                </tr>
              ) : filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                  onClick={() => handleRowClick(user.id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                        {user.fullName?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{user.fullName}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <span className="text-sm text-gray-600 font-medium">
                      {(user.companyCount ?? 0).toString().padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <span className="text-sm text-gray-600 font-medium">
                      {user.employeeCount ?? 0}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <span className="text-sm text-gray-600 font-medium">
                      {user.currentPlan}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.paymentMethod === 'Manual'
                      ? 'bg-amber-50 text-amber-600 border-amber-100'
                      : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                      }`}>
                      {user.paymentMethod}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <button
                      onClick={(e) => handleOpenModal(user.id, user.fullName || '', e)}
                      className="text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                    >
                      <MessageSquare size={18} />
                    </button>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border w-fit uppercase ${getStatusStyles(user.userStatus || '')}`}>
                        Account: {user.userStatus}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border w-fit ${getStatusStyles(user.subscriptionStatus || '')}`}>
                        Sub: {user.subscriptionStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === user.id ? null : user.id);
                        }}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenuId === user.id && (
                        <div className={`absolute right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-10 ${filteredUsers.length - index <= 3 ? 'bottom-full mb-2 origin-bottom-right' : 'top-full mt-2 origin-top-right'
                          }`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSuspendUser(user.id);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Suspend User
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActivateUser(user.id);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                          >
                            Activate User
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-500">
              {((currentPage - 1) * rowsPerPage) + 1}-{Math.min(currentPage * rowsPerPage, totalUsers)} of {totalUsers}
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
              {Array.from({ length: Math.ceil(totalUsers / rowsPerPage) }, (_, i) => i + 1)
                .slice(Math.max(0, currentPage - 3), Math.min(Math.ceil(totalUsers / rowsPerPage), currentPage + 2))
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${page === currentPage
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}
            </div>
            <button
              disabled={currentPage >= Math.ceil(totalUsers / rowsPerPage)}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      {selectedNotificationUser && (
        <NotificationModal
          isOpen={isModalOpen}
          userId={selectedNotificationUser.id}
          userName={selectedNotificationUser.name}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedNotificationUser(null);
          }}
          onSend={handleSendNotification}
        />
      )}

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isDetailsModalOpen && !isUserDetailsLoading}
        onClose={handleCloseDetails}
        userData={userDetails}
      />
      <UserDetailsModalSkeleton
        isOpen={isDetailsModalOpen && isUserDetailsLoading}
        onClose={handleCloseDetails}
      />

      {/* Click outside to close menu backdrop */}
      {activeMenuId && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveMenuId(null)}
        />
      )}
    </div>
  );
};

export default Users;
