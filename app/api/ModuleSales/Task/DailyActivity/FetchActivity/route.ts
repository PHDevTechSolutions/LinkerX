import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

export async function GET(req: Request) {
    try {
        // Extract query parameters from the request URL
        const url = new URL(req.url);
        const activitynumber = url.searchParams.get("activitynumber");

        if (!activitynumber) {
            return NextResponse.json(
                { success: false, error: "Missing activity number." },
                { status: 400 }
            );
        }

        // Fetch progress data filtered by activitynumber
        const progressData = await sql`
            SELECT * FROM progress WHERE activitynumber = ${activitynumber};
        `;

        console.log("Fetched progress data:", progressData); // Debugging line

        return NextResponse.json({ success: true, data: progressData }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching progress data:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch progress data." },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
