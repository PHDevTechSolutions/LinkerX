"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ShopifyOrder {
  created_at: string;
  current_total_price: string;
}

type Granularity = "day" | "month" | "year";
type FilterType = "7days" | "month" | "range";

const DAY_MS = 24 * 60 * 60 * 1000;

const formatKey = (d: Date, g: Granularity) => {
  if (g === "year") return d.getFullYear().toString();
  if (g === "month")
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  return d.toISOString().split("T")[0];
};

const aggregate = (
  orders: ShopifyOrder[],
  granularity: Granularity
): { period: string; total: number }[] => {
  const map = new Map<string, number>();
  orders.forEach((o) => {
    const key = formatKey(new Date(o.created_at), granularity);
    map.set(key, (map.get(key) || 0) + Number(o.current_total_price));
  });
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([period, total]) => ({ period, total }));
};

const ShopifySalesBar: React.FC<{ granularity?: Granularity }> = ({
  granularity = "day",
}) => {
  const [orders, setOrders] = useState<ShopifyOrder[]>([]);
  const [loading, setLoading] = useState(true);

  /* filter state */
  const [filterType, setFilterType] = useState<FilterType>("7days");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  /* fetch orders once */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/Data/Applications/Shopify/FetchOrder");
        const json = await res.json();
        if (json.success) setOrders(json.data);
      } catch (e) {
        console.error("Failed to fetch Shopify orders", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* apply date filter */
  const filteredOrders = useMemo(() => {
    if (!orders.length) return [];
    const now = Date.now();
    let list: ShopifyOrder[] = [];

    if (filterType === "7days") {
      const cutoff = now - 7 * DAY_MS;
      list = orders.filter(
        (o) =>
          new Date(o.created_at).getTime() >= cutoff &&
          new Date(o.created_at).getTime() <= now
      );
    } else if (filterType === "month") {
      const today = new Date();
      const startOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      ).getTime();
      list = orders.filter(
        (o) =>
          new Date(o.created_at).getTime() >= startOfMonth &&
          new Date(o.created_at).getTime() <= now
      );
    } else if (filterType === "range" && rangeStart && rangeEnd) {
      const start = new Date(rangeStart).getTime();
      const end = new Date(rangeEnd).getTime() + DAY_MS - 1;
      list = orders.filter((o) => {
        const t = new Date(o.created_at).getTime();
        return t >= start && t <= end;
      });
    } else {
      list = orders;
    }
    return list;
  }, [orders, filterType, rangeStart, rangeEnd]);

  const data = useMemo(
    () => aggregate(filteredOrders, granularity),
    [filteredOrders, granularity]
  );

  return (
    <div className="p-4 bg-white border shadow-md rounded-lg h-96">
      <h3 className="text-xs font-semibold mb-2 capitalize">
        Shopify Sales by {granularity}
      </h3>

      {/* filters */}
      <div className="flex flex-wrap items-center gap-3 mb-3 text-xs">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="f"
            value="7days"
            checked={filterType === "7days"}
            onChange={() => setFilterType("7days")}
          />
          Last 7 days
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="f"
            value="month"
            checked={filterType === "month"}
            onChange={() => setFilterType("month")}
          />
          This month
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="f"
            value="range"
            checked={filterType === "range"}
            onChange={() => setFilterType("range")}
          />
          Date range
        </label>
        {filterType === "range" && (
          <>
            <input
              type="date"
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
              className="border rounded px-1 py-0.5"
            />
            <input
              type="date"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
              className="border rounded px-1 py-0.5"
            />
          </>
        )}
      </div>

      {loading ? (
        <p className="text-xs text-gray-500">Loading…</p>
      ) : data.length === 0 ? (
        <p className="text-xs text-gray-500">No sales data</p>
      ) : (
        <ResponsiveContainer width="100%" height="80%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            style={{ fontSize: "12px" }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis tickFormatter={(v) => `₱${v}`} />
            <Tooltip
              wrapperStyle={{ outline: "none" }}
              contentStyle={{
                background: "white",
                borderRadius: "0.25rem",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                fontSize: "12px",
              }}
              labelStyle={{ fontWeight: 600, textTransform: "capitalize" }}
              formatter={(v: number) =>
                `₱${v.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}`
              }
            />
            <Bar dataKey="total" fill="#34d399" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ShopifySalesBar;
