import { Home, Users, Building2, CreditCard, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.svg';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
  { id: 'users', label: 'Users', icon: Users, path: '/users' },
  { id: 'company', label: 'Company', icon: Building2, path: '/company' },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, path: '/subscriptions' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col">
      {/* Logo Section */}
      <Link
        to="/dashboard"
        className="p-6 border-b border-gray-200 flex items-center justify-center cursor-pointer"
      >
        <img
          src={logo}
          alt="Payroll Logo"
          className="h-10 object-contain"
        />
      </Link>


      <nav className="flex-1 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-all ${isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Link
          to="/settings"
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${location.pathname === '/settings'
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-600 hover:bg-gray-50'
            }`}
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
