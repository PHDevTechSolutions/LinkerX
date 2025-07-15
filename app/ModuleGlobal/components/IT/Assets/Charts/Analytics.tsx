"use client";

import React from "react";

import SummaryCards from "./SummaryCards";
import TypeChart from "./TypeChart";
import BrandChart from "./BrandChart";
import RamChart from "./RamChart";
import TotalAssets from "./TotalAssets";
import PurchaseTrends from "./PurchaseTrends";

interface AssetItem {
  type: string;
  brand: string;
  model?: string;
  price: number;
  dateOfPurchase: string;
  ram?: string;
}

interface AnalyticsProps {
  data: AssetItem[];
}

const Analytics: React.FC<AnalyticsProps> = ({ data }) => {
  const assetTypeCounts = data.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  const brandCounts = data.reduce<Record<string, number>>((acc, item) => {
    acc[item.brand] = (acc[item.brand] || 0) + 1;
    return acc;
  }, {});

  const ramCounts = data.reduce<Record<string, number>>((acc, item) => {
    const ramKey = item.ram || "Unknown";
    acc[ramKey] = (acc[ramKey] || 0) + 1;
    return acc;
  }, {});

  const brandPriceTotals = data.reduce<Record<string, number>>((acc, item) => {
    acc[item.brand] = (acc[item.brand] || 0) + item.price;
    return acc;
  }, {});

  const purchaseTrends = data.reduce<Record<string, number>>((acc, item) => {
    if (!item.dateOfPurchase) return acc;
    const date = new Date(item.dateOfPurchase);
    if (isNaN(date.getTime())) return acc;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const assetChartData = Object.entries(assetTypeCounts).map(([name, value]) => ({ name, value }));
  const brandChartData = Object.entries(brandCounts).map(([name, value]) => ({ name, value }));
  const brandPriceData = Object.entries(brandPriceTotals).map(([brand, total]) => ({ brand, total }));
  const trendData = Object.entries(purchaseTrends)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  const totalAssets = data.length;
  const totalValue = data.reduce((sum, item) => sum + item.price, 0);
  const totalLaptop = data.filter(item => item.type === "Laptop").length;
  const totalPrinter = data.filter(item => item.type === "Printer").length;

  return (
    <div className="space-y-6 mt-4">
      <SummaryCards
        totalAssets={totalAssets}
        totalLaptop={totalLaptop}
        totalPrinter={totalPrinter}
        totalValue={totalValue}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <TypeChart data={assetChartData} />
        <BrandChart data={brandChartData} />
      </div>

      {/* RAM Chart (with filtered data for brand + model) */}
      <RamChart rawData={data.filter(item => item.model)} />

      <TotalAssets data={brandPriceData} />
      <PurchaseTrends data={trendData} />
    </div>
  );
};

export default Analytics;
