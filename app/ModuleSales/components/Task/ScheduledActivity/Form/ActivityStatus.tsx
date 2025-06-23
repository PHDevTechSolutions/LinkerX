import React, { useEffect, useState } from "react";
import Select from "react-select";

interface ActivityStatusProps {
  currentRecords: any[];
  quotationnumber: string;
  quotationamount: string;
  paymentterm: string;
  sonumber: string;
  soamount: string;
  actualsales: string;
  activitystatus: string;
  setactivitystatus: (value: string) => void;
  setpaymentterm: (value: string) => void;
}

const statusColorClasses: Record<string, string> = {
  Assisted: "bg-blue-400",
  Paid: "bg-green-500",
  Delivered: "bg-cyan-400",
  Collected: "bg-indigo-500",
  "Quote-Done": "bg-slate-500",
  "SO-Done": "bg-purple-500",
  Cancelled: "bg-red-500",
  Loss: "bg-red-800",
};

const statusOptions = [
  { value: "", label: "Select Status" },
  { value: "Assisted", label: "Assisted (Client Assistance - Touchbase such as calls)" },
  { value: "Paid", label: "Paid (Identity - Have SO#)" },
  { value: "Delivered", label: "Delivered (All fields completed - SI & DR)" },
  { value: "Collected", label: "Collected" },
  { value: "Quote-Done", label: "Quote-Done" },
  { value: "SO-Done", label: "SO-Done" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Loss", label: "Loss" },
];

const ActivityStatus: React.FC<ActivityStatusProps> = ({
  currentRecords,
  quotationnumber,
  quotationamount,
  paymentterm,
  sonumber,
  soamount,
  actualsales,
  activitystatus,
  setactivitystatus,
  setpaymentterm,
}) => {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    setIsLocked(activitystatus === "Cancelled" || activitystatus === "Loss");
  }, [activitystatus]);

  const handleChange = (selected: any) => {
    setactivitystatus(selected?.value || "");
  };

  const formatOptionLabel = ({ label, value }: any) => (
    <div className="flex items-center gap-2 text-xs capitalize">
      {value && (
        <span
          className={`w-3 h-3 rounded-full ${statusColorClasses[value] || "bg-gray-300"}`}
        ></span>
      )}
      <span className="text-black">{label}</span>
    </div>
  );

  return (
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2">Status</label>
      <Select
        options={statusOptions}
        value={statusOptions.find(opt => opt.value === activitystatus) || statusOptions[0]}
        onChange={handleChange}
        isDisabled={isLocked}
        isClearable={false}
        placeholder="Select Status"
        formatOptionLabel={formatOptionLabel}
        styles={{
          control: (base) => ({
            ...base,
            borderBottom: "2px solid #ccc",
            borderRadius: 0,
            fontSize: "12px",
            backgroundColor: isLocked ? "#f3f4f6" : "#fff",
            cursor: isLocked ? "not-allowed" : "pointer",
            boxShadow: "none",
            border: "none",
          }),
          menu: (base) => ({
            ...base,
            fontSize: "12px",
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#e5e7eb" : "#fff",
            color: "#000",
            fontSize: "12px",
            cursor: "pointer",
          }),
          singleValue: (base) => ({
            ...base,
            color: "#000",
            textTransform: "capitalize",
          }),
        }}
      />
    </div>
  );
};

export default ActivityStatus;
