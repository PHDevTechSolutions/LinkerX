import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.TASKFLOW_DB_URL;
if (!databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const referenceID = searchParams.get("referenceID");

        if (!referenceID) {
            return NextResponse.json({ success: false, error: "ReferenceID is required." }, { status: 400 });
        }

        // Fetch total activity count for today
        const activityResult = await sql`
            SELECT COUNT(*) AS totalActivityCount 
            FROM progress 
            WHERE referenceid = ${referenceID} 
            AND DATE_TRUNC('day', date_created) = CURRENT_DATE
        `;

        const totalActivityCount = activityResult.length > 0 ? activityResult[0].totalactivitycount : 0;

        return NextResponse.json({ success: true, totalActivityCount }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch data." },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
