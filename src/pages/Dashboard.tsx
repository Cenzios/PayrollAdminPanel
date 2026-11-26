import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { Building2, FileText, AlertCircle, DollarSign, Users, Building } from 'lucide-react';
import api from '../utils/axios';
import StatsCard from '../components/StatsCard';
import Chart from '../components/Chart';
import QuickActionCard from '../components/QuickActionCard';
import DashboardSkeleton from '../components/DashboardSkeleton';

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setPageTitle } from '../store/uiSlice';
import { formatMoney } from '../utils/money';

interface DashboardStats {
  activeUsers: number;
  totalCompanies: number;
  totalEmployees: number;
  /** Decimal string (money). */
  monthlyRevenue: string;
  /** Decimal string (money). */
  totalIncome: string;
}

interface DashboardChartPoint {
  month: string;
  /** Registration count; tolerated as string in case the API serializes it. */
  value: number | string;
}

interface DashboardSummary extends Partial<DashboardStats> {
  stats?: DashboardStats;
  chartData?: DashboardChartPoint[];
  recentActivities?: RecentActivity[];
}

interface RecentActivity {
  id: string;
  action: string;
  userName: string;
  createdAt: string;
  resourceType?: string;
}

const EMPTY_STATS: DashboardStats = {
  activeUsers: 0,
  totalCompanies: 0,
  totalEmployees: 0,
  monthlyRevenue: '0',
  totalIncome: '0',
};

async function fetchDashboardSummary(range: string): Promise<DashboardSummary> {
  const response = await api.get('/admin/dashboard/summary', { params: { range } });
  return response.data.data;
}

/** Normalizes the API summary into stats with string money fields. */
function toDashboardStats(summary: DashboardSummary | undefined): DashboardStats {
  const source = summary?.stats ?? summary;
  if (!source) return EMPTY_STATS;
  return {
    activeUsers: source.activeUsers ?? 0,
    totalCompanies: source.totalCompanies ?? 0,
    totalEmployees: source.totalEmployees ?? 0,
    monthlyRevenue: String(source.monthlyRevenue ?? '0'),
    totalIncome: String(source.totalIncome ?? '0'),
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userRole = 'System Administrator';
  const [currentRange, setCurrentRange] = useState('yearly');

  const queryClient = useQueryClient();

  useEffect(() => {
    const otherRanges = ['monthly', '3months', '6months', 'yearly'].filter(r => r !== currentRange);

    otherRanges.forEach((range) => {
      queryClient.prefetchQuery({
        queryKey: ['dashboardStats', range],
        queryFn: () => fetchDashboardSummary(range),
      });
    });
  }, []);

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Overview', subtitle: userRole }));
  }, [dispatch]);

  const { data: dashboardData, isLoading, isFetching } = useQuery({
    queryKey: ['dashboardStats', currentRange],
    queryFn: () => fetchDashboardSummary(currentRange),
    placeholderData: keepPreviousData,
  });

  if (isLoading && !dashboardData) {
    return <DashboardSkeleton />;
  }

  // Handle both nested stats object and flattened response
  const stats = toDashboardStats(dashboardData);
  // Chart boundary: recharts needs plain numbers.
  const chartData = (dashboardData?.chartData ?? []).map((point) => ({
    month: point.month,
    value: Number(point.value),
  }));
  const recentActivities = dashboardData?.recentActivities ?? [];

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

  const ACTION_VERBS: Record<string, string> = {
    POST: 'Created',
    PUT: 'Updated',
    PATCH: 'Updated',
    DELETE: 'Deleted',
    CREATE: 'Created',
    UPDATE: 'Updated',
  };

  const formatActivityAction = (action: string) => {
    const parts = action.split('_');
    const verb = ACTION_VERBS[parts[0]] ?? parts[0];
    const subject = parts.slice(1).join(' ').toLowerCase();
    const subjectTitle = subject.replace(/\b\w/g, (c) => c.toUpperCase());
    return `${verb} ${subjectTitle}`;
  };

  const getActivityDescription = (activity: RecentActivity): string => {
    switch (activity.action) {
      case 'CREATE_USER':
        return `New User Registered by ${activity.userName}`;
      case 'CREATE_COMPANY':
      case 'POST_COMPANY':
        return `New Company Registered by ${activity.userName}`;
      case 'CREATE_EMPLOYEE':
        return `New Employee Added by ${activity.userName}`;
      case 'UPDATE_SALARY':
        return `Salary Calculated by ${activity.userName}`;
      case 'CREATE_SUBSCRIPTION':
        return `New Subscription Purchased by ${activity.userName}`;
      default:
        return `${formatActivityAction(activity.action)} by ${activity.userName}`;
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="ACTIVE USERS"
          value={stats.activeUsers.toLocaleString()}
          icon={Users}
          iconBgColor="bg-[#fdf2f2]"
          iconColor="text-[#ef4444]"
        // trend={{ value: 20, isUp: false, label: 'This Month' }}
        />
        <StatsCard
          title="TOTAL COMPANIES"
          value={stats.totalCompanies.toLocaleString()}
          icon={Building2}
          iconBgColor="bg-[#f0f9ff]"
          iconColor="text-[#0ea5e9]"
        // trend={{ value: 55, isUp: true, label: 'This Month' }}
        />
        <StatsCard
          title="MONTHLY INCOME"
          value={`Rs ${formatMoney(stats.monthlyRevenue)}`}
          icon={DollarSign}
          iconBgColor="bg-[#f0fdf4]"
          iconColor="text-[#22c55e]"
        // trend={{ value: 25, isUp: true, label: 'This Month' }}
        />
        <StatsCard
          title="TOTAL INCOME"
          value={`Rs ${formatMoney(stats.totalIncome)}`}
          icon={DollarSign}
          iconBgColor="bg-[#fffbeb]"
          iconColor="text-[#f59e0b]"
        // trend={{ value: 12, isUp: true, label: 'This Month' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <Chart
            data={chartData}
            title="User Registrations"
            currentRange={currentRange}
            onRangeChange={setCurrentRange}
            isFetching={isFetching && chartData.length === 0}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="p-6 border-b border-gray-50 bg-white flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-800">Recent Activities</h3>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {recentActivities.map((activity, index) => {
                const Icon = getActivityIcon(activity.action);
                return (
                  <div key={activity.id} className={`p-5 flex items-start space-x-4 hover:bg-gray-50 transition-colors ${index !== recentActivities.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex-shrink-0 flex items-center justify-center">
                      <Icon className="text-blue-600" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Plain text: userName is user-controlled, never render it as HTML */}
                      <div className="text-sm font-medium text-gray-900 leading-snug">
                        {getActivityDescription(activity)}
                      </div>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard
          title="View Users"
          subtitle="Registered Users"
          icon={Users}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
          onClick={() => navigate('/users')}
        />
        <QuickActionCard
          title="View Companies"
          subtitle="Registered Companies"
          icon={Building}
          iconBgColor="bg-teal-50"
          iconColor="text-teal-600"
          onClick={() => navigate('/company')}
        />
        <QuickActionCard
          title="Edit Plans"
          subtitle="Edit Subscription Plans"
          icon={FileText}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
          onClick={() => navigate('/subscriptions')}
        />
      </div>
    </div>
  );
};

export default Dashboard;
