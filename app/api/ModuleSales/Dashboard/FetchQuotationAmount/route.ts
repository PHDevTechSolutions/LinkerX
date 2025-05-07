import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const referenceID = searchParams.get("referenceID");

        if (!referenceID) {
            return NextResponse.json({ success: false, error: "ReferenceID is required." }, { status: 400 });
        }

        // Fetch total actual sales for today based on date_created
        const Xchire_fetch = await Xchire_sql`
            SELECT COALESCE(SUM(quotationamount), 0) AS totalQuotationAmount 
            FROM progress 
            WHERE referenceid = ${referenceID} 
            AND DATE_TRUNC('day', date_created) = CURRENT_DATE
        `;

        const totalQuotationAmount = Xchire_fetch.length > 0 ? Xchire_fetch[0].totalquotationamount : 0;

        return NextResponse.json({ success: true, totalQuotationAmount }, { status: 200 });
    } catch (Xchire_error: any) {
        console.error("Error fetching actual sales data:", Xchire_error);
        return NextResponse.json(
            { success: false, error: Xchire_error.message || "Failed to fetch actual sales data." },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
