import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  subValue?: string;
  highlight?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subValue, highlight }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
      <div className="mt-2">
        <div className={`text-3xl font-bold ${highlight ? 'text-primary' : 'text-gray-900'}`}>
          {value}
        </div>
        {subValue && (
            <div className="text-sm text-gray-500 mt-1">{subValue}</div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;