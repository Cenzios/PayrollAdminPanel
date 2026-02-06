import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isUp: boolean;
    label: string;
  };
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

const StatsCard = ({
  title,
  value,
  trend,
  icon: Icon,
  iconBgColor,
  iconColor,
}: StatsCardProps) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between mb-6">
        <div className={`${iconBgColor} p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={iconColor} size={24} />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-[11px] text-gray-400 uppercase tracking-[0.1em] font-bold">
          {title}
        </p>
        <div className="flex items-baseline justify-between -mt-1">
          <h3 className="text-3xl font-extrabold text-[#111827] tracking-tight">{value}</h3>

          {trend && (
            <div className={`flex items-center space-x-1 py-1 px-2 rounded-full text-[10px] font-bold ${trend.isUp ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
              {trend.isUp ? (
                <TrendingUp size={12} className="stroke-[3]" />
              ) : (
                <TrendingDown size={12} className="stroke-[3]" />
              )}
              <span>{trend.value}%</span>
              <span className="text-gray-400 font-medium ml-1">{trend.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
