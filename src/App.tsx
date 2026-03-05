import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Company from './pages/Company';
import Subscriptions from './pages/Subscriptions';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { useAppSelector } from './store/hooks';

function App() {
  const { token } = useAppSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Debug: Check environment variable imports
  console.log('🚀 Env Debug Message:', import.meta.env.VITE_DEBUG_MESSAGE);
  console.log('🔗 Base API URL:', import.meta.env.VITE_API_BASE_URL);

  // If no token, always show login page
  if (!token) {
    return <Login onLoginSuccess={() => setCurrentPage('dashboard')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'users':
        return <Users />;
      case 'company':
        return <Company />;
      case 'subscriptions':
        return <Subscriptions />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout activeItem={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
