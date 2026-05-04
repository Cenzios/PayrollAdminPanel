import { NavLink } from 'react-router-dom';
import { Home, Users, Building2, CreditCard, Settings, FileText } from 'lucide-react';
import logo from '../assets/images/logo.svg';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
  { id: 'users', label: 'Users', icon: Users, path: '/users' },
  { id: 'company', label: 'Company', icon: Building2, path: '/company' },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, path: '/subscriptions' },
  { id: 'manual-payments', label: 'Manual Payment', icon: FileText, path: '/manual-payments' },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-[#000827] h-screen flex flex-col border-r border-gray-200 fixed left-0 top-0 overflow-y-auto">
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-center">
        <NavLink to="/dashboard" className="cursor-pointer">
          <img
            src={logo}
            alt="Payroll Logo"
            className="w-30 h-16 object-contain"
          />
        </NavLink>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-[14px] font-semibold ${isActive
                ? 'bg-white/10 backdrop-blur-md text-white'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Settings at Bottom */}
      <div className="p-4 border-t border-gray-200">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-[14px] ${isActive
              ? 'bg-blue-50 text-blue-600 font-medium'
              : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
