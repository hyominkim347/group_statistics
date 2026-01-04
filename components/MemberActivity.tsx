import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Download, Calendar, Info, ChevronDown } from 'lucide-react';
import GroupSelect from './GroupSelect';
import MemberRankingTable from './MemberRankingTable';
import { GROUP_OPTIONS, MOCK_GROUP_DATA, MOCK_MEMBER_RANKING } from '../constants';

interface MemberActivityProps {
    onNavigate?: (page: string) => void;
}

const MemberActivity: React.FC<MemberActivityProps> = ({ onNavigate }) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Generate data based on selected filter
  const dailyActivityData = useMemo(() => {
    // If a group is selected, we scale down the random data to simulate a subset
    const factor = selectedGroupId ? 0.3 : 1.0; 

    return Array.from({ length: 31 }, (_, i) => ({
        day: `12.${i + 1}`,
        date: `2023-12-${String(i + 1).padStart(2, '0')}`,
        activeMembers: Math.floor(
            (Math.random() * 40 + 10 + (i % 7) * 2) * factor
        ),
    }));
  }, [selectedGroupId]);

  const averageDaily = useMemo(() => {
    return Math.round(
        dailyActivityData.reduce((acc, curr) => acc + curr.activeMembers, 0) / dailyActivityData.length
    );
  }, [dailyActivityData]);

  // Filter rankings if a group is selected
  const displayedRanking = useMemo(() => {
      if (!selectedGroupId) return MOCK_MEMBER_RANKING;
      
      const groupName = MOCK_GROUP_DATA.find(g => g.id === selectedGroupId)?.name;
      // Filter mock data by group name
      const filtered = MOCK_MEMBER_RANKING.filter(m => m.group === groupName);
      
      // If no match found in mock (since mock is small), return empty or full based on your preference. 
      // Returning filtered is correct behavior.
      return filtered;
  }, [selectedGroupId]);

  return (
    <div className="flex flex-col h-full bg-[#f6f5f8] overflow-hidden">
      <div className="px-4 pt-8 pb-0 md:px-10 lg:px-20 max-w-7xl mx-auto w-full space-y-6">
          {/* Top Header Area */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              통계 <span className="text-gray-400 font-normal text-lg">/ Statistics</span>
            </h1>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span>LLM 통계 보기</span>
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              <button 
                onClick={() => onNavigate?.('usage')}
                className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                사용량 (Usage)
              </button>
              <button 
                className="pb-3 text-sm font-medium text-primary border-b-2 border-primary"
                aria-current="page"
              >
                멤버 수 (Member Count)
              </button>
              <button 
                onClick={() => onNavigate?.('analytics')}
                className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                그룹 통계 (Group)
              </button>
            </div>
          </div>
      </div>

      {/* Page Content Container */}
      <div className="flex-1 overflow-y-auto px-4 py-8 md:px-10 lg:px-20 pt-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Standardized Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left: Primary Filter (Context) - Added Group Filter */}
              <div className="flex items-center gap-3">
                   <GroupSelect 
                        options={GROUP_OPTIONS} 
                        onSelect={setSelectedGroupId} 
                    />
                    {selectedGroupId && (
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full animate-in fade-in zoom-in">
                            Filtered: {MOCK_GROUP_DATA.find(g => g.id === selectedGroupId)?.name}
                        </span>
                    )}
              </div>

              {/* Right: Global Controls (Time & Export) */}
              <div className="flex items-center gap-3">
                {/* Date Range Picker (Standardized) */}
                <div className="relative group">
                    <button className="flex h-10 items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm font-medium text-[#374151] hover:border-primary focus:outline-none shadow-sm transition-all">
                        <Calendar size={18} className="text-gray-500" />
                        <span>Nov 01, 2023 - Nov 30, 2023</span>
                        <ChevronDown size={16} className="text-gray-400" />
                    </button>
                </div>

                {/* Export Button */}
                <button className="flex h-10 items-center gap-2 rounded-lg border border-transparent px-3 text-sm font-bold text-primary hover:bg-primary/5 transition-colors">
                    <Download size={18} />
                    <span>Export</span>
                </button>
              </div>
          </div>

          {/* Main Chart Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            
            {/* Card Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">활성 멤버 수 (Active Members)</h2>
                    <div className="group relative">
                        <Info size={18} className="text-gray-400 cursor-help" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                            The number of unique members who made at least one request on that day.
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                        월간 (Monthly)
                    </button>
                </div>
            </div>

            {/* Summary Stat */}
            <div className="mb-6">
                <p className="text-sm text-gray-600">
                    일일 평균 활성 멤버 수 (Daily Avg): <span className="font-bold text-gray-900 text-lg ml-1">{averageDaily}</span>
                </p>
            </div>

            {/* Chart */}
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyActivityData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  barSize={12}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    dy={10}
                    interval={1} 
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#F5F5F5' }}
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                        return (
                            <div className="bg-gray-900 text-white p-3 rounded shadow-lg text-xs">
                            <p className="mb-1 font-medium">{label}</p>
                            <p className="font-bold">Active: {payload[0].value}</p>
                            </div>
                        );
                        }
                        return null;
                    }}
                   />
                  <Bar 
                    dataKey="activeMembers" 
                    fill="#7420FF" 
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Member Ranking Section */}
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800">Member Ranking</h3>
                  {/* Optional: Add export or filter specific to table here if needed */}
              </div>
              <MemberRankingTable data={displayedRanking} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberActivity;