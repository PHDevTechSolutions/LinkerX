import React, { useMemo } from "react";
import Histogram from "./Chart/Histogram";
import GaugeQChart from "./Chart/GaugeQChart";

interface QuotationProps {
  records: any[];
}

const Quotation: React.FC<QuotationProps> = ({ records }) => {
  // Quote-Done records
  const quoteDoneRecords = useMemo(() => {
    return records.filter((rec) => {
      const activity = (rec.activitystatus || "").trim().toLowerCase();
      return activity === "quote-done";
    });
  }, [records]);

  const totalQuoteCount = quoteDoneRecords.length;

  // Total quotation amount from quote-done records
  const totalQuoteAmount = useMemo(() => {
    return quoteDoneRecords.reduce((sum, rec) => sum + (Number(rec.quotationamount) || 0), 0);
  }, [quoteDoneRecords]);

  // SO-Done records & aggregated amount
  const soStats = useMemo(() => {
    const filtered = records.filter((rec) => {
      const activity = (rec.activitystatus || "").trim().toLowerCase();
      return activity === "so-done";
    });

    const totalSOAmount = filtered.reduce((sum, rec) => {
      return sum + (Number(rec.soamount) || 0);
    }, 0);

    return {
      quantity: filtered.length,
      totalSOAmount,
    };
  }, [records]);

  // Actual Sales records (paid)
  const paidActualSalesRecords = useMemo(() => {
    return records.filter(
      (rec) =>
        (rec.activitystatus || "").toLowerCase() === "delivered" &&
        (Number(rec.actualsales) || 0) > 0
    );
  }, [records]);

  const totalPaidActualSales = useMemo(() => {
    return paidActualSalesRecords.reduce(
      (sum, rec) => sum + (Number(rec.actualsales) || 0),
      0
    );
  }, [paidActualSalesRecords]);

  // Quote to SO Conversion (percentage by count)
  const quoteToSO = totalQuoteCount > 0 ? (soStats.quantity / totalQuoteCount) * 100 : 0;

  // Quote to SO Conversion (percentage by amount)
  const valuePeso = totalQuoteAmount > 0 ? (soStats.totalSOAmount / totalQuoteAmount) * 100 : 0;

  // Quotation to SI Conversion (percentage by amount)
  const quoteToSIValuePeso = totalQuoteAmount > 0 ? (totalPaidActualSales / totalQuoteAmount) * 100 : 0;

  // Aggregated quote data for table
  const aggregatedData = useMemo(() => {
    let totalCount = 0;
    let totalQuoteAmount = 0;
    let totalHandlingMs = 0;

    quoteDoneRecords.forEach((rec) => {
      const amount = Number(rec.quotationamount) || 0;

      let handlingMs = 0;
      try {
        const start = new Date(rec.startdate);
        const end = new Date(rec.enddate);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
          handlingMs = end.getTime() - start.getTime();
        }
      } catch {
        // ignore
      }

      totalCount += 1;
      totalQuoteAmount += amount;
      totalHandlingMs += handlingMs;
    });

    const formatDuration = (ms: number) => {
      const totalSeconds = Math.floor(ms / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

    return [
      {
        totalCount,
        totalQuoteAmount,
        handlingTimeFormatted: formatDuration(totalHandlingMs),
      },
    ];
  }, [quoteDoneRecords]);

  // Handling times in ms array for histogram
  const handlingTimesMs = useMemo(() => {
    return quoteDoneRecords
      .map((rec) => {
        try {
          const start = new Date(rec.startdate);
          const end = new Date(rec.enddate);
          if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
            return end.getTime() - start.getTime();
          }
        } catch {}
        return 0;
      })
      .filter((ms) => ms > 0);
  }, [quoteDoneRecords]);

  return (
    <div className="space-y-8">
      <div className="bg-white shadow-md rounded-lg p-4 font-sans text-black">
        <h2 className="text-sm font-bold mb-4">Quotations</h2>

        {/* Gauges Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
            <GaugeQChart value={quoteToSO} label="Quote to SO Conversion" color="#3B82F6" />
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
            <GaugeQChart value={valuePeso} label="Quote to SO Conversion" color="#10B981" />
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
            <GaugeQChart value={quoteToSIValuePeso} label="Quotation to SI Conversion" color="#F59E0B" />
          </div>
        </div>

        {aggregatedData.length === 0 ? (
          <p className="text-gray-500 text-xs">No quotations with status "Quote-Done".</p>
        ) : (
          <div className="overflow-auto border rounded">
            <table className="w-full text-xs table-auto">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <th className="px-4 py-2">Total Count</th>
                  <th className="px-4 py-2">Total Amount</th>
                  <th className="px-4 py-2">Handling Time</th>
                  <th className="px-4 py-2">Quote to SO Conversion</th>
                  <th className="px-4 py-2">Quote to SO Conversion</th>
                  <th className="px-4 py-2">Quotation to SI Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {aggregatedData.map(
                  ({ totalCount, totalQuoteAmount, handlingTimeFormatted }, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{totalCount}</td>
                      <td className="px-4 py-2">{totalQuoteAmount.toFixed(2)}</td>
                      <td className="px-4 py-2">{handlingTimeFormatted}</td>
                      <td className="px-4 py-2">{quoteToSO.toFixed(2)}%</td>
                      <td className="px-4 py-2">₱{valuePeso.toFixed(2)}</td>
                      <td className="px-4 py-2">₱{quoteToSIValuePeso.toFixed(2)}</td>
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

export default Quotation;
