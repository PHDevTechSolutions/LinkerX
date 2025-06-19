import React, { useEffect, useState } from "react";

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setactivitystatus(e.target.value);
  };

  const handlePaymentTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setpaymentterm(e.target.value);
  };

  return (
    <>
      <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4 relative">
        <label className="block text-xs font-bold mb-2">Status</label>
        <select
          value={activitystatus || ""}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded text-xs capitalize ${
            isLocked ? "bg-gray-200 cursor-not-allowed" : "bg-white cursor-pointer"
          }`}
          disabled={isLocked}
          required
        >
          <option value="">Select Status</option>
          <option value="Assisted">Assisted (Client Assistance - Touchbase such as calls)</option>
          <option value="Paid">Paid (Identity - Have SO# (All fields should be completed SAP))</option>
          <option value="Delivered">Delivered (All fields should be completed SAP-SI and DR)</option>
          <option value="Collected">Collected</option>
          <option value="Quote-Done">Quote-Done</option>
          <option value="SO-Done">SO-Done</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Loss">Loss</option>
        </select>
      </div>

      {activitystatus === "Delivered" && (
        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4 relative">
          <label className="block text-xs font-bold mb-2">Payment Terms</label>
          <select
            value={paymentterm}
            onChange={handlePaymentTermChange}
            className="w-full px-3 py-2 border rounded text-xs bg-white capitalize"
            required
          >
            <option value="">Select Payment Term</option>
            <option value="COD">COD</option>
            <option value="Check">Check</option>
            <option value="Cash">Cash</option>
            <option value="Bank Deposit">Bank Deposit</option>
            <option value="GCash">GCash</option>
            <option value="Terms">Terms</option>
          </select>
        </div>
      )}
    </>
  );
};

export default ActivityStatus;
