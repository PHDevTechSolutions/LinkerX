// Example Filter.tsx
import React from "react";

interface FilterProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  startDate: string;
  setStartDate: (d: string) => void;
  endDate: string;
  setEndDate: (d: string) => void;
}

const Filter: React.FC<FilterProps> = ({
  searchQuery,
  setSearchQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4">
      <input
        type="text"
        placeholder="Search by title, vendor, or type"
        className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="flex gap-2 mt-2 md:mt-0">
          <input
            type="date"
            className="px-3 py-2 border-b bg-white text-xs"
            value={startDate}
            max={endDate || undefined}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="self-center text-sm">–</span>
          <input
            type="date"
            className="px-3 py-2 border-b bg-white text-xs"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => setEndDate(e.target.value)}
          />
      </div>
    </div>
  );
};

export default Filter;
