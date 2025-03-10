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
        const referenceID = url.searchParams.get("referenceID");

        if (!referenceID) {
            return NextResponse.json(
                { success: false, error: "Missing reference ID." },
                { status: 400 }
            );
        }

        // Fetch activity data filtered by referenceID
        const activityData = await sql`
            SELECT * FROM progress WHERE "referenceid" = ${referenceID};
        `;

        console.log("Fetched activity data:", activityData); // Debugging line

        return NextResponse.json({ success: true, data: activityData }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching activity data:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch activity data." },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
