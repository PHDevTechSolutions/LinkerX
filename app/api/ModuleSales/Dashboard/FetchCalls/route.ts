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

        // Fetch only Outbound Calls with typecall = 'Touchbase' and typeactivity = 'Outbound Call'
        const [outboundResult, inboundResult] = await Promise.all([
            sql`
                SELECT COUNT(*)::int AS total
                FROM progress
                WHERE referenceid = ${referenceID}
                AND typeactivity = 'Outbound Call'
                AND typecall = 'Touch Base'
                AND DATE_TRUNC('day', date_created) = CURRENT_DATE
            `,
            sql`
                SELECT COUNT(*)::int AS total
                FROM progress
                WHERE referenceid = ${referenceID}
                AND typeactivity = 'Inbound Call'
                AND DATE_TRUNC('day', date_created) = CURRENT_DATE
            `
        ]);

        // Debugging logs (optional)
        console.log("Outbound Result:", outboundResult);
        console.log("Inbound Result:", inboundResult);

        const totalOutbound = outboundResult.length > 0 ? outboundResult[0].total : 0;
        const totalInbound = inboundResult.length > 0 ? inboundResult[0].total : 0;

        return NextResponse.json({ success: true, totalOutbound, totalInbound }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching call data:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch call data." },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
