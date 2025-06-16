import React, { useMemo } from "react";

interface QuotationProps {
    records: any[];
}

const Quotation: React.FC<QuotationProps> = ({ records }) => {
    const invalid = ["", "n/a", "na", "none", "n.a", "n.a.", null, undefined];

    // Quote-Done records
    const quoteDoneRecords = useMemo(() => {
        return records.filter((rec) => {
            const quotation = (rec.quotationnumber || "").toString().trim().toLowerCase();
            const activity = (rec.activitystatus || "").trim().toLowerCase();
            return !invalid.includes(quotation) && activity === "quote-done";
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

    // Value as peso (totalSOAmount / totalQuoteAmount) * 100
    const valuePeso = totalQuoteAmount > 0 ? (soStats.totalSOAmount / totalQuoteAmount) * 100 : 0;

    // Quote to SO % by count (existing)
    const quoteToSO = totalQuoteCount > 0 ? (soStats.quantity / totalQuoteCount) * 100 : 0;

    // Aggregate Actual Sales by company
    const actualSalesByCompany = useMemo(() => {
        const map = new Map<string, number>();
        records.forEach((rec) => {
            const company = rec.companyname || "N/A";
            const sales = Number(rec.actualsales) || 0;
            if (sales > 0) {
                map.set(company, (map.get(company) || 0) + sales);
            }
        });
        return map;
    }, [records]);

    // Aggregated Quote-Done grouped by company
    const aggregatedData = useMemo(() => {
        const map = new Map<
            string,
            { totalCount: number; totalQuoteAmount: number; totalHandlingMs: number }
        >();

        quoteDoneRecords.forEach((rec) => {
            const company = rec.companyname || "N/A";
            const amount = Number(rec.quotationamount) || 0;

            let handlingMs = 0;
            try {
                const start = new Date(rec.startdate);
                const end = new Date(rec.enddate);
                if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
                    handlingMs = end.getTime() - start.getTime();
                }
            } catch { }

            const current = map.get(company) || { totalCount: 0, totalQuoteAmount: 0, totalHandlingMs: 0 };
            map.set(company, {
                totalCount: current.totalCount + 1,
                totalQuoteAmount: current.totalQuoteAmount + amount,
                totalHandlingMs: current.totalHandlingMs + handlingMs,
            });
        });

        const formatDuration = (ms: number) => {
            const totalSeconds = Math.floor(ms / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            const pad = (n: number) => n.toString().padStart(2, "0");
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        };

        // Combine actual sales totals per company here
        return Array.from(map.entries()).map(([company, data]) => ({
            company,
            ...data,
            handlingTimeFormatted: formatDuration(data.totalHandlingMs),
            actualSalesTotal: actualSalesByCompany.get(company) || 0,
        }));
    }, [quoteDoneRecords, actualSalesByCompany]);

    // Actual Sales records (no grouping)
    const paidActualSalesRecords = useMemo(() => {
        return records.filter(
            rec =>
                (rec.activitystatus || "").toLowerCase() === "paid" &&
                (Number(rec.actualsales) || 0) > 0
        );
    }, [records]);

    const totalPaidActualSales = useMemo(() => {
        return paidActualSalesRecords.reduce(
            (sum, rec) => sum + (Number(rec.actualsales) || 0),
            0
        );
    }, [paidActualSalesRecords]);

    return (
        <div className="space-y-8">
            {/* Quotations Table */}
            <div className="bg-white shadow-md rounded-lg p-6 font-sans overflow-x-auto">
                <h2 className="text-sm font-bold mb-4">Quotations</h2>
                {aggregatedData.length === 0 ? (
                    <p className="text-gray-500 text-xs">No quotations with status "Quote-Done".</p>
                ) : (
                    <table className="w-full text-xs table-auto">
                        <thead className="bg-gray-100">
                            <tr className="text-left">
                                <th className="px-4 py-2">Company</th>
                                <th className="px-4 py-2">Total Count</th>
                                <th className="px-4 py-2">Total Amount</th>
                                <th className="px-4 py-2">Handling Time</th>
                                <th className="px-4 py-2">Quote to SO Conversion</th>
                                <th className="px-4 py-2">Quote to SO Conversion (Peso Value)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {aggregatedData.map(
                                ({ company, totalCount, totalQuoteAmount, handlingTimeFormatted }, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-2">{company}</td>
                                        <td className="px-4 py-2">{totalCount}</td>
                                        <td className="px-4 py-2">{totalQuoteAmount.toFixed(2)}</td>
                                        <td className="px-4 py-2">{handlingTimeFormatted}</td>
                                        <td className="px-4 py-2">{quoteToSO.toFixed(2)}%</td>
                                        <td className="px-4 py-2">₱{valuePeso.toFixed(2)}</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 font-sans overflow-x-auto">
                <h2 className="text-sm font-bold mb-4">Actual Sales (Activity: Paid)</h2>
                {paidActualSalesRecords.length === 0 ? (
                    <p className="text-gray-500 text-xs">No actual sales with activitystatus "Paid".</p>
                ) : (
                    <table className="w-full text-xs table-auto">
                        <thead className="bg-gray-100">
                            <tr className="text-left">
                                <th className="px-4 py-2">Company Name</th>
                                <th className="px-4 py-2">Actual Sales Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paidActualSalesRecords.map((rec, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-2">{rec.companyname || "N/A"}</td>
                                    <td className="px-4 py-2">₱{(Number(rec.actualsales) || 0).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-bold bg-gray-100">
                                <td className="px-4 py-2 text-right">Total:</td>
                                <td className="px-4 py-2">₱{totalPaidActualSales.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                )}
            </div>


        </div>
    );
};

export default Quotation;
