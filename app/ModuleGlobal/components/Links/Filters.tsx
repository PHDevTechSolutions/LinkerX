'use client';

import React from 'react';

interface FiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  searchTerm,
  onSearchChange,
  onAddClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      <input
        type="text"
        placeholder="Search URL or name…"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 border px-3 py-2 rounded text-xs"
      />
      <button
        onClick={onAddClick}
        className="px-4 py-2 bg-green-700 text-white rounded hover:bg-cyan-500 transition text-xs"
      >
        + Add Link
      </button>
    </div>
  );
};

export default Filters;
