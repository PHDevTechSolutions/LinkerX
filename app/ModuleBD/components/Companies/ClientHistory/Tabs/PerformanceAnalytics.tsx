import React, { useMemo, useState } from "react";
import QuotationActualSales from "./Analytics/QuotationActualSales";
import TrendAnalysis from "./Analytics/TrendAnalysis";
import SOAmountQuotation from "./Analytics/SOAmountQuotation";
import SOAmountActualSales from "./Analytics/SOAmountActualSales";
import SalesGrowthRate from "./Analytics/SalesGrowthRate";
import LeadTimeResponseAnalysis from "./Analytics/LeadTimeResponseAnalysis";
import CallStatusBreakDown from "./Analytics/CallStatusBreakDown";
import Seasonality from "./Analytics/Seasonality";
import ProjectAnalysis from "./Analytics/ProjectAnalysis";
import SalesPipeline from "./Analytics/SalesPipeline";
import DropOffRate from "./Analytics/DropOffRate";

export interface SalesRecord {
  project: string;
  date_created: string;
  startdate?: string; // assuming some records may have this
  enddate?: string;
  quotationamount: number;
  soamount: number;
  actualsales: number;
  targetquota: number;
  csragent: string;
  callstatus: string;
  callback: string;
  projectname: string;
}

interface PerformanceAnalyticsProps {
  groupedPosts: Record<string, SalesRecord[]>;
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ groupedPosts }) => {
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");

  // Flatten groupedPosts into array
  const records: SalesRecord[] = useMemo(() => {
    return Object.values(groupedPosts).flat();
  }, [groupedPosts]);

  // Filter records by date range based on overlap of record date range and filter date range
  const filteredRecords = useMemo(() => {
    if (!startDateFilter && !endDateFilter) return records;

    const startFilter = startDateFilter ? new Date(startDateFilter) : null;
    const endFilter = endDateFilter ? new Date(endDateFilter) : null;

    return records.filter(({ startdate, enddate, date_created }) => {
      const recordStart = startdate ? new Date(startdate) : new Date(date_created);
      const recordEnd = enddate ? new Date(enddate) : new Date(date_created);

      const filterStart = startFilter || new Date(-8640000000000000); // earliest possible date
      const filterEnd = endFilter || new Date(8640000000000000); // latest possible date

      return recordStart <= filterEnd && recordEnd >= filterStart;
    });
  }, [records, startDateFilter, endDateFilter]);

  // Calculate month-wise totals for quotationamount and actualsales
  const monthlyTotals = useMemo(() => {
    const totals: Record<
      string,
      { quotationTotal: number; actualsalesTotal: number }
    > = {};

    filteredRecords.forEach(({ date_created, quotationamount, actualsales }) => {
      if (!date_created) return;
      const month = new Date(date_created).toISOString().slice(0, 7); // "YYYY-MM"

      if (!totals[month]) {
        totals[month] = { quotationTotal: 0, actualsalesTotal: 0 };
      }
      totals[month].quotationTotal += quotationamount;
      totals[month].actualsalesTotal += actualsales;
    });

    // Sort months ascending
    const sortedMonths = Object.keys(totals).sort();

    return sortedMonths.map((month) => ({
      month,
      quotationTotal: totals[month].quotationTotal,
      actualsalesTotal: totals[month].actualsalesTotal,
    }));
  }, [filteredRecords]);

  return (
    <div className="space-y-8 p-4">
      {/* Date range inputs */}
      <section className="mb-6 flex gap-4 items-center">
        <label className="text-xs">
          Start Date:{" "}
          <input
            type="date"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            max={endDateFilter || undefined}
            className="border rounded px-2 py-1 text-xs"
          />
        </label>
        <label className="text-xs">
          End Date:{" "}
          <input
            type="date"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
            min={startDateFilter || undefined}
            className="border rounded px-2 py-1 text-xs"
          />
        </label>
        <button
          className="text-xs"
          onClick={() => {
            setStartDateFilter("");
            setEndDateFilter("");
          }}
        >
          Clear Filter
        </button>
      </section>

      {/* Conversion Rate Chart (Quotation vs Actual Sales) */}
      <QuotationActualSales records={filteredRecords} />
      {/* Trend Analysis Bar Chart */}
      <TrendAnalysis records={filteredRecords} />
      {/* Conversion Rate (SO Amount vs Quotation) */}
      <SOAmountQuotation records={filteredRecords} />
      {/* SO Amount vs Actual Sales (Bar Chart) */}
      <SOAmountActualSales records={filteredRecords} />
      {/* Sales Growth Rate Chart */}
      <SalesGrowthRate records={filteredRecords} />
      {/* Lead Time Response Analysis */}
      <LeadTimeResponseAnalysis records={filteredRecords} />
      {/* Call Status Breakdown */}
      <CallStatusBreakDown records={filteredRecords} />
      {/* Seasonality */}
      <Seasonality records={filteredRecords} />
      {/* Project Analysis */}
      <ProjectAnalysis records={filteredRecords} />
      {/* Sales Pipeline */}
      <SalesPipeline records={filteredRecords} />
      {/* Drop Off Rate */}
      <DropOffRate records={filteredRecords} />
    </div>
  );
};

export default PerformanceAnalytics;
