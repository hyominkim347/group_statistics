import React, { useState } from 'react';
import GroupAnalytics from './components/GroupAnalytics';
import UsageAnalytics from './components/UsageAnalytics';
import MemberActivity from './components/MemberActivity';

function App() {
  // Changed default to 'usage' as it is now the first tab
  const [currentPage, setCurrentPage] = useState<string>('usage');

  const renderContent = () => {
    switch (currentPage) {
      case 'member-activity':
        return <MemberActivity onNavigate={setCurrentPage} />;
      case 'analytics':
        return <GroupAnalytics onNavigate={setCurrentPage} />;
      case 'usage':
      default:
        return <UsageAnalytics onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-background font-sans text-gray-900">
      {/* Main Content Area - Removed Sidebar and margin adjustments */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;