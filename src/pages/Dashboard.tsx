import { useQuery } from '@tanstack/react-query';
import { Building2, FileText, AlertCircle, DollarSign, Users, Building } from 'lucide-react';
import api from '../utils/axios';
import StatsCard from '../components/StatsCard';
import Chart from '../components/Chart';
import QuickActionCard from '../components/QuickActionCard';
import DashboardSkeleton from '../components/DashboardSkeleton';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await api.get('/admin/dashboard/summary');
      return response.data.data;
    },
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  console.log('Dashboard Data:', dashboardData);

  // Handle both nested stats object and flattened response
  const stats = dashboardData?.stats || dashboardData || {
    activeUsers: 0,
    totalCompanies: 0,
    totalEmployees: 0,
    monthlyRevenue: 0,
    totalIncome: 0,
  };
  const chartData = dashboardData?.chartData || [];
  const recentActivities = dashboardData?.recentActivities || [];
  const userRole = 'System Administrator';

  const formatTime = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return 'just now';
    if (diffInMins < 60) return `${diffInMins} mins ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${diffInDays} days ago`;
  };

  const getActivityDescription = (activity: any) => {
    switch (activity.action) {
      case 'CREATE_USER':
        return `New User registered: ${activity.userName}`;
      case 'CREATE_COMPANY':
        return `New company registered: ${activity.userName}`;
      case 'CREATE_EMPLOYEE':
        return `New employee added by ${activity.userName}`;
      case 'UPDATE_SALARY':
        return `Salary calculated by ${activity.userName}`;
      case 'CREATE_SUBSCRIPTION':
        return `New subscription purchased by ${activity.userName}`;
      default:
        return `${activity.action.replace('_', ' ')} by ${activity.userName}`;
    }
  };

  const getActivityIcon = (action: string) => {
    if (action.includes('USER')) return Users;
    if (action.includes('COMPANY')) return Building2;
    if (action.includes('EMPLOYEE')) return Users;
    if (action.includes('SALARY')) return DollarSign;
    return AlertCircle;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Overview</h1>
          <p className="text-gray-500 font-medium mt-1">{userRole}</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
          <Users className="text-blue-600" size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="ACTIVE USERS"
          value={stats.activeUsers.toLocaleString()}
          icon={Users}
          iconBgColor="bg-[#fdf2f2]"
          iconColor="text-[#ef4444]"
          trend={{ value: 20, isUp: false, label: 'This week' }}
        />
        <StatsCard
          title="TOTAL COMPANIES"
          value={stats.totalCompanies.toLocaleString()}
          icon={Building2}
          iconBgColor="bg-[#f0f9ff]"
          iconColor="text-[#0ea5e9]"
          trend={{ value: 55, isUp: true, label: 'This week' }}
        />
        <StatsCard
          title="MONTHLY INCOME"
          value={`${stats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          iconBgColor="bg-[#f0fdf4]"
          iconColor="text-[#22c55e]"
          trend={{ value: 25, isUp: true, label: 'This week' }}
        />
        <StatsCard
          title="TOTAL INCOME"
          value={stats.totalIncome.toLocaleString()}
          icon={DollarSign}
          iconBgColor="bg-[#fffbeb]"
          iconColor="text-[#f59e0b]"
          trend={{ value: 12, isUp: true, label: 'This month' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <Chart data={chartData} title="User Registrations" />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-50 bg-white sticky top-0">
              <h3 className="text-lg font-bold text-gray-800">Recent Activities</h3>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[400px]">
              {recentActivities.map((activity: any, index: number) => {
                const Icon = getActivityIcon(activity.action);
                return (
                  <div key={activity.id} className={`p-5 flex items-start space-x-4 hover:bg-gray-50 transition-colors ${index !== recentActivities.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex-shrink-0 flex items-center justify-center">
                      <Icon className="text-blue-600" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-snug">
                        {getActivityDescription(activity)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{formatTime(activity.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
              {recentActivities.length === 0 && (
                <div className="p-10 text-center text-gray-400">No recent activities</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <QuickActionCard
          title="View Users"
          subtitle="Payroll Users"
          icon={Users}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
          onClick={() => onNavigate('users')}
        />
        <QuickActionCard
          title="View Companies"
          subtitle="Registered Companies"
          icon={Building}
          iconBgColor="bg-teal-50"
          iconColor="text-teal-600"
          onClick={() => onNavigate('company')}
        />
        <QuickActionCard
          title="Edit Plans"
          subtitle="Edit Subscription Plans"
          icon={FileText}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
          onClick={() => onNavigate('subscriptions')}
        />
      </div>
    </div>
  );
};

export default Dashboard;
