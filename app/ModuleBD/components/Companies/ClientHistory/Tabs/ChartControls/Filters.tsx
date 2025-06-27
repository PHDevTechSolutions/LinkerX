import React from "react";

// Define the ViewMode type here or import from your types file
export type ViewMode = "line" | "table";

interface FiltersProps {
  customStartDate: string;
  setCustomStartDate: (value: string) => void;
  customEndDate: string;
  setCustomEndDate: (value: string) => void;
  viewMode: ViewMode;
  setViewMode: (value: ViewMode) => void;
}

const Filters: React.FC<FiltersProps> = ({
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <div className="flex items-center space-x-2">
        <label className="font-semibold text-gray-700 text-xs" htmlFor="start-date">
          Start Date:
        </label>
        <input
          id="start-date"
          type="date"
          className="border rounded px-2 py-1 text-xs"
          value={customStartDate}
          onChange={(e) => setCustomStartDate(e.target.value)}
          max={customEndDate || undefined}
        />
      </div>

      <div className="flex items-center space-x-2">
        <label className="font-semibold text-gray-700 text-xs" htmlFor="end-date">
          End Date:
        </label>
        <input
          id="end-date"
          type="date"
          className="border rounded px-2 py-1 text-xs"
          value={customEndDate}
          onChange={(e) => setCustomEndDate(e.target.value)}
          min={customStartDate || undefined}
        />
      </div>

      <div className="flex items-center space-x-2">
        <label className="font-semibold text-gray-700 text-xs" htmlFor="view-mode">
          View Mode:
        </label>
        <select
          id="view-mode"
          className="border rounded px-2 py-1 text-xs"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as ViewMode)}
        >
          <option value="line">Line Chart</option>
          <option value="table">Table View</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
