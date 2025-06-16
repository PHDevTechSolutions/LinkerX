import React, { useMemo } from "react";

interface SalesOrderProps {
  records: any[];
}

const SalesOrder: React.FC<SalesOrderProps> = ({ records }) => {
  // SO-Done summary
  const soDoneSummary = useMemo(() => {
    const soDoneRecords = records.filter(
      (rec) => (rec.activitystatus || "").toLowerCase() === "so-done"
    );

    const totalCount = soDoneRecords.length;
    const totalAmount = soDoneRecords.reduce(
      (sum, rec) => sum + (Number(rec.soamount) || 0),
      0
    );

    return { totalCount, totalAmount };
  }, [records]);

  // Paid / Actual Sales summary with count
  const actualSalesSummary = useMemo(() => {
    const paidRecords = records.filter(
      (rec) => (rec.activitystatus || "").toLowerCase() === "paid"
    );

    const totalActualSales = paidRecords.reduce(
      (sum, rec) => sum + (Number(rec.actualsales) || 0),
      0
    );

    const count = paidRecords.length;

    return { count, totalActualSales };
  }, [records]);

  // SO to SI Conversion (%) - avoid division by zero
  const soToSiConversion =
    soDoneSummary.totalCount > 0
      ? (actualSalesSummary.count / soDoneSummary.totalCount) * 100
      : 0;

  // SO to SI Peso Value - based on actual sales divided by SO amount times 100
  const soToSiPesoValue =
    soDoneSummary.totalAmount > 0
      ? (actualSalesSummary.totalActualSales / soDoneSummary.totalAmount) * 100
      : 0;

  return (
    <div className="space-y-8">
      {/* Sales Orders Table */}
      <div className="bg-white shadow-md rounded-lg p-6 font-sans overflow-x-auto text-black">
        <h2 className="text-sm font-bold mb-4">Sales Orders</h2>
        {soDoneSummary.totalCount === 0 ? (
          <p className="text-gray-500 text-xs">
            No Sales Orders with status "SO-Done".
          </p>
        ) : (
          <table className="w-full text-xs table-auto">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="px-4 py-2">Activity Status</th>
                <th className="px-4 py-2">Total Count</th>
                <th className="px-4 py-2">SO Amount</th>
                <th className="px-4 py-2">SO to SI Conversion (%)</th>
                <th className="px-4 py-2">SO to SI Peso Value (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2">SO-Done</td>
                <td className="px-4 py-2">{soDoneSummary.totalCount}</td>
                <td className="px-4 py-2">₱{soDoneSummary.totalAmount.toFixed(2)}</td>
                <td className="px-4 py-2">{soToSiConversion.toFixed(2)}%</td>
                <td className="px-4 py-2">₱{soToSiPesoValue.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SalesOrder;
