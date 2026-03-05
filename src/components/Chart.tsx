import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { ChevronDown } from 'lucide-react';

interface ChartDataPoint {
  month: string;
  value: number;
}

interface ChartProps {
  data: ChartDataPoint[];
  title: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-xl border border-gray-100 rounded-xl">
        <p className="text-sm font-semibold text-gray-900 mb-1">{payload[0].payload.month}</p>
        <p className="text-sm text-blue-600 font-bold">
          Users: {payload[0].value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const Chart = ({ data, title }: ChartProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentRange, setCurrentRange] = useState('yearly');

  const ranges = [
    { label: 'Monthly', value: 'monthly' },
    { label: '3 monthly', value: '3months' },
    { label: '6 monthly', value: '6months' },
    { label: 'Yearly', value: 'yearly' }
  ];

  const currentRangeLabel = ranges.find(r => r.value === currentRange)?.label || 'Yearly';

  // Map data to recharts format if necessary (though we use month/value directly)
  // We use the same keys as the backend: 'month' and 'value'

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-[450px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium rounded-xl transition-colors"
          >
            {currentRangeLabel}
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                {ranges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => {
                      setCurrentRange(range.value);
                      setIsDropdownOpen(false);
                      // Note: In a real app, you'd trigger a refetch here
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors ${currentRange === range.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'
                      }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
              tickFormatter={(value) => `${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
