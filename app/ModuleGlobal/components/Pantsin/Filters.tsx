"use client";

import React from "react";

interface FilterProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
}

const Filter: React.FC<FilterProps> = ({
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
        placeholder="Search Reference ID or Email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
      />

      <div className="flex gap-2 mt-2 md:mt-0">
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 border-b bg-white text-xs"
        />
        <span className="self-center text-sm">–</span>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-2 border-b bg-white text-xs"
        />
      </div>
    </div>
  );
};

export default Filter;
