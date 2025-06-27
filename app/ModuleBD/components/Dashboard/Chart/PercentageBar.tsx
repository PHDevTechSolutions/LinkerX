import React from "react";

interface PercentageBarProps {
  label: string;
  percentage: number;
  color: string;
}

const PercentageBar: React.FC<PercentageBarProps> = ({ label, percentage, color }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-medium mb-1">
        <span>{label}</span>
        <span>{percentage.toFixed(2)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded h-3">
        <div
          className="h-3 rounded"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

export default PercentageBar;
