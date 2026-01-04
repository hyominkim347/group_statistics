import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

interface GroupOption {
  id: string;
  name: string;
}

interface GroupSelectProps {
  options: GroupOption[];
  onSelect: (id: string | null) => void;
}

const GroupSelect: React.FC<GroupSelectProps> = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<GroupOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (group: GroupOption) => {
    setSelectedGroup(group);
    onSelect(group.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const clearSelection = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedGroup(null);
      onSelect(null);
  };

  return (
    <div className="relative w-64" ref={dropdownRef}>
      {/* Trigger Button - Styled to match DatePicker/Export buttons exactly */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-10 items-center justify-between w-full px-3 bg-white border rounded-lg cursor-pointer transition-all shadow-sm group ${
            isOpen 
            ? 'border-primary ring-1 ring-primary' 
            : 'border-[#e5e7eb] hover:border-primary'
        }`}
      >
        <span className={`text-sm font-medium truncate select-none ${selectedGroup ? 'text-[#374151]' : 'text-gray-500'}`}>
          {selectedGroup ? selectedGroup.name : 'Select a Group'}
        </span>
        <div className="flex items-center gap-1">
             {selectedGroup && (
                <div 
                    onClick={clearSelection}
                    className="p-0.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={14} />
                </div>
             )}
            <ChevronDown 
                size={16} 
                className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : 'group-hover:text-gray-600'}`} 
            />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#e5e7eb] rounded-lg shadow-xl z-50 max-h-80 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
            {/* Search Input */}
            <div className="p-2 border-b border-gray-100 bg-gray-50/50">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search groups..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-400 text-gray-700"
                        autoFocus
                    />
                </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
                {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                        <div
                            key={option.id}
                            onClick={() => handleSelect(option)}
                            className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                                selectedGroup?.id === option.id 
                                    ? 'bg-primary/10 text-primary font-medium' 
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {option.name}
                        </div>
                    ))
                ) : (
                    <div className="px-4 py-8 text-center">
                        <p className="text-sm text-gray-500">No groups found</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default GroupSelect;