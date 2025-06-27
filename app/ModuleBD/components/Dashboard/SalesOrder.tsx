import React, { useMemo } from "react";
import GroupedBarChart from "./Chart/GroupedBarChart";
import PercentageBar from "./Chart/PercentageBar";
import CombinationChart from "./Chart/CombinationChart"; // ✅ Combination chart import

interface RecordType {
  activitystatus?: string;
  soamount?: number | string;
  actualsales?: number | string;
  date?: string; // ✅ Date is required for combination chart grouping
}

interface SalesOrderProps {
  records: RecordType[];
}

const SalesOrder: React.FC<SalesOrderProps> = ({ records }) => {
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

  const actualSalesSummary = useMemo(() => {
    const paidRecords = records.filter(
      (rec) => (rec.activitystatus || "").toLowerCase() === "delivered"
    );
    const count = paidRecords.length;
    const totalActualSales = paidRecords.reduce(
      (sum, rec) => sum + (Number(rec.actualsales) || 0),
      0
    );
    return { count, totalActualSales };
  }, [records]);

  const conversionRate =
    soDoneSummary.totalCount > 0
      ? (actualSalesSummary.count / soDoneSummary.totalCount) * 100
      : 0;

  const pesoValueRate =
    soDoneSummary.totalAmount > 0
      ? (actualSalesSummary.totalActualSales / soDoneSummary.totalAmount) * 100
      : 0;

  const chartData = [
    {
      name: "Total Count",
      SO_Done: soDoneSummary.totalCount,
      Delivered: actualSalesSummary.count,
    },
    {
      name: "Total Amount",
      SO_Done: soDoneSummary.totalAmount,
      Delivered: actualSalesSummary.totalActualSales,
    },
  ];

  // ✅ Combination chart data with grouping by date
  const comboData = useMemo(() => {
    const grouped: Record<
      string,
      {
        soCount: number;
        soAmount: number;
        deliveredCount: number;
        deliveredAmount: number;
      }
    > = {};

    records.forEach((rec) => {
      const date = rec.date || "Unknown";
      if (!grouped[date]) {
        grouped[date] = {
          soCount: 0,
          soAmount: 0,
          deliveredCount: 0,
          deliveredAmount: 0,
        };
      }

      const isSO = (rec.activitystatus || "").toLowerCase() === "so-done";
      const isDelivered = (rec.activitystatus || "").toLowerCase() === "delivered";

      if (isSO) {
        grouped[date].soCount += 1;
        grouped[date].soAmount += Number(rec.soamount) || 0;
      }

      if (isDelivered) {
        grouped[date].deliveredCount += 1;
        grouped[date].deliveredAmount += Number(rec.actualsales) || 0;
      }
    });

    return Object.entries(grouped).map(([date, values]) => ({
      date,
      ...values,
      conversionRate:
        values.soCount > 0 ? (values.deliveredCount / values.soCount) * 100 : 0,
      pesoValueRate:
        values.soAmount > 0 ? (values.deliveredAmount / values.soAmount) * 100 : 0,
    }));
  }, [records]);

  return (
    <div className="space-y-8">
      <div className="bg-white shadow-md rounded-lg p-4 font-sans text-black">
        <h2 className="text-sm font-bold mb-4">Sales Orders Summary</h2>

        {soDoneSummary.totalCount === 0 ? (
          <p className="text-gray-500 text-xs">
            No Sales Orders with status "SO-Done".
          </p>
        ) : (
          <>
            {/* ✅ Progress Bars */}
            <div className="mb-6 border shadow-md p-4 rounded-md">
              <PercentageBar
                label="SO to SI Conversion"
                percentage={conversionRate}
                color="#3B82F6"
              />
              <PercentageBar
                label="SO to SI Peso Value"
                percentage={pesoValueRate}
                color="#10B981"
              />
            </div>

            <h2 className="text-sm font-bold mb-4">Total Amount vs Total Count</h2>
            <div className="mb-6 border shadow-md p-4 rounded-md">
              {/* ✅ Grouped Bar Chart */}
              <GroupedBarChart data={chartData} />
            </div>
            
            <h2 className="text-sm font-bold mb-4">Sales Orders & Conversion Trends</h2>
            <div className="mb-6 border shadow-md p-4 rounded-md">
              {/* ✅ Combination Chart */}
              <CombinationChart data={comboData} />
            </div>

            <div className="mb-6 border rounded-md">
              <table className="w-full text-xs table-auto mb-6">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="px-4 py-2">Total Count</th>
                    <th className="px-4 py-2">SO Amount</th>
                    <th className="px-4 py-2">SO to SI Conversion</th>
                    <th className="px-4 py-2">SO to SI Peso Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-bold">{soDoneSummary.totalCount}</td>
                    <td className="px-4 py-2">
                      ₱{soDoneSummary.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">{conversionRate.toFixed(2)}%</td>
                    <td className="px-4 py-2">₱{pesoValueRate.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SalesOrder;
