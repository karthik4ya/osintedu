import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// Minimal Search Bar integrated into header if needed, but current design focuses on wheel nav
export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative group w-64">
        <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="FILTER_MODULES..."
            className="w-full bg-transparent border-b border-cyber-cyan/30 py-1 text-sm font-mono text-cyber-cyan placeholder-cyber-cyan/30 focus:outline-none focus:border-cyber-cyan transition-colors"
        />
    </div>
  );
};