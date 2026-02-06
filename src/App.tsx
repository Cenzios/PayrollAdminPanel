import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Company from './pages/Company';
import Notifications from './pages/Notifications';
import Subscriptions from './pages/Subscriptions';
import Login from './pages/Login';
import { useAppSelector } from './store/hooks';

function App() {
  const { token } = useAppSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState('dashboard');

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
      case 'notifications':
        return <Notifications />;
      case 'subscriptions':
        return <Subscriptions />;
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
