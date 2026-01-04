import React, { useState, useMemo } from 'react';
import { ChevronDown, Calendar, Download, Info, AlertCircle, RefreshCw } from 'lucide-react';
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
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: '2023-11-01', end: '2023-11-30' });
  const [isExporting, setIsExporting] = useState(false);

  // --- Core Logic: Dynamic Calculation of Group Stats (P0) ---
  const calculatedGroupData = useMemo(() => {
    // 1. Initialize map with 0 values
    const statsMap = new Map<string, GroupStats>();
    
    GROUP_DEFINITIONS.forEach((def, index) => {
        statsMap.set(def.id, {
            id: def.id,
            rank: 0, // Will calculate later
            name: def.name,
            totalMembers: 0,
            activeMembers: 0,
            requests: 0,
            credits: 0,
            isOthers: def.id === 'others'
        });
    });

    // 2. Iterate Members and Split Usage (1/N logic)
    MOCK_MEMBERS.forEach(member => {
        // Determine target groups. If empty, assign to 'others'
        const targetGroupIds = member.groupIds.length > 0 ? member.groupIds : ['others'];
        const splitFactor = targetGroupIds.length;

        targetGroupIds.forEach(groupId => {
            const groupStat = statsMap.get(groupId);
            if (groupStat) {
                groupStat.totalMembers += 1; // Count member in each group they belong to
                
                // Only count as active if they have recent activity (Mock logic based on requestCount > 0)
                if (member.requestCount > 0) {
                    groupStat.activeMembers += 1;
                }

                // Split metrics
                groupStat.requests += Math.round(member.requestCount / splitFactor);
                groupStat.credits += Math.round(member.credits / splitFactor);
            }
        });
    });

    // 3. Convert to Array and Sort for Ranking
    const result = Array.from(statsMap.values());
    
    // Sort by credits desc to assign rank (excluding others)
    const sortedForRank = [...result]
        .filter(g => !g.isOthers)
        .sort((a, b) => b.credits - a.credits);

    // Assign ranks
    sortedForRank.forEach((g, idx) => { g.rank = idx + 1; });
    
    // Re-merge 'Others' (Others doesn't get a numeric rank usually, or is last)
    const others = result.find(g => g.isOthers);
    if(others) others.rank = 999;

    return result.sort((a,b) => a.rank - b.rank);

  }, [dateRange]); // Recalculate if date changes (In a real app, date would filter MOCK_MEMBERS)

  // --- Display Data Logic ---
  const displayData = useMemo(() => {
    if (!selectedGroupId) return calculatedGroupData;
    return calculatedGroupData.filter(g => g.id === selectedGroupId);
  }, [selectedGroupId, calculatedGroupData]);

  // --- Summary Metrics ---
  const totalCredits = useMemo(() => {
    // Always calculate from global calculated data to show context even when filtered? 
    // Or show filtered total? Requirement implies consistency check. 
    // Let's show filtered total if filtered, else global.
    const source = selectedGroupId ? displayData : calculatedGroupData;
    return source.reduce((acc, curr) => acc + curr.credits, 0).toLocaleString();
  }, [selectedGroupId, displayData, calculatedGroupData]);

  const totalRequests = useMemo(() => {
    const source = selectedGroupId ? displayData : calculatedGroupData;
    return source.reduce((acc, curr) => acc + curr.requests, 0).toLocaleString();
  }, [selectedGroupId, displayData, calculatedGroupData]);

  const activeMembersStr = useMemo(() => {
    const source = selectedGroupId ? displayData : calculatedGroupData;
    const active = source.reduce((acc, curr) => acc + curr.activeMembers, 0);
    const total = source.reduce((acc, curr) => acc + curr.totalMembers, 0);
    return `${active} / ${total}`;
  }, [selectedGroupId, displayData, calculatedGroupData]);

  // --- Handlers ---
  
  const handleDateQuickSelect = (months: number) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - months);
    setDateRange({
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
    });
    // In a real app, this would trigger a data fetch.
    // Here, just updating state forces a re-render of useMemo, keeping mockup consistent.
  };

  const handleExportCSV = () => {
      setIsExporting(true);
      setTimeout(() => {
        // CSV Header
        const headers = ['Rank', 'Group Name', 'Total Members', 'Active Members', 'Requests', 'Credit Usage'];
        
        // CSV Rows
        const rows = calculatedGroupData.map(g => [
            g.isOthers ? '-' : g.rank,
            `"${g.name}"`, // Quote names to handle commas
            g.totalMembers,
            g.activeMembers,
            g.requests,
            g.credits
        ].join(','));

        // Combine with BOM for Excel UTF-8 support
        const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
        
        // Create Blob and Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `group_statistics_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setIsExporting(false);
      }, 800); // Simulate processing delay
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#f6f5f8] font-display text-[#131018]">
      
      {/* Top Header Area */}
      <div className="px-4 pt-8 pb-0 md:px-10 lg:px-20 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            통계 <span className="text-gray-400 font-normal text-lg">/ Statistics</span>
            </h1>
            <div className="flex gap-2">
                 <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <span>가이드</span>
                    <Info size={16} />
                </button>
            </div>
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
            
            {/* P0: Disclaimer Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                <Info className="text-blue-500 mt-0.5 flex-shrink-0" size={20} />
                <div className="text-sm text-blue-800 space-y-1">
                    <p className="font-semibold">데이터 집계 기준 안내</p>
                    <ul className="list-disc list-inside opacity-90 space-y-0.5">
                        <li>통계는 현재 멤버 구성을 기준으로 실시간 집계됩니다.</li>
                        <li>여러 그룹에 소속된 멤버의 사용량(요청 수, 크레딧)은 <strong>소속된 그룹 수에 따라 균등하게 분배(1/N)</strong>되어 합산됩니다.</li>
                        <li>그룹이 지정되지 않은 멤버의 사용량은 <strong>'Others'</strong> 항목에 포함됩니다.</li>
                    </ul>
                </div>
            </div>

            {/* Toolbar: Context on Left, Scope on Right */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                {/* Left: Primary Filter (Context) */}
                <div className="flex items-center gap-3">
                    <GroupSelect 
                        options={GROUP_OPTIONS} 
                        onSelect={setSelectedGroupId} 
                    />
                    {selectedGroupId && (
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full animate-in fade-in zoom-in">
                            Filtered: {GROUP_DEFINITIONS.find(g => g.id === selectedGroupId)?.name}
                        </span>
                    )}
                </div>

                {/* Right: Global Controls (Time & Export) */}
                <div className="flex flex-wrap items-center gap-3">
                     {/* Quick Date Selectors */}
                     <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button onClick={() => handleDateQuickSelect(1)} className="px-3 py-1.5 text-xs font-medium rounded-md hover:bg-white hover:shadow-sm transition-all text-gray-600">1M</button>
                        <button onClick={() => handleDateQuickSelect(3)} className="px-3 py-1.5 text-xs font-medium rounded-md hover:bg-white hover:shadow-sm transition-all text-gray-600">3M</button>
                        <button onClick={() => handleDateQuickSelect(6)} className="px-3 py-1.5 text-xs font-medium rounded-md hover:bg-white hover:shadow-sm transition-all text-gray-600">6M</button>
                     </div>

                     {/* Date Range Picker */}
                    <div className="flex items-center bg-white border border-[#e5e7eb] rounded-lg px-2 h-10 shadow-sm hover:border-primary transition-colors">
                        <Calendar size={16} className="text-gray-500 mr-2" />
                        <input 
                            type="date" 
                            value={dateRange.start}
                            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                            className="text-sm font-medium text-gray-700 focus:outline-none w-32"
                        />
                        <span className="text-gray-400 mx-2">-</span>
                        <input 
                            type="date" 
                            value={dateRange.end}
                            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                            className="text-sm font-medium text-gray-700 focus:outline-none w-32"
                        />
                    </div>

                     {/* Export Button */}
                     <button 
                        onClick={handleExportCSV}
                        disabled={isExporting}
                        className="flex h-10 items-center gap-2 rounded-lg border border-transparent px-4 text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 transition-colors disabled:opacity-50"
                    >
                        {isExporting ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />}
                        <span>{isExporting ? 'Exporting...' : 'CSV Export'}</span>
                    </button>
                </div>
            </div>
          
          {/* 1. Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard 
              title="Total Credits" 
              value={totalCredits} 
              subValue="Sum of all groups + Others"
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

          {/* 2. Main Visualization Section */}
          <div className="w-full">
              <GroupChart data={calculatedGroupData} />
          </div>

          {/* 3. Data Grid Section */}
          <div className="space-y-4 pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-800">Detailed Group Data</h3>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        Total {calculatedGroupData.length} Groups
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