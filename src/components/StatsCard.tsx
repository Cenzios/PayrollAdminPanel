import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

const StatsCard = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconBgColor,
  iconColor,
}: StatsCardProps) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`${iconBgColor} p-3 rounded-lg`}>
          <Icon className={iconColor} size={24} />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
          {title}
        </p>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <TrendingUp className="text-green-600" size={16} />
            ) : (
              <TrendingDown className="text-red-600" size={16} />
            )}
            <span
              className={`text-sm font-semibold ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {Math.abs(change)}
              {changeLabel.includes('%') ? '%' : ''}
            </span>
            <span className="text-xs text-gray-500 ml-1">{changeLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
