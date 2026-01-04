import React from 'react';
import { GroupStats } from '../types';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';

interface DataTableProps {
  data: GroupStats[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const getRankBadge = (rank: number) => {
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {/* Table Container */}
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24 text-center">Rank</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Group Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Total Members</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Active Members</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Request Count</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Credit Usage</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {data.map((row) => (
                    <tr 
                        key={row.id} 
                        className="hover:bg-gray-50 transition-colors group cursor-default"
                    >
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                        {getRankBadge(row.rank)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 align-middle">
                        {row.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right font-mono align-middle">
                        {row.totalMembers.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right font-mono align-middle">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
            </table>
        </div>

      {/* Pagination Mock */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white">
        <div className="text-xs text-gray-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{data.length}</span> of <span className="font-medium">45</span> results
        </div>
        <div className="flex items-center space-x-2">
            <button className="p-1 rounded hover:bg-gray-100 text-gray-400 disabled:opacity-50">
                <ChevronLeft size={18} />
            </button>
            <button className="px-3 py-1 rounded bg-primary text-white text-sm font-medium shadow-sm">1</button>
            <button className="px-3 py-1 rounded hover:bg-gray-100 text-gray-600 text-sm font-medium">2</button>
            <button className="px-3 py-1 rounded hover:bg-gray-100 text-gray-600 text-sm font-medium">3</button>
            <span className="text-gray-400">...</span>
            <button className="p-1 rounded hover:bg-gray-100 text-gray-600">
                <ChevronRight size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;