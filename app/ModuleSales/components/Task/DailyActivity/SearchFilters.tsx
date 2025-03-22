"use client";

import React, { useState } from "react";

// SearchFilters Component
interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedClientType: string;
    setSelectedClientType: (clientType: string) => void;
    selectedStatus: string;
    setSelectedStatus: (activitystatus: string) => void;
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    selectedClientType,
    setSelectedClientType,
    selectedStatus,
    setSelectedStatus,
    startDate,
    setStartDate,
    endDate,
    setEndDate
}) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLocaleUpperCase())}
                className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
            />
            <select 
                value={selectedClientType} 
                onChange={(e) => setSelectedClientType(e.target.value)} 
                className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto"
            >
                <option value="">All Client Types</option>
                <option value="Top 50">Top 50</option>
                <option value="Next 30">Next 30</option>
                <option value="Below 20">Below 20</option>
                <option value="New Account - Client Development">New Account - Client Development</option>
                <option value="CSR Inquiries">CSR Inquiries</option>
            </select>
            <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)} 
                className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto"
            >
                <option value="">All Status</option>
                <option value="Cold">Cold</option>
                <option value="Warm">Warm</option>
                <option value="Hot">Hot</option>
                <option value="Done">Done</option>
                <option value="Loss">Loss</option>
                <option value="Cancelled">Cancelled</option>
            </select>
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
        </div>
    );
};

export default SearchFilters;