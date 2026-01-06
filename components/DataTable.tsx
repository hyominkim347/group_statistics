import React, { useState, useMemo } from 'react';
import { GroupStats } from '../types';
import { ChevronLeft, ChevronRight, Trophy, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface DataTableProps {
  data: GroupStats[];
}

type SortKey = keyof GroupStats;
type SortDirection = 'asc' | 'desc';

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  // Default Sort: Credit Usage Descending
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'credits',
    direction: 'desc',
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc',
    }));
    setCurrentPage(1); // Reset to first page on sort change
  };

  const processedData = useMemo(() => {
    // 1. Filter out 'Others' group (isOthers === true)
    let sortableData = data.filter(item => !item.isOthers);

    // 2. Sort
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        // Handle numeric sorting
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  // 3. Paginate
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedData.slice(startIndex, startIndex + itemsPerPage);
  }, [processedData, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="ml-1 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="ml-1 text-primary" /> 
      : <ArrowDown size={14} className="ml-1 text-primary" />;
  };

  const HeaderCell = ({ label, columnKey, align = 'left', className = '' }: { label: string, columnKey: SortKey, align?: 'left' | 'right' | 'center', className?: string }) => (
    <th 
      className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100 transition-colors select-none ${className}`}
      onClick={() => handleSort(columnKey)}
    >
        <div className={`flex items-center ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}>
          {label}
          <SortIcon columnKey={columnKey} />
        </div>
    </th>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {/* Table Container */}
        <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                    <HeaderCell label="Rank" columnKey="rank" align="center" className="w-24" />
                    <HeaderCell label="Group Name" columnKey="name" />
                    <HeaderCell label="Total Members" columnKey="totalMembers" align="right" />
                    <HeaderCell label="Active Members" columnKey="activeMembers" align="right" />
                    <HeaderCell label="Request Count" columnKey="requests" align="right" />
                    <HeaderCell label="Avg Credit / Member" columnKey="avgCredits" align="right" />
                    <HeaderCell label="Credit Usage" columnKey="credits" align="right" />
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {paginatedData.length > 0 ? (
                  paginatedData.map((row) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right font-mono align-middle bg-gray-50/50 group-hover:bg-gray-100/50">
                          {row.avgCredits.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right font-mono align-middle">
                          {row.credits.toLocaleString()}
                      </td>
                      </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No groups found.
                    </td>
                  </tr>
                )}
                </tbody>
            </table>
        </div>

      {/* Pagination Controls */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white text-xs text-gray-500">
        <div>
            Sorted by <span className="font-medium text-gray-900">{sortConfig.key === 'avgCredits' ? 'Avg Credit / Member' : sortConfig.key}</span> ({sortConfig.direction})
            <span className="mx-2">|</span>
            Showing <span className="font-medium text-gray-900">{paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> - <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, processedData.length)}</span> of <span className="font-medium text-gray-900">{processedData.length}</span>
        </div>
        <div className="flex items-center space-x-2">
            <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={18} />
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded text-sm font-medium shadow-sm transition-colors ${
                            currentPage === page
                                ? 'bg-primary text-white'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;