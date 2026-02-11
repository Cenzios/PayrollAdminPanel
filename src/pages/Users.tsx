import { Search, MessageSquare, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers, sendUserNotification } from '../store/userSlice';
import NotificationModal from '../components/NotificationModal';

const Users = () => {
  const dispatch = useAppDispatch();
  const { users, totalUsers } = useAppSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Notification Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, limit: rowsPerPage }));
  }, [dispatch, currentPage, rowsPerPage]);

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
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const handleOpenModal = (userId: string, userName: string) => {
    setSelectedUser({ id: userId, name: userName });
    setIsModalOpen(true);
  };

  const handleSendNotification = async (userId: string, title: string, message: string) => {
    try {
      await dispatch(sendUserNotification({ userId, title, message })).unwrap();
      alert('Notification sent successfully!');
    } catch (error: any) {
      alert(error || 'Failed to send notification');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1e293b]">Registered Users</h1>
        <p className="text-gray-500 mt-1">Details of registered Users</p>
      </div>

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
              <tr className="bg-gray-50/50 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4 text-center">No. of companies</th>
                <th className="px-6 py-4 text-center">No. of employees</th>
                <th className="px-6 py-4">Subscription Plan</th>
                <th className="px-6 py-4 text-center">Message</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
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
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-600 font-medium">
                      {user.companyCount?.toString().padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-600 font-medium">
                      {user.employeeCount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 font-medium">
                      {user.currentPlan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleOpenModal(user.id, user.fullName || '')}
                      className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                    >
                      <MessageSquare size={18} />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(user.subscriptionStatus || '')}`}>
                      {user.subscriptionStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === user.id ? null : user.id)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenuId === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-10">
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">View Details</button>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Edit User</button>
                          <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Suspend User</button>
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
      {selectedUser && (
        <NotificationModal
          isOpen={isModalOpen}
          userId={selectedUser.id}
          userName={selectedUser.name}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          onSend={handleSendNotification}
        />
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
};

export default Users;
