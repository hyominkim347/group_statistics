import React from 'react';
import { User, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { Member } from '../types';

interface MemberRankingTableProps {
  data: Member[];
}

const MemberRankingTable: React.FC<MemberRankingTableProps> = ({ data }) => {
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

  const formatGroups = (groupIds: string[]) => {
      if (!groupIds || groupIds.length === 0) return 'Unassigned';
      // In a real app we'd map IDs to names, here we just show count if > 1 or ID
      if (groupIds.length === 1) return groupIds[0].toUpperCase();
      return `${groupIds.length} Groups`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24 text-center">Rank</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Member</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Groups</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Requests</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Credits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row) => (
              <tr key={row.id} className="group hover:bg-gray-50 transition-colors duration-200">
                {/* Rank */}
                <td className="px-6 py-4 whitespace-nowrap align-middle">
                    {getRankBadge(row.rank)}
                </td>
                
                {/* Member Info */}
                <td className="px-6 py-4 whitespace-nowrap align-middle">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/5 ring-1 ring-primary/10 flex items-center justify-center text-primary mr-4 flex-shrink-0 transition-transform group-hover:scale-105 group-hover:bg-primary/10 group-hover:ring-primary/20">
                      <User size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{row.name}</div>
                      <div className="text-xs text-gray-500">{row.email}</div>
                    </div>
                  </div>
                </td>

                {/* Group Tag */}
                <td className="px-6 py-4 whitespace-nowrap align-middle">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 group-hover:border-gray-300 transition-colors">
                    {formatGroups(row.groupIds)}
                  </span>
                </td>

                {/* Request Count (Trend removed) */}
                <td className="px-6 py-4 whitespace-nowrap text-right align-middle">
                    <span className="text-sm font-bold text-gray-900 tabular-nums">
                        {row.requestCount.toLocaleString()}
                    </span>
                </td>

                {/* Credits (Usage) */}
                <td className="px-6 py-4 whitespace-nowrap text-right align-middle">
                  <span className="text-sm font-medium text-gray-900 tabular-nums">
                      {row.credits.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
            
            {/* Empty State */}
            {data.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center space-y-3">
                             <div className="p-3 bg-gray-50 rounded-full ring-1 ring-gray-100">
                                <User size={24} className="text-gray-300" />
                             </div>
                             <div>
                                <p className="text-sm font-medium text-gray-900">No members found</p>
                                <p className="text-xs text-gray-500 mt-1">Adjust your filters to see member rankings</p>
                             </div>
                        </div>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-500">
                Showing <span className="font-medium text-gray-900">{Math.min(data.length, 10)}</span> of <span className="font-medium text-gray-900">{data.length}</span> members
            </p>
            <div className="flex items-center gap-2">
                <button 
                    className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                    disabled
                >
                    <ChevronLeft size={16} />
                </button>
                <button 
                    className="p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
      </div>
    </div>
  );
};

export default MemberRankingTable;