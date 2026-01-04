import React, { useState, useMemo } from 'react';
import { ChevronDown, Calendar, Download, Info } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import GroupSelect from './GroupSelect';
import { GROUP_OPTIONS, MOCK_GROUP_DATA } from '../constants';

interface UsageAnalyticsProps {
    onNavigate?: (page: string) => void;
}

// --- Mock Data Helpers ---

const getPseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

const generateDailyData = (base: number, variance: number, factor: number, seedBase: number) => 
  Array.from({ length: 14 }, (_, i) => {
    const rnd = getPseudoRandom(seedBase + i * 23); // Stable random
    // Add some curve to the data so it looks realistic
    const trend = Math.cos(i * 0.5) * (variance * 0.5);
    const value = Math.max(0, Math.floor((base + trend + (rnd - 0.5) * variance) * factor));
    return {
        date: `12.${28 - (13 - i)}`, 
        value
    };
  });

const TOP_APPS_MOCK = [
    { rank: 1, name: 'Answer Agent', type: 'Conversation App', value: 89, sub: '대화형 앱' },
    { rank: 2, name: 'Search API', type: 'Gen API', value: 42, sub: '답변 생성 API' },
    { rank: 3, name: 'Python Runner', type: 'Conversation App', value: 12, sub: '대화형 앱' },
    { rank: 4, name: 'Deep Research', type: 'Conversation App', value: 8, sub: '대화형 앱' },
];

// --- Sub-components ---

interface MetricCardProps {
    title: string;
    total: number;
    breakdown: { label: string; count: number; active?: boolean }[];
    chartData: any[];
    topList: typeof TOP_APPS_MOCK;
    yAxisMax?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, total, breakdown, chartData, topList }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* 1. Header */}
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <div className="group relative">
                    <Info size={18} className="text-gray-400 cursor-help" />
                </div>
            </div>

            {/* 2. Filter Buttons Row */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary bg-primary/5 text-primary text-sm font-semibold transition-colors">
                    <span>전체 (Total)</span>
                    <span className="bg-white text-primary px-1.5 rounded text-xs font-bold shadow-sm">{total.toLocaleString()}</span>
                </button>
                {breakdown.map((item, idx) => (
                     <button key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors">
                        <span>{item.label}</span>
                        <span className="bg-gray-100 text-gray-500 px-1.5 rounded text-xs font-bold">{item.count.toLocaleString()}</span>
                    </button>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* 3. Main Chart */}
                <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barSize={16}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#9ca3af', fontSize: 12 }} 
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#9ca3af', fontSize: 12 }} 
                            />
                            <Tooltip 
                                cursor={{ fill: '#F3E8FF', opacity: 0.4 }}
                                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="value" fill="#7420FF" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* 4. Top List Sidebar */}
                <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-6">
                     <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-gray-700">{title} 상위 (Top)</h4>
                        <Info size={14} className="text-gray-400" />
                     </div>
                     
                     <div className="space-y-4">
                        {topList.map((item) => (
                            <div key={item.rank} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <span className="flex-shrink-0 w-5 text-sm font-bold text-gray-400 text-center">{item.rank}</span>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-semibold text-gray-900 truncate" title={item.name}>{item.name}</span>
                                        <span className="text-xs text-gray-500 truncate">{item.sub}</span>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{item.value.toLocaleString()}</span>
                            </div>
                        ))}
                     </div>
                     
                     {/* "Others" Mock */}
                     <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                         <div className="flex flex-col">
                             <span className="text-sm font-semibold text-gray-600">기타 (Others)</span>
                             <span className="text-xs text-gray-400">Remaining items</span>
                         </div>
                         <span className="text-sm font-bold text-gray-600">...</span>
                     </div>
                </div>
            </div>
        </div>
    );
}

// --- Main Component ---

const UsageAnalytics: React.FC<UsageAnalyticsProps> = ({ onNavigate }) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Memoize all data calculations to update when selectedGroupId changes
  const { metrics, chartData, topList } = useMemo(() => {
    // Generate parameters based on selected group to ensure deterministic but distinct data
    let factor = 1.0;
    let seedBase = 42; // Default seed

    if (selectedGroupId) {
        // Create a hash from ID for factor and seed
        const hash = selectedGroupId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        factor = 0.2 + (hash % 60) / 100; // Factor between 0.2 and 0.8
        seedBase = hash;
    }

    const charts = {
        requests: generateDailyData(80, 25, factor, seedBase + 100),
        credits: generateDailyData(450, 150, factor, seedBase + 200),
        calls: generateDailyData(60, 20, factor, seedBase + 300)
    };

    const data = {
        requests: {
          total: Math.floor(1050 * factor),
          breakdown: [
             { label: '답변형 앱', count: Math.floor(15 * factor) },
             { label: '대화형 앱', count: Math.floor(980 * factor) },
             { label: '답변 생성 API', count: Math.floor(55 * factor) },
             { label: '지식 베이스', count: 0 },
          ]
        },
        credits: {
          total: Math.floor(6500 * factor),
          breakdown: [
             { label: '답변형 앱', count: Math.floor(80 * factor) },
             { label: '대화형 앱', count: Math.floor(5800 * factor) },
             { label: '답변 생성 API', count: Math.floor(620 * factor) },
             { label: '지식 베이스', count: 0 },
          ]
        },
        calls: {
          total: Math.floor(820 * factor),
          breakdown: [
             { label: '답변형 앱', count: Math.floor(12 * factor) },
             { label: '대화형 앱', count: Math.floor(750 * factor) },
             { label: '답변 생성 API', count: Math.floor(58 * factor) },
             { label: '지식 베이스', count: 0 },
          ]
        }
    };

    // Update Top List based on factor as well
    const topList = TOP_APPS_MOCK.map(item => ({
        ...item,
        value: Math.floor(item.value * factor * (1 + (seedBase % 10)/20)) // Add slight variation
    })).sort((a, b) => b.value - a.value);

    return { metrics: data, chartData: charts, topList };
  }, [selectedGroupId]);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#f6f5f8] font-display text-[#131018]">
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
                    className="pb-3 text-sm font-medium text-primary border-b-2 border-primary"
                    aria-current="page"
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
                    onClick={() => onNavigate?.('analytics')}
                    className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                    그룹 통계 (Group)
                </button>
                </div>
            </div>
      </div>

      <main className="px-4 py-8 md:px-10 lg:px-20 pt-6">
        <div className="mx-auto max-w-7xl space-y-8">

            {/* Toolbar Section - Group Filter and Global Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Group Filter */}
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

            {/* --- Metric Cards Section --- */}
            <div className="space-y-6">
                
                {/* Card 1: Member Request Count */}
                <MetricCard 
                    title="멤버 요청 횟수 (Member Request Count)"
                    total={metrics.requests.total} 
                    breakdown={metrics.requests.breakdown}
                    chartData={chartData.requests}
                    topList={topList} 
                />

                {/* Card 2: LLM Credits */}
                <MetricCard 
                    title="LLM 크레딧 (LLM Credits)"
                    total={metrics.credits.total}
                    breakdown={metrics.credits.breakdown}
                    chartData={chartData.credits}
                    topList={topList}
                />

                {/* Card 3: LLM Call Count */}
                <MetricCard 
                    title="LLM 호출 횟수 (LLM Call Count)"
                    total={metrics.calls.total}
                    breakdown={metrics.calls.breakdown}
                    chartData={chartData.calls}
                    topList={topList}
                />

            </div>
        </div>
      </main>
    </div>
  );
};

export default UsageAnalytics;