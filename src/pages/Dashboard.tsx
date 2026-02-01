import { Building2, FileText, AlertCircle, DollarSign, Users, Building } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import Chart from '../components/Chart';
import QuickActionCard from '../components/QuickActionCard';
import { useAppSelector } from '../store/hooks';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { stats, chartData, userRole } = useAppSelector((state) => state.dashboard);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Companies"
            value={stats.totalCompanies.toLocaleString()}
            change={stats.totalCompaniesChange}
            changeLabel="This week"
            icon={Building2}
            iconBgColor="bg-teal-100"
            iconColor="text-teal-600"
          />
          <StatsCard
            title="Monthly Income"
            value={`RS: ${stats.monthlyIncome.toLocaleString()}`}
            change={stats.monthlyIncomeChange}
            changeLabel="This week"
            icon={FileText}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatsCard
            title="Expired Companies"
            value={stats.expiredCompanies}
            change={stats.expiredCompaniesChange}
            changeLabel="This week"
            icon={AlertCircle}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />
          <StatsCard
            title="Total Income"
            value={stats.totalIncome}
            change={stats.totalIncomeChange}
            changeLabel="This month"
            icon={DollarSign}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
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
