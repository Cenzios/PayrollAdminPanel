import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  activeItem: string;
  onNavigate: (item: string) => void;
}

const Layout = ({ children, activeItem, onNavigate }: LayoutProps) => {
  const userName = "John De Silva";
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeItem={activeItem} onNavigate={onNavigate} />
      <div className="ml-64">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <div></div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
              {initials}
            </div>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
