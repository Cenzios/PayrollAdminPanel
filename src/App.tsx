import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Company from './pages/Company';
import Subscriptions from './pages/Subscriptions';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ManualPayments from './pages/ManualPayments';
import FinancialAnalytics from './pages/FinancialAnalytics';
import { useAppSelector } from './store/hooks';

function App() {
  const { token } = useAppSelector((state) => state.auth);

  // Debug: Check environment variable imports
  console.log('🚀 Env Debug Message:', import.meta.env.VITE_DEBUG_MESSAGE);
  console.log('🔗 Base API URL:', import.meta.env.VITE_API_BASE_URL);

  // If no token, show login page only
  if (!token) {
    return (
      <Routes>
        <Route path="*" element={<Login onLoginSuccess={() => { }} />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/company" element={<Company />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/manual-payments" element={<ManualPayments />} />
        <Route path="/financials" element={<FinancialAnalytics />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
