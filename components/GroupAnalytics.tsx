import React, { useState, useMemo } from 'react';
import { Calendar, Download, Info, RefreshCw, AlertCircle } from 'lucide-react';
import SummaryCard from './SummaryCard';
import GroupChart from './GroupChart';
import DataTable from './DataTable';
import GroupSelect from './GroupSelect';
import { MOCK_MEMBERS, GROUP_DEFINITIONS, GROUP_OPTIONS } from '../constants';
import { GroupStats } from '../types';

interface GroupAnalyticsProps {
  onNavigate?: (page: string) => void;
}

const GroupAnalytics: React.FC<GroupAnalyticsProps> = ({ onNavigate }) => {
  // --- Filter States ---
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: thirtyDaysAgo, end: today });
  const [isExporting, setIsExporting] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  // --- Date Handling ---
  const handleDateChange = (field: 'start' | 'end', value: string) => {
      const newRange = { ...dateRange, [field]: value };
      const start = new Date(newRange.start);
      const end = new Date(newRange.end);
      const oneYear = 365 * 24 * 60 * 60 * 1000;

      if (end < start) {
          setDateError("End date must be after start date.");
      } else if ((end.getTime() - start.getTime()) > oneYear) {
          setDateError("Maximum query period is 12 months.");
      } else {
          setDateError(null);
      }
      setDateRange(newRange);
  };

  // --- Core Logic: Dynamic Calculation (Full Attribution) ---
  const calculatedGroupData = useMemo(() => {
    // Initialize map
    const statsMap = new Map<string, GroupStats>();
    
    GROUP_DEFINITIONS.forEach((def) => {
        statsMap.set(def.id, {
            id: def.id,
            rank: 0,
            name: def.name,
            totalMembers: 0,
            activeMembers: 0,
            requests: 0,
            credits: 0,
            avgCredits: 0,
            llmCalls: 0,
            isOthers: def.id === 'others'
        });
    });

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    // Iterate Members
    MOCK_MEMBERS.forEach(member => {
        const targetGroupIds = member.groupIds.length > 0 ? member.groupIds : ['others'];
        // NOTE: Policy update - Removed 1/N split. 
        // Usage is fully attributed to each group the member belongs to.
        
        const memberLastActive = new Date(member.lastActive);
        const isActiveInPeriod = memberLastActive >= startDate && memberLastActive <= endDate;

        targetGroupIds.forEach(groupId => {
            const groupStat = statsMap.get(groupId);
            if (groupStat) {
                groupStat.totalMembers += 1;
                
                if (isActiveInPeriod) {
                    groupStat.activeMembers += 1;
                }

                if (isActiveInPeriod) {
                    groupStat.requests += member.requestCount;
                    groupStat.credits += member.credits;
                    // Mock LLM Calls: Correlate with requests but add variance for demo
                    // E.g. 1 Request ~ 1.2 to 2.5 LLM Calls
                    const multiplier = 1.2 + (member.requestCount % 10) / 10; 
                    groupStat.llmCalls += Math.round(member.requestCount * multiplier);
                }
            }
        });
    });

    const result = Array.from(statsMap.values());
    
    // Calculate Avg Credits
    result.forEach(g => {
        g.avgCredits = g.totalMembers > 0 ? Math.round(g.credits / g.totalMembers) : 0;
    });

    // Sort by credits desc for Rank
    const sortedForRank = [...result]
        .filter(g => !g.isOthers)
        .sort((a, b) => b.credits - a.credits);

    sortedForRank.forEach((g, idx) => { g.rank = idx + 1; });
    
    const others = result.find(g => g.isOthers);
    if(others) others.rank = 999;

    return result.sort((a,b) => a.rank - b.rank);

  }, [dateRange]);

  const displayData = useMemo(() => {
    if (!selectedGroupId) return calculatedGroupData;
    return calculatedGroupData.filter(g => g.id === selectedGroupId);
  }, [selectedGroupId, calculatedGroupData]);

  // --- Prepared Data for Charts ---
  // Create copies and sort them specifically for each chart type
  const dataSortedByCredits = useMemo(() => [...displayData].sort((a, b) => b.credits - a.credits), [displayData]);
  const dataSortedByRequests = useMemo(() => [...displayData].sort((a, b) => b.requests - a.requests), [displayData]);
  const dataSortedByCalls = useMemo(() => [...displayData].sort((a, b) => b.llmCalls - a.llmCalls), [displayData]);
  const dataSortedByActive = useMemo(() => [...displayData].sort((a, b) => b.activeMembers - a.activeMembers), [displayData]);


  // --- Summary Metrics ---
  const totalCredits = useMemo(() => {
    return displayData.reduce((acc, curr) => acc + curr.credits, 0).toLocaleString();
  }, [displayData]);

  const totalRequests = useMemo(() => {
    return displayData.reduce((acc, curr) => acc + curr.requests, 0).toLocaleString();
  }, [displayData]);

  const activeMembersStr = useMemo(() => {
    const active = displayData.reduce((acc, curr) => acc + curr.activeMembers, 0);
    return active.toLocaleString();
  }, [displayData]);

  const handleExportCSV = () => {
      setIsExporting(true);
      setTimeout(() => {
        const headers = ['Rank', 'Group Name', 'Total Members', 'Active Members', 'Total Queries', 'LLM Calls', 'LLM Credit Usage'];
        const rows = calculatedGroupData.map(g => [
            g.isOthers ? '-' : g.rank,
            `"${g.name}"`,
            g.totalMembers,
            `${g.activeMembers}/${g.totalMembers}`,
            g.requests,
            g.llmCalls,
            g.credits
        ].join(','));

        const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `GroupStatistics_${dateRange.start}_${dateRange.end}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setIsExporting(false);
      }, 800);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#f6f5f8] font-display text-[#131018]">
      
      {/* Top Header Area */}
      <div className="px-4 pt-8 pb-0 md:px-10 lg:px-20 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            통계 <span className="text-gray-400 font-normal text-lg">/ Statistics</span>
            </h1>
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
            
            {/* Enterprise Disclaimer */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3 shadow-sm">
                <Info className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
                <div className="text-sm text-blue-900 space-y-1">
                    <p className="font-bold">데이터 집계 기준 안내</p>
                    <ul className="list-disc list-inside opacity-90 space-y-1 text-blue-800">
                        <li>현재 멤버 구성을 기준으로 집계된 데이터입니다.</li>
                        <li>다중 소속 멤버의 사용량은 <strong>소속된 모든 그룹에 중복 집계</strong>됩니다.</li>
                        <li>그룹 미지정 멤버는 <strong>'Others'</strong>에 포함됩니다.</li>
                    </ul>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                    <GroupSelect 
                        options={GROUP_OPTIONS} 
                        onSelect={setSelectedGroupId} 
                    />
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center bg-white border rounded-lg px-2 h-10 shadow-sm transition-colors ${dateError ? 'border-red-300 ring-1 ring-red-200' : 'border-[#e5e7eb] hover:border-primary'}`}>
                            <Calendar size={16} className="text-gray-500 mr-2" />
                            <input 
                                type="date" 
                                value={dateRange.start}
                                max={dateRange.end}
                                onChange={(e) => handleDateChange('start', e.target.value)}
                                className="text-sm font-medium text-gray-700 focus:outline-none w-32"
                            />
                            <span className="text-gray-400 mx-2">-</span>
                            <input 
                                type="date" 
                                value={dateRange.end}
                                min={dateRange.start}
                                onChange={(e) => handleDateChange('end', e.target.value)}
                                className="text-sm font-medium text-gray-700 focus:outline-none w-32"
                            />
                        </div>
                         <button 
                            onClick={handleExportCSV}
                            disabled={isExporting}
                            className="flex h-10 items-center gap-2 rounded-lg border border-transparent px-4 text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                        >
                            {isExporting ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />}
                            <span>CSV Export</span>
                        </button>
                    </div>
                    {dateError && (
                        <span className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle size={10} /> {dateError}
                        </span>
                    )}
                </div>
            </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard 
              title="Total Project Credits" 
              value={totalCredits} 
              subValue="총 크레딧 사용량"
              note="Sum of all group stats"
              highlight 
            />
            <SummaryCard 
              title="Total Project Requests" 
              value={totalRequests} 
              subValue="총 쿼리 발생 수"
              note="Sum of all group stats"
            />
            <SummaryCard 
              title="Total Active Members" 
              value={activeMembersStr} 
              subValue="기간 내 활성 멤버"
              note="Sum of all group stats"
            />
          </div>

          {/* Main Visualization Section: 2x2 Grid */}
          <div>
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-bold text-gray-800">Visual Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Top Credits (Primary) */}
                <GroupChart 
                    title="Top Groups by Credit Usage" 
                    data={dataSortedByCredits} 
                    dataKey="credits" 
                    barColor="#7420FF" 
                />
                
                {/* 2. Top Requests */}
                <GroupChart 
                    title="Top Groups by Member Requests" 
                    data={dataSortedByRequests} 
                    dataKey="requests" 
                    barColor="#3B82F6" 
                />
                
                {/* 3. Top LLM Calls */}
                <GroupChart 
                    title="Top Groups by LLM Calls" 
                    data={dataSortedByCalls} 
                    dataKey="llmCalls" 
                    barColor="#10B981" 
                />

                {/* 4. Top Active Members */}
                <GroupChart 
                    title="Top Groups by Active Members" 
                    data={dataSortedByActive} 
                    dataKey="activeMembers" 
                    barColor="#F59E0B" 
                />
            </div>
          </div>

          {/* Detailed Table */}
          <div className="space-y-4 pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-800">Group Usage Detail</h3>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        {dateRange.start} ~ {dateRange.end}
                    </span>
                </div>
            </div>
            <DataTable data={displayData} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default GroupAnalytics;