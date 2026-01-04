import React, { useState, useMemo } from 'react';
import { GroupStats } from '../types';
import { ChevronLeft, ChevronRight, Trophy, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface DataTableProps {
  data: GroupStats[];
}

type SortKey = keyof GroupStats;
type SortDirection = 'asc' | 'desc';

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'credits',
    direction: 'desc',
  });

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        // Always keep 'Others' at the bottom regardless of sort
        if (a.isOthers) return 1;
        if (b.isOthers) return -1;

        if (a[sortConfig.key]! < b[sortConfig.key]!) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key]! > b[sortConfig.key]!) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    // Re-assign ranks based on sorted order (excluding others)
    return sortableData.map((item, index) => ({
        ...item,
        displayRank: item.isOthers ? '-' : index + 1
    }));
  }, [data, sortConfig]);

  // Calculate Totals
  const totals = useMemo(() => {
      return data.reduce((acc, curr) => ({
          totalMembers: acc.totalMembers + curr.totalMembers,
          activeMembers: acc.activeMembers + curr.activeMembers,
          requests: acc.requests + curr.requests,
          credits: acc.credits + curr.credits,
      }), { totalMembers: 0, activeMembers: 0, requests: 0, credits: 0 });
  }, [data]);

  const getRankBadge = (rank: number | string) => {
    if (rank === '-') return <span className="text-gray-400 font-medium text-center block w-8 mx-auto">-</span>;
    
    if (rank === 1) return (
      <div className="relative flex items-center justify-center w-8 h-8 mx-auto">
        <div className="absolute inset-0 bg-yellow-100 rounded-full opacity-50 ring-1 ring-yellow-200"></div>
        <Trophy size={16} className="relative text-yellow-600 fill-yellow-600/20" />
      </div>
    );
    if (rank === 2) return (
      <div className="relative flex items-center justify-center w-8 h-8 mx-auto">
        <div className="absolute inset-0 bg-gray-100 rounded-full opacity-50 ring-1 ring-gray-200"></div>
        <Trophy size={16} className="relative text-gray-500 fill-gray-500/20" />
      </div>
    );
    if (rank === 3) return (
      <div className="relative flex items-center justify-center w-8 h-8 mx-auto">
        <div className="absolute inset-0 bg-orange-100 rounded-full opacity-50 ring-1 ring-orange-200"></div>
        <Trophy size={16} className="relative text-orange-700 fill-orange-700/20" />
      </div>
    );
    return <span className="text-gray-500 font-semibold text-sm block text-center w-8 mx-auto">{rank}</span>;
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
      if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="ml-1 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />;
      return sortConfig.direction === 'asc' 
        ? <ArrowUp size={14} className="ml-1 text-primary" /> 
        : <ArrowDown size={14} className="ml-1 text-primary" />;
  };

  const HeaderCell = ({ label, columnKey, align = 'left', className = '' }: { label: string, columnKey: SortKey, align?: 'left' | 'right' | 'center', className?: string }) => (
      <th 
        className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100 transition-colors select-none sticky top-0 bg-gray-50 z-10 ${className}`}
        onClick={() => handleSort(columnKey)}
      >
          <div className={`flex items-center ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}>
            {label}
            <SortIcon columnKey={columnKey} />
          </div>
      </th>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
        {/* Table Container */}
        <div className="overflow-auto custom-scrollbar flex-1 relative max-h-[600px]">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="border-b border-gray-200 shadow-sm">
                    <HeaderCell label="Rank" columnKey="rank" align="center" className="w-24" />
                    <HeaderCell label="Group Name" columnKey="name" />
                    <HeaderCell label="Total Members" columnKey="totalMembers" align="right" />
                    <HeaderCell label="Active Members" columnKey="activeMembers" align="right" />
                    <HeaderCell label="Request Count" columnKey="requests" align="right" />
                    <HeaderCell label="Credit Usage" columnKey="credits" align="right" />
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {sortedData.map((row) => (
                    <tr 
                        key={row.id} 
                        className={`transition-colors group cursor-default ${
                            row.isOthers 
                                ? 'bg-gray-50/80 hover:bg-gray-100 font-medium text-gray-500' 
                                : 'hover:bg-purple-50/30'
                        }`}
                    >
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                        {getRankBadge(row.displayRank)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm align-middle ${row.isOthers ? 'text-gray-600 italic' : 'font-medium text-gray-900'}`}>
                        {row.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right font-mono align-middle">
                        {row.totalMembers.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right font-mono align-middle">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            row.isOthers ? 'bg-gray-200 text-gray-600' :
                            (row.activeMembers / row.totalMembers) > 0.7 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                        }`}>
                            {row.activeMembers.toLocaleString()}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right font-mono align-middle">
                        {row.requests.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right font-mono align-middle">
                        {row.credits.toLocaleString()}
                    </td>
                    </tr>
                ))}
                </tbody>
                {/* Footer Logic for Totals */}
                <tfoot className="bg-gray-50 border-t-2 border-gray-200 sticky bottom-0 z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                    <tr>
                        <td className="px-6 py-4 text-xs font-bold text-gray-500 text-center">TOTAL</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">All Groups</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right font-mono">{totals.totalMembers.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right font-mono">{totals.activeMembers.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right font-mono">{totals.requests.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm font-bold text-primary text-right font-mono">{totals.credits.toLocaleString()}</td>
                    </tr>
                </tfoot>
            </table>
        </div>

      {/* Pagination Mock - Simplified for now as we show all rows with sticky header */}
      <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between bg-white text-xs text-gray-500">
        <div>
            Sorted by <span className="font-medium text-gray-900">{sortConfig.key}</span> ({sortConfig.direction})
        </div>
        <div className="flex items-center gap-2">
            Showing all <span className="font-medium text-gray-900">{data.length}</span> groups
        </div>
      </div>
    </div>
  );
};

export default DataTable;