"use client";

import React, { useMemo } from "react";
// Routes
import SummaryCards from "./Charts/SummaryCards";
import ActivityStatus from "./Charts/ActivityStatus";
import ActualSales from "./Charts/ActualSales";
import QuotationAmount from "./Charts/QuotationAmount";
import SOAmount from "./Charts/SOAmount";
import ConversionRates from "./Charts/ConversionRates";
import ActivityCount from "./Charts/ActivityCount";

interface AnalyticsXchireProps {
    updatedUser: any[];
}

const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7f50",
    "#00c49f",
    "#ff8042",
    "#a4de6c",
    "#d0ed57",
    "#8dd1e1",
];

const AnalyticsXchire: React.FC<AnalyticsXchireProps> = ({ updatedUser }) => {
    // Status distribution
    const statusDistribution = useMemo(() => {
        const statusMap: Record<string, number> = {};
        updatedUser.forEach((post) => {
            const status = post.activitystatus || "Unknown";
            statusMap[status] = (statusMap[status] || 0) + 1;
        });
        return Object.entries(statusMap).map(([status, count]) => ({
            name: status,
            value: count,
        }));
    }, [updatedUser]);

    // Actual Sales per CSR agent
    const salesPerAgent = useMemo(() => {
        const agentMap: Record<string, number> = {};
        updatedUser.forEach((post) => {
            const agent = post.csragent || "Unassigned";
            const sales = Number(post.actualsales) || 0;
            agentMap[agent] = (agentMap[agent] || 0) + sales;
        });
        return Object.entries(agentMap).map(([name, value]) => ({ name, value }));
    }, [updatedUser]);

    // Quotation Amount per CSR agent
    const quotationPerAgent = useMemo(() => {
        const agentMap: Record<string, number> = {};
        updatedUser.forEach((post) => {
            const agent = post.csragent || "Unassigned";
            const quotation = Number(post.quotationamount) || 0;
            agentMap[agent] = (agentMap[agent] || 0) + quotation;
        });
        return Object.entries(agentMap).map(([name, value]) => ({ name, value }));
    }, [updatedUser]);

    // SO Amount per CSR agent
    const soAmountPerAgent = useMemo(() => {
        const agentMap: Record<string, number> = {};
        updatedUser.forEach((post) => {
            const agent = post.csragent || "Unassigned";
            const soAmount = Number(post.soamount) || 0;
            agentMap[agent] = (agentMap[agent] || 0) + soAmount;
        });
        return Object.entries(agentMap).map(([name, value]) => ({ name, value }));
    }, [updatedUser]);

    // Conversion rate per CSR agent (actualsales / quotationamount)
    const conversionPerAgent = useMemo(() => {
        const agentData: Record<
            string,
            { sales: number; quotation: number; conversion: number }
        > = {};
        updatedUser.forEach((post) => {
            const agent = post.csragent || "Unassigned";
            const sales = Number(post.actualsales) || 0;
            const quotation = Number(post.quotationamount) || 0;

            if (!agentData[agent]) {
                agentData[agent] = { sales: 0, quotation: 0, conversion: 0 };
            }

            agentData[agent].sales += sales;
            agentData[agent].quotation += quotation;
        });

        return Object.entries(agentData).map(([name, data]) => ({
            name,
            conversion:
                data.quotation > 0 ? (data.sales / data.quotation) * 100 : 0,
        }));
    }, [updatedUser]);

    // Activity Count per Type
    const activityPerType = useMemo(() => {
        const typeMap: Record<string, number> = {};
        updatedUser.forEach((post) => {
            const type = post.typeactivity || "Unknown";
            typeMap[type] = (typeMap[type] || 0) + 1;
        });
        return Object.entries(typeMap).map(([name, value]) => ({ name, value }));
    }, [updatedUser]);

    // Grand totals
    const grandTotals = useMemo(() => {
        let totalQuotation = 0;
        let totalSOAmount = 0;
        let totalActualSales = 0;

        updatedUser.forEach((post) => {
            totalQuotation += Number(post.quotationamount) || 0;
            totalSOAmount += Number(post.soamount) || 0;
            totalActualSales += Number(post.actualsales) || 0;
        });

        return { totalQuotation, totalSOAmount, totalActualSales };
    }, [updatedUser]);

    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <SummaryCards totalQuotation={grandTotals.totalQuotation} totalSOAmount={grandTotals.totalSOAmount} totalActualSales={grandTotals.totalActualSales} />
            {/* Charts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Activity Status */}
                <ActivityStatus statusDistribution={statusDistribution} colors={COLORS} />
                {/* Actual Sales */}
                <ActualSales updatedUser={updatedUser} />
                {/* Quotation Amount */}
                <QuotationAmount quotationPerAgent={quotationPerAgent} />
                {/* SO Amount */}
                <SOAmount data={soAmountPerAgent} />
                {/* Conversion Rate */}
                <ConversionRates data={conversionPerAgent} />
                {/* Activity Count per Type */}
                <ActivityCount data={activityPerType} />
            </div>
        </div>
    );
};

export default AnalyticsXchire;
