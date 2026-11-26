import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Company from './pages/Company';
import Subscriptions from './pages/Subscriptions';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ManualPayments from './pages/ManualPayments';
import FinancialAnalytics from './pages/FinancialAnalytics';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { restoreSession } from './store/authSlice';
import DashboardSkeleton from './components/DashboardSkeleton';
import { getApiBaseUrl, getDebugMessage } from './config/runtimeConfig';

function SessionLoader(): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isBootstrapping, user, isLoading } = useAppSelector((state) => state.auth);

  // Restore the session from the HttpOnly refresh cookie before any protected route renders.
  useEffect(() => {
    console.log('🚀 Env Debug Message:', getDebugMessage());
    console.log('🔗 Base API URL:', getApiBaseUrl());
    void dispatch(restoreSession());
  }, [dispatch]);

  if (isBootstrapping) {
    return <SessionLoader />;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={() => { }} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Show skeleton ONLY while loading and user is null
  if (isLoading && !user) {
    return <DashboardSkeleton />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
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
