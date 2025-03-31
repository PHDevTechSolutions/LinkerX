"use client";

import React, { useState } from "react";

// ✅ Define TSA Interface
interface TSA {
  ReferenceID: string;
  Firstname: string;
  Lastname: string;
}

// ✅ SearchFilters Component Props Interface
interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  postsPerPage: number;
  setPostsPerPage: (num: number) => void;
  selectedClientType: string;
  setSelectedClientType: (clientType: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  filterTSA: string;
  setFilterTSA: (tsa: string) => void;
  tsaList: TSA[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  postsPerPage,
  setPostsPerPage,
  selectedClientType,
  setSelectedClientType,
  selectedStatus,
  setSelectedStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  filterTSA,
  setFilterTSA,
  tsaList,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      {/* ✅ Search Input */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.toLocaleUpperCase())}
        className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
      />

      {/* ✅ Client Type Filter */}
      <select
        value={selectedClientType}
        onChange={(e) => setSelectedClientType(e.target.value)}
        className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto"
      >
        <option value="">All Client Types</option>
        <option value="null">No Data</option>
        <option value="Top 50">Top 50</option>
        <option value="Next 30">Next 30</option>
        <option value="Balance 20">Balance 20</option>
        <option value="New Account - Client Development">
          New Account - Client Development
        </option>
      </select>

      {/* ✅ Status Filter */}
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto"
      >
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Used">Used</option>
      </select>

      {/* ✅ TSA Filter */}
      <select
        value={filterTSA}
        onChange={(e) => setFilterTSA(e.target.value)}
        className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto"
      >
        <option value="">All TSAs</option>
        {tsaList.map((tsa: TSA) => (
          <option key={tsa.ReferenceID} value={tsa.ReferenceID}>
            {tsa.Firstname} {tsa.Lastname}
          </option>
        ))}
      </select>

      {/* ✅ Date Range Filters */}
      <div className="flex gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-3 py-2 rounded text-xs"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-3 py-2 rounded text-xs"
        />
      </div>

      {/* ✅ Pagination Options */}
      <select
        value={postsPerPage}
        onChange={(e) => setPostsPerPage(parseInt(e.target.value))}
        className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto"
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={200}>200</option>
        <option value={500}>500</option>
        <option value={1000}>1000</option>
      </select>
    </div>
  );
};

export default SearchFilters;
