import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

export async function GET(req: Request) {
    try {
        // Fetch all company data from progress table
        const companies = await sql`SELECT * FROM progress;`;

        console.log("Fetched companies:", companies); // Debugging line

        return NextResponse.json({ success: true, data: companies }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching companies:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch companies." },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
