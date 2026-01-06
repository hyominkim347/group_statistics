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
  title: string;
  dataKey: keyof GroupStats;
  barColor?: string;
}

const CustomTooltip = ({ active, payload, label, dataKey }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as GroupStats;
    const value = payload[0].value;
    
    return (
      <div className="bg-gray-900 text-white p-3 rounded shadow-lg text-xs border-0 min-w-[150px]">
        <p className="font-bold mb-2 text-sm border-b border-gray-700 pb-1">{data.name}</p>
        <div className="space-y-1">
            <p className="flex justify-between items-center">
                <span className="text-gray-400 capitalize">{dataKey.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span className="font-mono font-bold text-yellow-400">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </span>
            </p>
            {dataKey !== 'activeMembers' && (
                <p className="flex justify-between items-center">
                    <span className="text-gray-400">Members:</span>
                    <span className="font-mono">{data.activeMembers} / {data.totalMembers}</span>
                </p>
            )}
             {dataKey === 'activeMembers' && (
                <p className="flex justify-between items-center">
                    <span className="text-gray-400">Total Size:</span>
                    <span className="font-mono">{data.totalMembers}</span>
                </p>
            )}
        </div>
      </div>
    );
  }
  return null;
};

const GroupChart: React.FC<GroupChartProps> = ({ data, title, dataKey, barColor = '#7420FF' }) => {
  // Take only top 7 for visual clarity
  const chartData = data.slice(0, 7);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-[340px] flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-gray-800">{title}</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4">Top 7 Groups</p>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
            >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis type="number" hide />
            <YAxis 
                dataKey="name" 
                type="category" 
                width={110} 
                tick={{ fontSize: 11, fill: '#666', fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
            />
            <Tooltip 
                content={<CustomTooltip dataKey={dataKey} />} 
                cursor={{ fill: '#F5F5F5', opacity: 0.5 }} 
            />
            <Bar dataKey={dataKey} radius={[0, 4, 4, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? barColor : '#E5E7EB'} 
                />
                ))}
            </Bar>
            </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GroupChart;