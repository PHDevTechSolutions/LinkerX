import React, { useEffect, useState } from "react";

interface ActivityStatusProps {
  currentRecords: any[];
  quotationnumber: string;
  quotationamount: string;
  sonumber: string;
  soamount: string;
  actualsales: string;
  lastContactNote?: string;
  activitystatus: string;
  setactivitystatus: (value: string) => void;
}

const STATUS_DESCRIPTIONS: Record<string, string> = {
  Cold: "❄️ Cold — Progress 20% to 30% (Touchbase)",
  Warm: "🔥 Warm — Progress 50% to 60% (With Quotation)",
  Hot: "🚀 Hot — Progress 80% to 90% (With Sales Order)",
  Done: "✅ Done — 100% (With Actual Sales)",
  Cancelled: "⛔ Cancelled",
};

const isDowngrade = (current: string, next: string) => {
  const order = ["Cold", "Warm", "Hot", "Done", "Cancelled"];
  return order.indexOf(next) < order.indexOf(current);
};

const getLastStatusDate = (records: any[], status: string) => {
  const filtered = records.filter((r) => r.activitystatus === status);
  if (filtered.length === 0) return null;
  const sorted = filtered.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
  return new Date(sorted[0].date_created);
};

const daysDiff = (date1: Date, date2: Date) => {
  const diff = date2.getTime() - date1.getTime();
  return diff / (1000 * 3600 * 24);
};

const ActivityStatus: React.FC<ActivityStatusProps> = ({
  currentRecords,
  quotationnumber,
  quotationamount,
  sonumber,
  soamount,
  actualsales,
  lastContactNote = "",
  activitystatus,
  setactivitystatus,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [nextStatus, setNextStatus] = useState("");
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [suggestedStatus, setSuggestedStatus] = useState<string | null>(null);

  useEffect(() => {
    const sortedRecords = [...currentRecords].sort(
      (a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
    );
    const lastRecord = sortedRecords[0];
    if (lastRecord) {
      setactivitystatus(lastRecord.activitystatus);
    }

    if (sonumber && soamount) {
      setactivitystatus("Hot");
    } else if (quotationnumber && quotationamount) {
      setactivitystatus("Warm");
    }

    if (actualsales) {
      setactivitystatus("Done");
    }
  }, [currentRecords, quotationnumber, quotationamount, sonumber, soamount, actualsales, setactivitystatus]);

  useEffect(() => {
    const note = lastContactNote.toLowerCase();
    if (note.includes("client confirmed")) setSuggestedStatus("Hot");
    else if (note.includes("waiting")) setSuggestedStatus("Warm");
    else setSuggestedStatus(null);
  }, [lastContactNote]);

  useEffect(() => {
    if (!activitystatus) return setWarningMessage(null);

    const lastStatusDate = getLastStatusDate(currentRecords, activitystatus);
    if (!lastStatusDate) return setWarningMessage(null);

    const diffDays = daysDiff(lastStatusDate, new Date());
    if (
      (activitystatus === "Warm" && diffDays > 7) ||
      (activitystatus === "Cold" && diffDays > 14)
    ) {
      setWarningMessage(`⚠️ No update since ${lastStatusDate.toISOString().split("T")[0]}`);
    } else {
      setWarningMessage(null);
    }
  }, [activitystatus, currentRecords]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (isDowngrade(activitystatus, selected)) {
      setNextStatus(selected);
      setShowConfirm(true);
    } else {
      setactivitystatus(selected);
    }
  };

  const confirmDowngrade = () => {
    setactivitystatus(nextStatus);
    setNextStatus("");
    setShowConfirm(false);
  };

  const cancelDowngrade = () => {
    setNextStatus("");
    setShowConfirm(false);
  };

  const isLocked = activitystatus === "Done" || activitystatus === "Cancelled";

  return (
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
        <option
          value="Cold"
          disabled={["Warm", "Hot", "Done"].includes(activitystatus)}
        >
          ❄️ Cold — Touchbase
        </option>
        <option
          value="Warm"
          disabled={
            !(quotationnumber && quotationamount) ||
            ["Hot", "Done", "Cancelled"].includes(activitystatus)
          }
        >
          🔥 Warm — With Quotation
        </option>
        <option
          value="Hot"
          disabled={
            !(sonumber && soamount) ||
            ["Done", "Cancelled"].includes(activitystatus)
          }
        >
          🚀 Hot — With Sales Order
        </option>
        <option
          value="Done"
          disabled={!actualsales || activitystatus === "Cancelled"}
        >
          ✅ Done — With Actual Sales
        </option>
        <option value="Cancelled">⛔ Cancelled</option>
      </select>

      {activitystatus && (
        <p className="mt-1 text-xs italic text-gray-600">
          {STATUS_DESCRIPTIONS[activitystatus]}
        </p>
      )}

      {warningMessage && (
        <div className="text-yellow-700 text-xs mt-1 font-semibold">{warningMessage}</div>
      )}

      {suggestedStatus && suggestedStatus !== activitystatus && (
        <div className="text-blue-600 text-xs mt-1 font-medium italic">
          💡 Suggested next status: {suggestedStatus}
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-4 rounded shadow max-w-xs text-center">
            <p className="mb-4 font-semibold">
              Are you sure you want to downgrade status from <b>{activitystatus}</b> to <b>{nextStatus}</b>?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDowngrade}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, downgrade
              </button>
              <button
                onClick={cancelDowngrade}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityStatus;
