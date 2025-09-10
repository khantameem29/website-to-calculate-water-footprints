import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (item: string) => void;
  disabled: boolean;
}

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);


const SearchBar: React.FC<SearchBarProps> = ({ onSearch, disabled }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-center max-w-lg mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g., One pair of jeans"
        className="w-full px-5 py-3 text-lg bg-white/70 backdrop-blur-sm border-2 border-medium-blue rounded-full focus:ring-2 focus:ring-accent-blue focus:border-accent-blue transition-all duration-300 shadow-sm"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled}
        className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-dark-blue text-white font-semibold text-lg rounded-full hover:bg-teal-800 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-blue"
      >
        <SearchIcon className="w-5 h-5 mr-2"/>
        Calculate
      </button>
    </form>
  );
};

export default SearchBar;