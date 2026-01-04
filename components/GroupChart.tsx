import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { GroupStats } from '../types';

interface GroupChartProps {
  data: GroupStats[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as GroupStats;
    return (
      <div className="bg-gray-900 text-white p-3 rounded shadow-lg text-xs border-0">
        <p className="font-bold mb-1 text-sm">{data.name}</p>
        <p className="flex items-center space-x-2">
            <span className="text-gray-300">Credits:</span>
            <span className="font-mono">{data.credits.toLocaleString()}</span>
        </p>
        <p className="flex items-center space-x-2">
            <span className="text-gray-300">Members:</span>
            <span className="font-mono">{data.activeMembers} / {data.totalMembers}</span>
        </p>
      </div>
    );
  }
  return null;
};

const GroupChart: React.FC<GroupChartProps> = ({ data }) => {
  // Take only top 5-7 for visual clarity in the chart
  const chartData = data.slice(0, 7);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Top Groups by Usage (Credits)</h3>
        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
                <span className="w-3 h-3 bg-primary rounded-sm mr-2"></span> Top Usage
            </div>
            <div className="flex items-center">
                <span className="w-3 h-3 bg-gray-300 rounded-sm mr-2"></span> Others
            </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={120} 
            tick={{ fontSize: 12, fill: '#666' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F5F5F5', opacity: 0.5 }} />
          <Bar dataKey="credits" radius={[0, 4, 4, 0]} barSize={24}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 0 ? '#7420FF' : '#E0E0E0'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GroupChart;