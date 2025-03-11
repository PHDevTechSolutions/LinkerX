import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const referenceID = searchParams.get("referenceID");

        if (!referenceID) {
            return NextResponse.json({ success: false, error: "ReferenceID is required." }, { status: 400 });
        }

        // Fetch total actual sales for today based on date_created
        const salesResult = await sql`
            SELECT COALESCE(SUM(actualsales), 0) AS totalActualSales 
            FROM progress 
            WHERE referenceid = ${referenceID} 
            AND DATE_TRUNC('day', date_created) = CURRENT_DATE
        `;

        const totalActualSales = salesResult.length > 0 ? salesResult[0].totalactualsales : 0;

        return NextResponse.json({ success: true, totalActualSales }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching actual sales data:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch actual sales data." },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
