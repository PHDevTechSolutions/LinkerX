import React, { useState, useEffect, useRef } from "react";
import QuotationCharts from "./ChartControls/QuotationCharts";

interface Post {
  id: string;
  companyname: string;
  quotationnumber: string;
  quotationamount: string;
  sonumber: string;
  soamount: string;
  startdate: string;
  enddate: string;
}

interface QuotationSalesProps {
  groupedPosts: Record<string, Post[]>;
}

const CHART_HEIGHT = 400;
const MARGIN = { top: 20, right: 40, bottom: 50, left: 60 };

const QuotationSales: React.FC<QuotationSalesProps> = ({ groupedPosts }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(600);

  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    date: "",
    quotationAmount: undefined as number | undefined,
    soAmount: undefined as number | undefined,
    companyname: "",
  });

  // Load from localStorage
  useEffect(() => {
    const savedStart = localStorage.getItem("quotationChartStartDate");
    const savedEnd = localStorage.getItem("quotationChartEndDate");
    if (savedStart || savedEnd) {
      setDateRange({
        start: savedStart || "",
        end: savedEnd || "",
      });
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("quotationChartStartDate", dateRange.start);
    localStorage.setItem("quotationChartEndDate", dateRange.end);
  }, [dateRange]);

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setChartWidth(width);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const parseNumber = (val: string) => parseFloat(val) || 0;

  const scaleX = (index: number, datesLength?: number) =>
    MARGIN.left +
    (index * (chartWidth - MARGIN.left - MARGIN.right)) / ((datesLength || 1) - 1 || 1);

  const scaleY = (value: number, maxY?: number) =>
    CHART_HEIGHT -
    MARGIN.bottom -
    (value * (CHART_HEIGHT - MARGIN.top - MARGIN.bottom)) / (maxY || 1);

  const isWithinRange = (date: string) => {
    if (!dateRange.start || !dateRange.end) return true;
    const current = new Date(date).getTime();
    return current >= new Date(dateRange.start).getTime() &&
           current <= new Date(dateRange.end).getTime();
  };

  return (
    <div ref={containerRef}>
      <div className="flex gap-4 mb-4">
        <div>
          <label className="text-xs font-medium text-gray-700 mr-2">Start Date</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="border rounded px-2 py-1 text-xs"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 mr-2">End Date</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="border rounded px-2 py-1 text-xs"
          />
        </div>
      </div>

      {Object.entries(groupedPosts).map(([companyname, posts]) => {
        const filteredPosts = posts.filter(p => isWithinRange(p.startdate));
        if (filteredPosts.length === 0) return null;

        const dateMap: Record<string, { quotationSum: number; soSum: number }> = {};

        filteredPosts.forEach(post => {
          const dateKey = new Date(post.startdate).toISOString().slice(0, 10);
          if (!dateMap[dateKey]) dateMap[dateKey] = { quotationSum: 0, soSum: 0 };
          dateMap[dateKey].quotationSum += parseNumber(post.quotationamount);
          dateMap[dateKey].soSum += parseNumber(post.soamount);
        });

        const dates = Object.keys(dateMap).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        const quotationAmounts = dates.map(d => dateMap[d].quotationSum);
        const soAmounts = dates.map(d => dateMap[d].soSum);
        const maxY = Math.max(...quotationAmounts, ...soAmounts, 1);

        const sX = (i: number) => scaleX(i, dates.length);
        const sY = (v: number) => scaleY(v, maxY);

        const handleMouseEnter = (
          e: React.MouseEvent<SVGCircleElement>,
          date: string,
          qAmount: number,
          sAmount: number
        ) => {
          const svgRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
          if (!svgRect) return;
          const offsetX = e.clientX - svgRect.left;
          const offsetY = e.clientY - svgRect.top;
          setTooltip({
            visible: true,
            x: offsetX + 10,
            y: offsetY - 30,
            date,
            quotationAmount: qAmount,
            soAmount: sAmount,
            companyname,
          });
        };

        const handleMouseLeave = () => {
          setTooltip((t) => ({ ...t, visible: false }));
        };

        return (
          <div key={companyname} className="mb-8 border rounded-md p-4 shadow-md">
            <p className="text-xs font-semibold text-gray-800 truncate max-w-[70%]">
              Company: <span className="font-normal">{companyname}</span>
            </p>
            <p className="text-xs text-orange-600">
              Quotation Amount (Total):{" "}
              {quotationAmounts.reduce((a, b) => a + b, 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-blue-600">
              SO Amount (Total):{" "}
              {soAmounts.reduce((a, b) => a + b, 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>

            <QuotationCharts
              chartWidth={chartWidth}
              CHART_HEIGHT={CHART_HEIGHT}
              MARGIN={MARGIN}
              dates={dates}
              quotationAmounts={quotationAmounts}
              soAmounts={soAmounts}
              tooltip={tooltip}
              sX={sX}
              sY={sY}
              maxY={maxY}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
            />
          </div>
        );
      })}
    </div>
  );
};

export default QuotationSales;
