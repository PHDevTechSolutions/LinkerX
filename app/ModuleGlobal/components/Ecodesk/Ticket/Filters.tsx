"use client";

import React from "react";

interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedStatus: string;
    setselectedStatus: (Status: string) => void;
    salesAgent: string;
    setSalesAgent: (agent: string) => void;
    TicketReceived: string;
    setTicketReceived: (date: string) => void;
    TicketEndorsed: string;
    setTicketEndorsed: (date: string) => void;
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setselectedStatus,
    salesAgent,
    setSalesAgent,
    TicketReceived,
    setTicketReceived,
    TicketEndorsed,
    setTicketEndorsed,
    startDate,
    setStartDate,
    endDate,
    setEndDate
}) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
            {/* Search by term */}
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLocaleLowerCase())}
                className="border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
            />

            {/* Filter by Sales Agent */}
            <select 
                value={selectedStatus} 
                onChange={(e) => setselectedStatus(e.target.value)} 
                className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto"
            >
                <option value="">All Status</option>
                <option value="Closed">Closed</option>
                <option value="Endorsed">Endorsed</option>
                <option value="Converted Into Sales">Converted Into Sales</option>
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
