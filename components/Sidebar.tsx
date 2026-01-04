import React from 'react';
import { LayoutDashboard, Users, CreditCard, Settings, PieChart, Box, BarChart2, Activity } from 'lucide-react';

interface SidebarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage = 'analytics', onNavigate }) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-full fixed left-0 top-0 z-10">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
            <Box className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg text-gray-800">SaaS Admin</span>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Overview" 
            active={currentPage === 'overview'}
            onClick={() => onNavigate?.('overview')}
        />
        <NavItem 
            icon={<PieChart size={20} />} 
            label="Group Analytics" 
            active={currentPage === 'analytics'}
            onClick={() => onNavigate?.('analytics')}
        />
        <NavItem 
            icon={<BarChart2 size={20} />} 
            label="Usage Analytics" 
            active={currentPage === 'usage'}
            onClick={() => onNavigate?.('usage')}
        />
        <NavItem 
            icon={<Activity size={20} />} 
            label="Member Activity" 
            active={currentPage === 'member-activity'}
            onClick={() => onNavigate?.('member-activity')}
        />
        <NavItem 
            icon={<Users size={20} />} 
            label="Users" 
            active={currentPage === 'users'}
            onClick={() => onNavigate?.('users')}
        />
        <NavItem 
            icon={<CreditCard size={20} />} 
            label="Billing" 
            active={currentPage === 'billing'}
            onClick={() => onNavigate?.('billing')}
        />
        <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            System
        </div>
        <NavItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={currentPage === 'settings'}
            onClick={() => onNavigate?.('settings')}
        />
      </nav>
      
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                JD
            </div>
            <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">John Doe</p>
                <p className="text-xs text-gray-500">Admin</p>
            </div>
        </div>
      </div>
    </aside>
  );
};

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-3 py-2.5 rounded-md transition-colors text-left ${
      active
        ? 'bg-primary-light text-primary font-medium'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <span className={`${active ? 'text-primary' : 'text-gray-500'} mr-3`}>{icon}</span>
    {label}
  </button>
);

export default Sidebar;