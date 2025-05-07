import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure TASKFLOW_DB_URL is defined
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Create a reusable Neon database connection function
const Xchire_sql = neon(Xchire_databaseUrl);

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const referenceId = searchParams.get("referenceId");

        if (!referenceId) {
            return NextResponse.json({ success: false, error: "ReferenceID is required" }, { status: 400 });
        }

        // ✅ Updated Query: Check both referenceId and tsm
        const Xchire_progressData = await Xchire_sql`
        SELECT ticketreferencenumber, typeactivity, callstatus, typecall, remarks, startdate, id
        FROM progress 
        WHERE csragent = ${referenceId};
        `;

        return NextResponse.json({ success: true, data: Xchire_progressData }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch notifications." },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
