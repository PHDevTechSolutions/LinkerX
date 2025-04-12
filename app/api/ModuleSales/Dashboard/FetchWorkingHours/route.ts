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

        const accounts = await sql`
            SELECT startdate, enddate 
            FROM progress 
            WHERE referenceid = ${referenceID}; 
        `;

        let totalHours = 0;
        const today = new Date().toISOString().split("T")[0]; // Get current date (YYYY-MM-DD)

        accounts.forEach((entry: any) => {
            const start = new Date(entry.startdate);
            const end = new Date(entry.enddate);

            // Check if the work was done today
            if (start.toISOString().split("T")[0] === today) {
                const hoursWorked = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                totalHours += hoursWorked;
            }
        });

        return NextResponse.json({ success: true, totalHours }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch accounts." },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
