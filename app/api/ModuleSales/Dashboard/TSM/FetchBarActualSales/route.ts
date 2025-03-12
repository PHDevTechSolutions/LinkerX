import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const getFormattedDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    };

    return new Intl.DateTimeFormat("en-GB", options).format(date);
};

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const tsm = searchParams.get("tsm");

        if (!tsm) {
            return NextResponse.json({ success: false, error: "tsm is required." }, { status: 400 });
        }

        // Fetch total actual sales grouped by exact date and sum them
        const salesResult = await sql`
            SELECT DATE(date_created) AS date_created, COALESCE(SUM(actualsales), 0) AS totalActualSales
            FROM progress 
            WHERE tsm = ${tsm}
            GROUP BY DATE(date_created)
            ORDER BY date_created DESC
        `;

        // Format the results for the frontend
        const salesData = salesResult.map((sale: any) => ({
            date_created: getFormattedDate(sale.date_created), // Format to 'YYYY-MM-DD'
            actualsales: sale.totalactualsales,
        }));

        return NextResponse.json({ success: true, data: salesData }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching actual sales data:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch actual sales data." },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
