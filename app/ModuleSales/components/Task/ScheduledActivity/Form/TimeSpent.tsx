import React, { useEffect, useState } from "react";

interface TimeSpentProps {
  startdate: string;
  enddate: string;
}

const TimeSpent: React.FC<TimeSpentProps> = ({ startdate, enddate }) => {
  const [minutesSpent, setMinutesSpent] = useState("");

  useEffect(() => {
    if (startdate && enddate) {
      const start = new Date(startdate);
      const end = new Date(enddate);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffMs = end.getTime() - start.getTime();

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        const formattedTime = `${hours}h ${minutes}m ${seconds}s`;
        setMinutesSpent(formattedTime);
      } else {
        setMinutesSpent("Invalid date");
      }
    }
  }, [startdate, enddate]);

  return (
    <div className="sticky top-24 left-0 z-50">
      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full w-fit shadow-md">
        <span>Time Spent:</span>
        <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full">
          {minutesSpent}
        </span>
      </div>
    </div>
  );
};

export default TimeSpent;
