"use client";

import React, { useState } from "react";

// SearchFilters Component
interface SearchFiltersProps {
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
    startDate,
    setStartDate,
    endDate,
    setEndDate
}) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
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