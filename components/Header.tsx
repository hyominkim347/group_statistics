import React from 'react';
import { Download, Calendar } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 px-8 flex items-center justify-between sticky top-0 z-20">
      <h1 className="text-xl font-bold text-gray-900">그룹 통계 (Group Analytics)</h1>
      
      <div className="flex items-center space-x-3">
        {/* Date Range Picker Mock */}
        <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20">
          <Calendar size={16} className="text-gray-500" />
          <span>Oct 1, 2023 - Oct 31, 2023</span>
        </button>

        {/* Export Button */}
        <button className="flex items-center space-x-2 px-4 py-2 bg-transparent border border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20">
            <Download size={16} />
            <span>Export</span>
        </button>
      </div>
    </header>
  );
};

export default Header;