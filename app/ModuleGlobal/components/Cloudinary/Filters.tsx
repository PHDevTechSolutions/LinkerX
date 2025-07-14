"use client";

import React from "react";

interface FilterProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    startDate: string;
    setStartDate: (value: string) => void;
    endDate: string;
    setEndDate: (value: string) => void;
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
                placeholder="Search by Public ID or Format"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
            />
            <div className="flex gap-2 mt-2 md:mt-0">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 border-b bg-white text-xs"
                    aria-label="Start date"
                />
                <span className="self-center text-sm">–</span>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 border-b bg-white text-xs"
                    aria-label="End date"
                />
            </div>
        </div>
    );
};

export default Filter;
