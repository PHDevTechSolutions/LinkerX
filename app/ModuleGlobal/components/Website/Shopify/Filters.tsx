"use client";
import React from "react";

interface FiltersProps {
  query: string;
  setQuery: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  resetPage: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  query,
  setQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  resetPage,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          resetPage();
        }}
        placeholder="Search order #, customer, or email…"
        className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
      />
      <div className="flex gap-2 mt-2 md:mt-0">
        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            resetPage();
          }}
          className="px-3 py-2 border-b bg-white text-xs"
        />
        <span className="self-center text-sm">–</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            resetPage();
          }}
          className="px-3 py-2 border-b bg-white text-xs"
        />
      </div>
    </div>
  );
};

export default Filters;