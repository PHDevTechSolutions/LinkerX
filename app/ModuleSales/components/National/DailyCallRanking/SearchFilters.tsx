"use client";

import React, { useEffect, useState } from "react";

// SearchFilters Component
interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    startDate,
    setStartDate,
    endDate,
    setEndDate
}) => {
    const getManilaDate = (daysOffset = 0) => {
        const now = new Date();
        now.setDate(now.getDate() + daysOffset);
        const manilaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }));
        return manilaTime.toISOString().split("T")[0];
    };

    const [selectedFilter, setSelectedFilter] = useState("Today");

    const handleDateFilterChange = (value: string) => {
        setSelectedFilter(value);
        if (value === "Today") {
            setStartDate(getManilaDate());
            setEndDate(getManilaDate());
        } else if (value === "Yesterday") {
            setStartDate(getManilaDate(-1));
            setEndDate(getManilaDate(-1));
        } else if (value === "Last Week") {
            setStartDate(getManilaDate(-7));
            setEndDate(getManilaDate());
        } else if (value === "Last Month") {
            setStartDate(getManilaDate(-30));
            setEndDate(getManilaDate());
        }
    };

    // Set default selection to "Today" on initial render
    useEffect(() => {
        handleDateFilterChange("Today");
    }, []);

    return (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLocaleUpperCase())}
                className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
            />
            <div className="flex gap-2">
                <select
                    className="border px-3 py-2 rounded text-xs"
                    value={selectedFilter}
                    onChange={(e) => handleDateFilterChange(e.target.value)}
                >
                    <option value="Today">Today</option>
                    <option value="Yesterday">Yesterday</option>
                    <option value="Last Week">Last Week</option>
                    <option value="Last Month">Last Month</option>
                </select>
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
