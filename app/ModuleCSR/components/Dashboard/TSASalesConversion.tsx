import React, { useEffect, useState } from "react";

interface Metric {
    CreatedAt: string;
    SalesAgent: string;
    salesCount: string;
    nonSalesCount: string;
    totalSalesAmount: string;
    totalQtySold: string;
    convertedSalesCount: string;
    avgtransactionUnit: string;
    avgtransactionValue: string;
    newClientAmount: string;
    newNonBuyingAmount: string;
    existingActiveAmount: string;
    existingInactiveAmount: string;

    newClientAmountSales: string;
    newNonBuyingAmountSales: string;
    existingActiveAmountSales: string;
    existingInactiveAmountSales: string;
}

const getWeekNumber = (dateString: string) => {
    const date = new Date(dateString);
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    return Math.ceil((date.getDate() + firstDayOfMonth.getDay()) / 7);
  };

const AgentSalesConversion: React.FC = () => {
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [filteredMetrics, setFilteredMetrics] = useState<Metric[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedWeek, setSelectedWeek] = useState("All");
    const [selectedMonth, setSelectedMonth] = useState("All");
    const [selectedYear, setSelectedYear] = useState("All");

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch("/api/ModuleCSR/Dashboard/TSASalesConversion");
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();

                // Calculate avgtransactionUnit for each metric
                const updatedData = data.map((metric: Metric) => {
                    // Calculate avgtransactionUnit as qtySold divided by convertedSalesCount
                    const avgtransactionUnit = metric.convertedSalesCount
                        ? Math.round(parseFloat(metric.totalQtySold) / parseFloat(metric.convertedSalesCount)).toString() // Round off the value to nearest integer
                        : "0"; // If no convertedSalesCount, set to "0"

                    const avgtransactionValue = metric.convertedSalesCount
                        ? Math.round(parseFloat(metric.totalSalesAmount.replace("₱", "").replace(",", "")) / parseFloat(metric.convertedSalesCount)).toString() // Remove ₱ and commas before dividing
                        : "0"; // If no convertedSalesCount, set to "0"    
                
                    return {
                        ...metric,
                        avgtransactionUnit: avgtransactionUnit,
                        avgtransactionValue: `₱${parseFloat(avgtransactionValue).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`, // Format avgtransactionValue with currency
                    };
                });                

                setMetrics(updatedData);
                setFilteredMetrics(updatedData); // Apply any filtering logic here if necessary
            } catch (error) {
                
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    useEffect(() => {
        let filteredData = [...metrics];
    
        if (selectedWeek !== "All") {
          const weekNumber = parseInt(selectedWeek.replace("Week ", ""), 10);
          filteredData = filteredData.filter((metric) => getWeekNumber(metric.CreatedAt) === weekNumber);
        }
    
        if (selectedMonth !== "All") {
          const monthNumber = new Date(selectedMonth + " 1, 2023").getMonth(); // Convert month name to number
          filteredData = filteredData.filter((metric) => new Date(metric.CreatedAt).getMonth() === monthNumber);
        }
    
        if (selectedYear !== "All") {
          filteredData = filteredData.filter((metric) => new Date(metric.CreatedAt).getFullYear().toString() === selectedYear);
        }
    
        setFilteredMetrics(filteredData);
      }, [selectedWeek, selectedMonth, selectedYear, metrics]);

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            {/* Filters */}
            <div className="flex space-x-4 mb-4">
        {/* Week Filter */}
        <div>
          <label className="text-xs font-semibold mr-2">Filter by Week:</label>
          <select className="border p-1 rounded text-xs" value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)}>
            <option value="All">All Weeks</option>
            <option value="Week 1">Week 1</option>
            <option value="Week 2">Week 2</option>
            <option value="Week 3">Week 3</option>
            <option value="Week 4">Week 4</option>
          </select>
        </div>

        {/* Month Filter */}
        <div>
          <label className="text-xs font-semibold mr-2">Filter by Month:</label>
          <select className="border p-1 rounded text-xs" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            <option value="All">All Months</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="text-xs font-semibold mr-2">Filter by Year:</label>
          <select className="border p-1 rounded text-xs" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="All">All Years</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>
      
            {loading ? (
                <p className="text-xs">Loading...</p>
            ) : (
                <table className="w-full border-collapse border border-gray-200 text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">TSA</th>
                            <th className="border p-2">Sales</th>
                            <th className="border p-2">Non Sales</th>
                            <th className="border p-2">% Traffic Cont.</th>
                            <th className="border p-2">Amount</th>
                            <th className="border p-2">Converted to Sale</th>
                            <th className="border p-2">% Inquiry to Sales Conversion</th>
                            <th className="border p-2">New Client</th>
                            <th className="border p-2">New Non-Buying</th>
                            <th className="border p-2">Existing Active</th>
                            <th className="border p-2">Existing Inactive</th>
                            <th className="border p-2">New Client (Converted to Sales)</th>
                            <th className="border p-2">New Non Buying (Converted to Sales)</th>
                            <th className="border p-2">Existing Active (Converted to Sales)</th>
                            <th className="border p-2">Existing Inactive (Converted to Sales)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMetrics.map((metric, index, array) => (
                            <React.Fragment key={index}>
                                {/* Display userName only once for each group */}
                                {(index === 0 || array[index - 1].SalesAgent !== metric.SalesAgent) && (
                                    <tr className="text-center border-t capitalize">
                                        {/* Grouping logic for userName */}
                                    </tr>
                                )}
                                {/* Data rows */}
                                <tr className="text-center border-t">
                                    <td className="border p-2 text-left capitalize">{metric.SalesAgent}</td>
                                    <td className="border p-2">{metric.salesCount}</td>
                                    <td className="border p-2">{metric.nonSalesCount}</td>
                                    <td className="border p-2"></td>
                                    <td className="border p-2">{metric.totalSalesAmount}</td>
                                    <td className="border p-2">{metric.convertedSalesCount}</td>
                                    <td className="border p-2"></td>
                                    <td className="border p-2">{metric.newClientAmount}</td>
                                    <td className="border p-2">{metric.newNonBuyingAmount}</td>
                                    <td className="border p-2">{metric.existingActiveAmount}</td>
                                    <td className="border p-2">{metric.existingInactiveAmount}</td>
                                    <td className="border p-2">{metric.newClientAmountSales}</td>
                                    <td className="border p-2">{metric.newNonBuyingAmountSales}</td>
                                    <td className="border p-2">{metric.existingActiveAmountSales}</td>
                                    <td className="border p-2">{metric.existingInactiveAmountSales}</td>
                                    {/* Add other columns as necessary */}
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AgentSalesConversion;
