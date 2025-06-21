import React from "react";

interface DurationProps {
    duration: number | null;
    setDuration: (value: number) => void;
}

const durationOptions = [
    { label: "5 mins", minutes: 5 },
    { label: "10 mins", minutes: 10 },
    { label: "15 mins", minutes: 15 },
    { label: "20 mins", minutes: 20 },
    { label: "30 mins", minutes: 30 },
    { label: "1 hour", minutes: 60 },
    { label: "2 hour", minutes: 120 },
    { label: "3 hour", minutes: 180 },
];

const Duration: React.FC<DurationProps> = ({ duration, setDuration }) => {
    return (
        <div>
            <label className="block mb-1 text-gray-700 text-xs font-bold">Duration</label>
            <select
                value={duration ?? ""}
                onChange={(e) => setDuration(Number(e.target.value))}
                required
                className="w-full px-3 py-2 border-b bg-white text-xs"
            >
                <option value="">-- Select Duration --</option>
                {durationOptions.map((opt) => (
                    <option key={opt.minutes} value={opt.minutes}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Duration;
