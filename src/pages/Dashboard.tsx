import { useEffect } from 'react';
import { Building2, FileText, AlertCircle, DollarSign, Users, Building } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import Chart from '../components/Chart';
import QuickActionCard from '../components/QuickActionCard';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchDashboardStats } from '../store/dashboardSlice';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const dispatch = useAppDispatch();
  const { stats, chartData, userRole } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Overview</h1>
        <p className="text-gray-600">{userRole}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Performance Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatsCard
            title="Active Subscriptions"
            value={stats.activeSubscriptions.toLocaleString()}
            icon={FileText}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatsCard
            title="Total Companies"
            value={stats.totalCompanies.toLocaleString()}
            icon={Building2}
            iconBgColor="bg-teal-100"
            iconColor="text-teal-600"
          />
          <StatsCard
            title="Total Employees"
            value={stats.totalEmployees.toLocaleString()}
            icon={Building}
            iconBgColor="bg-indigo-100"
            iconColor="text-indigo-600"
          />
          <StatsCard
            title="Monthly Revenue"
            value={`RS: ${stats.monthlyRevenue.toLocaleString()}`}
            icon={DollarSign}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatsCard
            title="Suspicious Logins"
            value={stats.suspiciousLogins.toLocaleString()}
            icon={AlertCircle}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Chart data={chartData} title="Monthly User Registrations" />
        </div>

        <div className="space-y-4">
          <QuickActionCard
            title="View Users"
            subtitle="Payroll Users"
            icon={Users}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
            onClick={() => onNavigate('users')}
          />
          <QuickActionCard
            title="View Companies"
            subtitle="Registered Companies"
            icon={Building}
            iconBgColor="bg-teal-100"
            iconColor="text-teal-600"
            onClick={() => onNavigate('company')}
          />
          <QuickActionCard
            title="Edit Plans"
            subtitle="Edit Subscription Plans"
            icon={DollarSign}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
            onClick={() => onNavigate('subscriptions')}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
