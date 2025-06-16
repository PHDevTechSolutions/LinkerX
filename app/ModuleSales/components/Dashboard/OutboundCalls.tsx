import React, { useMemo } from "react";

interface OutboundCallsProps {
  filteredCalls: any[];
  dateRange: { start: string; end: string };
}

const OutboundCalls: React.FC<OutboundCallsProps> = ({ filteredCalls, dateRange }) => {
  // Calculate total working days excluding Sundays only
  const getWorkingDaysCount = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    let count = 0;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== 0) count++; // Exclude Sundays
    }
    return count;
  };

  const workingDays = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return 0;
    return getWorkingDaysCount(dateRange.start, dateRange.end);
  }, [dateRange]);

  // Calculate total valid quotations count (no grouping by quotation number)
  const totalValidQuotations = useMemo(() => {
    const invalidValues = ["n/a", "none", "na", "n.a", "n.a.", "", null, undefined];

    return filteredCalls.reduce((count, call) => {
      const raw = (call.quotationnumber || "").toString().trim().toLowerCase();
      if (!invalidValues.includes(raw)) {
        return count + 1;
      }
      return count;
    }, 0);
  }, [filteredCalls]);

  // Count activitystatus === "Done"
  const doneActivityCount = useMemo(() => {
    return filteredCalls.reduce((count, call) => {
      if ((call.activitystatus || "").toLowerCase() === "done") {
        return count + 1;
      }
      return count;
    }, 0);
  }, [filteredCalls]);

  // Group by typecall with OB metrics and quotation counts
  // Only include "touch base"
  const groupedByTypeCall = useMemo(() => {
    const map: Record<string, number> = {};

    filteredCalls.forEach((call) => {
      const typecall = call.typecall?.trim() || "Unknown";
      if (typecall.toLowerCase() === "touch base") {
        const key = typecall.toLowerCase();
        map[key] = (map[key] || 0) + 1;
      }
    });

    const typecall = "touch base";
    const key = typecall.toLowerCase();
    const obTarget = map[key] || 0;
    const totalOB = obTarget * workingDays;
    const achievement = totalOB > 0 ? (obTarget / totalOB) * 100 : 0;

    // Updated Calls to Quote Conversion:
    // = (OB Target / Total Valid Quotations) * 100
    const callsToQuoteConversion =
      totalValidQuotations > 0 ? (obTarget / totalValidQuotations) * 100 : 0;

    // Outbound to Sales Conversion (%)
    const outboundToSalesConversion =
      obTarget > 0 ? (doneActivityCount / obTarget) * 100 : 0;

    return [
      {
        typecall,
        obTarget,
        totalOB,
        achievement: achievement.toFixed(2),
        callsToQuoteConversion: callsToQuoteConversion.toFixed(2),
        outboundToSalesConversion: outboundToSalesConversion.toFixed(2),
      },
    ];
  }, [filteredCalls, workingDays, totalValidQuotations, doneActivityCount]);

  // Calculate total actual sales amount
  const totalActualSales = useMemo(() => {
    return filteredCalls.reduce((sum, call) => {
      const sales = Number(call.actualsales);
      return sum + (isNaN(sales) ? 0 : sales);
    }, 0);
  }, [filteredCalls]);

  return (
    <div className="space-y-8">
      {/* Typecall Breakdown */}
      <div className="bg-white shadow-md rounded-lg p-6 font-sans overflow-x-auto">
        <h2 className="text-sm font-bold mb-4">Outbound Calls</h2>
        {groupedByTypeCall.length === 0 ? (
          <p className="text-gray-500 text-xs">No calls found in selected date range.</p>
        ) : (
          <div className="overflow-auto border rounded">
            <table className="w-full text-xs">
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
                {groupedByTypeCall.map(
                  ({ typecall, obTarget, totalOB, achievement, callsToQuoteConversion, outboundToSalesConversion }, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{obTarget}</td>
                      <td className="px-4 py-2">{totalOB}</td>
                      <td className="px-4 py-2">{achievement}%</td>
                      <td className="px-4 py-2">{callsToQuoteConversion}%</td>
                      <td className="px-4 py-2">{outboundToSalesConversion}%</td>
                      <td className="px-4 py-2 font-bold">{totalActualSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutboundCalls;
