import React, { useMemo } from "react";
import BarChart from "./Chart/BarChart";
import GaugeChart from "./Chart/GaugeChart";

interface CallRecord {
  typecall?: string;
  quotationnumber?: string;
  activitystatus?: string;
  actualsales?: number | string;
}

interface OutboundCallsProps {
  filteredCalls: CallRecord[];
  dateRange: { start: string; end: string };
}

const OutboundCalls: React.FC<OutboundCallsProps> = ({ filteredCalls, dateRange }) => {
  const getWorkingDaysCount = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    let count = 0;
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== 0) count++; // exclude Sundays
    }
    return count;
  };

  const workingDays = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return 0;
    return getWorkingDaysCount(dateRange.start, dateRange.end);
  }, [dateRange]);

  const totalValidQuotations = useMemo(() => {
    const invalid = ["n/a", "none", "na", "n.a", "n.a.", "", null, undefined];
    return filteredCalls.reduce((count, call) => {
      const value = (call.quotationnumber || "").toString().trim().toLowerCase();
      return invalid.includes(value) ? count : count + 1;
    }, 0);
  }, [filteredCalls]);

  const doneActivityCount = useMemo(() => {
    return filteredCalls.filter(
      (call) => (call.activitystatus || "").toLowerCase() === "delivered"
    ).length;
  }, [filteredCalls]);

  const groupedByTypeCall = useMemo(() => {
    const map: Record<string, number> = {};

    filteredCalls.forEach((call) => {
      const type = call.typecall?.trim().toLowerCase() || "unknown";
      if (type === "touch base") {
        map[type] = (map[type] || 0) + 1;
      }
    });

    const typecall = "touch base";
    const count = map[typecall] || 0;
    const totalOB = count * workingDays;
    const achievement = totalOB > 0 ? (count / totalOB) * 100 : 0;
    const callsToQuote = totalValidQuotations > 0 ? (count / totalValidQuotations) * 100 : 0;
    const outboundToSales = count > 0 ? (doneActivityCount / count) * 100 : 0;

    return [
      {
        typecall,
        obTarget: count,
        totalOB,
        achievement,
        callsToQuoteConversion: callsToQuote,
        outboundToSalesConversion: outboundToSales,
      },
    ];
  }, [filteredCalls, workingDays, totalValidQuotations, doneActivityCount]);

  const totalActualSales = useMemo(() => {
    return filteredCalls.reduce((sum, call) => {
      const value = Number(call.actualsales);
      return isNaN(value) ? sum : sum + value;
    }, 0);
  }, [filteredCalls]);

  const barChartData = useMemo(() => {
    return groupedByTypeCall.map((item) => ({
      typecall: item.typecall,
      obTarget: item.obTarget,
      totalOB: item.totalOB,
      actualSales: totalActualSales,
    }));
  }, [groupedByTypeCall, totalActualSales]);

  return (
    <div className="space-y-8">
      <div className="bg-white shadow-md rounded-lg p-4 font-sans text-black">
        <h2 className="text-sm font-bold mb-4">Outbound Calls (Touch-Based Only)</h2>

        {groupedByTypeCall.length === 0 ? (
          <p className="text-gray-500 text-xs">No calls found in selected date range.</p>
        ) : (
          <>
            {/* Gauge Charts - Separate Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {groupedByTypeCall.map((item, index) => (
                <React.Fragment key={`gauge-${index}`}>
                  <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                    <GaugeChart value={item.achievement} label="OB Achievement" />
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                    <GaugeChart value={item.outboundToSalesConversion} label="Outbound to Sales Conversion" />
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                    <GaugeChart value={item.callsToQuoteConversion} label="Calls to Quote Conversion" />
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Bar Chart */}
            <h2 className="text-sm font-bold mb-4">Sales & Quotation Amounts Comparison</h2>
            <div className="mb-4 border rounded-md shadow-md">
              <BarChart data={barChartData} />
            </div>

            {/* Table */}
            <div className="border rounded mb-4 overflow-x-auto">
              <table className="w-full text-xs table-auto">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="px-4 py-2">OB Target</th>
                    <th className="px-4 py-2">Total OB</th>
                    <th className="px-4 py-2">OB Achievement</th>
                    <th className="px-4 py-2">Calls to Quote Conversion (%)</th>
                    <th className="px-4 py-2">Outbound to Sales Conversion (%)</th>
                    <th className="px-4 py-2">Actual Sales from Outbound</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {groupedByTypeCall.map((item, index) => (
                    <tr key={`${item.typecall}-${index}`} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{item.obTarget}</td>
                      <td className="px-4 py-2">{item.totalOB}</td>
                      <td className="px-4 py-2">{item.achievement.toFixed(2)}%</td>
                      <td className="px-4 py-2">{item.callsToQuoteConversion.toFixed(2)}%</td>
                      <td className="px-4 py-2">{item.outboundToSalesConversion.toFixed(2)}%</td>
                      <td className="px-4 py-2 font-bold">
                        ₱{totalActualSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OutboundCalls;
