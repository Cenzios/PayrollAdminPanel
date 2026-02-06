import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/authSlice';
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeItem: string;
  onNavigate: (item: string) => void;
}

const Layout = ({ children, activeItem, onNavigate }: LayoutProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const userName = user?.fullName || "Admin User";
  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeItem={activeItem} onNavigate={onNavigate} />
      <div className="ml-64">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center relative z-20">
          <div></div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 hover:bg-gray-50 p-1 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                  {initials}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">{user?.role || 'Admin'}</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20 animate-fadeInUp">
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onNavigate('settings');
                      }}
                    >
                      <UserIcon className="h-4 w-4" />
                      Profile
                    </button>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
