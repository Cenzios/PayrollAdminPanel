interface ChartDataPoint {
  month: string;
  value: number;
}

interface ChartProps {
  data: ChartDataPoint[];
  title: string;
}

const Chart = ({ data, title }: ChartProps) => {
  const maxValue = data.length > 0 ? Math.max(...data.map((d) => d.value)) : 0;
  const minValue = data.length > 0 ? Math.min(...data.map((d) => d.value)) : 0;
  const range = maxValue - minValue;
  const padding = range > 0 ? range * 0.1 : 10;
  const adjustedMax = maxValue + padding;
  const adjustedMin = Math.max(0, minValue - padding);

  const height = 400;
  const width = 100;

  const yTicks = [0, 1000, 2000, 3000, 4000, 5000];

  const points = data.length > 0
    ? data
      .map((point, index) => {
        const x = (index / (data.length - 1)) * width;
        const y =
          height - ((point.value - adjustedMin) / (adjustedMax - adjustedMin)) * height;
        return `${x},${y}`;
      })
      .join(' ')
    : '';

  const pathD = points ? `M 0,${height} L ${points} L ${width},${height} Z` : '';

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-6">
        {title}
      </h3>

      <div className="relative">
        <div className="flex">
          <div className="flex flex-col justify-between text-xs text-gray-400 pr-4 h-96">
            {yTicks.reverse().map((tick) => (
              <div key={tick}>{tick / 1000}K</div>
            ))}
          </div>

          <div className="flex-1 relative">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-96"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {yTicks.map((_, index) => (
                <line
                  key={index}
                  x1="0"
                  y1={(index * height) / (yTicks.length - 1)}
                  x2={width}
                  y2={(index * height) / (yTicks.length - 1)}
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              ))}

              {pathD && <path d={pathD} fill="url(#areaGradient)" />}

              {points && (
                <polyline
                  points={points}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
              )}
            </svg>

            <div className="flex justify-between text-xs text-gray-400 mt-2">
              {data.map((point) => (
                <span key={point.month}>{point.month}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
