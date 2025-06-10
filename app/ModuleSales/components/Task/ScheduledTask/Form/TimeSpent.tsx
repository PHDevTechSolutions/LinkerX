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
    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full w-fit">
      <span>Time Spent:</span>
      <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full">
        {minutesSpent}
      </span>
    </div>
  );
};

export default TimeSpent;
