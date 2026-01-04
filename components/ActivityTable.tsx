import React from 'react';
import { Clock, User } from 'lucide-react';

interface Activity {
  id: string;
  user: string;
  email: string;
  group: string;
  action: string;
  timestamp: string;
}

interface ActivityTableProps {
  data: Activity[];
}

const ActivityTable: React.FC<ActivityTableProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Group</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3 flex-shrink-0">
                      <User size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{row.user}</div>
                      <div className="text-xs text-gray-500">{row.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span className="px-2 py-1 rounded bg-gray-100 text-xs font-medium text-gray-600 border border-gray-200">
                    {row.group}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.action}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right font-mono">
                  <div className="flex items-center justify-end gap-1">
                    <Clock size={14} className="text-gray-400" />
                    {row.timestamp}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;