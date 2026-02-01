import { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  onClick?: () => void;
}

const QuickActionCard = ({
  title,
  subtitle,
  icon: Icon,
  iconBgColor,
  iconColor,
  onClick,
}: QuickActionCardProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left hover:border-blue-200"
    >
      <div className="flex items-start space-x-4">
        <div className={`${iconBgColor} p-3 rounded-lg flex-shrink-0`}>
          <Icon className={iconColor} size={20} />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
    </button>
  );
};

export default QuickActionCard;
