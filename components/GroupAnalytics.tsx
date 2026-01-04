import React, { useState, useMemo } from 'react';
import { ChevronDown, Calendar, Download } from 'lucide-react';
import SummaryCard from './SummaryCard';
import GroupChart from './GroupChart';
import DataTable from './DataTable';
import GroupSelect from './GroupSelect';
import { MOCK_GROUP_DATA, GROUP_OPTIONS } from '../constants';

interface GroupAnalyticsProps {
  onNavigate?: (page: string) => void;
}

const GroupAnalytics: React.FC<GroupAnalyticsProps> = ({ onNavigate }) => {
  // State for filtering
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Computed data based on filter
  const displayData = useMemo(() => {
    if (!selectedGroupId) return MOCK_GROUP_DATA;
    return MOCK_GROUP_DATA.filter(g => g.id === selectedGroupId);
  }, [selectedGroupId]);

  // If filtered, we calculate specific totals, otherwise global totals
  const totalCredits = useMemo(() => {
    const source = selectedGroupId ? displayData : MOCK_GROUP_DATA;
    return source.reduce((acc, curr) => acc + curr.credits, 0).toLocaleString();
  }, [selectedGroupId, displayData]);

  const totalRequests = useMemo(() => {
    const source = selectedGroupId ? displayData : MOCK_GROUP_DATA;
    return source.reduce((acc, curr) => acc + curr.requests, 0).toLocaleString();
  }, [selectedGroupId, displayData]);

  const activeMembersStr = useMemo(() => {
    const source = selectedGroupId ? displayData : MOCK_GROUP_DATA;
    const active = source.reduce((acc, curr) => acc + curr.activeMembers, 0);
    const total = source.reduce((acc, curr) => acc + curr.totalMembers, 0);
    return `${active} / ${total}`;
  }, [selectedGroupId, displayData]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#f6f5f8] font-display text-[#131018]">
      
      {/* Top Header Area with Tabs */}
      <div className="px-4 pt-8 pb-0 md:px-10 lg:px-20 max-w-7xl mx-auto w-full space-y-6">
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
                    onClick={() => onNavigate?.('member-activity')}
                    className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                    멤버 수 (Member Count)
                </button>
                <button 
                    className="pb-3 text-sm font-medium text-primary border-b-2 border-primary"
                    aria-current="page"
                >
                    그룹 통계 (Group)
                </button>
            </div>
        </div>
      </div>

      {/* Scrollable Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-8 pt-6">
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Standardized Toolbar: Context on Left, Scope on Right */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Primary Filter (Context) */}
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
                     {/* Date Range Picker */}
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
          
          {/* 1. Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard 
              title="Total Credits" 
              value={totalCredits} 
              highlight 
            />
            <SummaryCard 
              title="Total Requests" 
              value={totalRequests} 
            />
            <SummaryCard 
              title="Active Members" 
              value={activeMembersStr} 
              subValue="Active users vs Total registered"
            />
          </div>

          {/* 2. Main Visualization Section (Full Width Now) */}
          <div className="w-full">
              <GroupChart data={MOCK_GROUP_DATA} />
          </div>

          {/* 3. Data Grid Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">Detailed Group Data</h3>
            </div>
            <DataTable data={displayData} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default GroupAnalytics;