"use client";

import React from "react";

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  searchTerm,
  setSearchTerm,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4">
      <input
        type="text"
        placeholder="Search by subject or sender"
        className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <input
        type="date"
        className="px-3 py-2 border-b bg-white text-xs"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        className="px-3 py-2 border-b bg-white text-xs"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
    </div>
  );
};

export default Filters;
