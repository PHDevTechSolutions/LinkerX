import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Load database URL from environment variables
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Initialize Neon SQL client
const Xchire_sql = neon(Xchire_databaseUrl);

/**
 * GET /api/fetchNotes
 * Fetches all records from the `notes` table.
 */
export async function GET() {
    try {
        // Query to fetch all notes
        const Xchire_fetch = await Xchire_sql`SELECT * FROM notes;`;

        console.log("Fetched notes:", Xchire_fetch); // Debugging log

        return NextResponse.json({ success: true, data: Xchire_fetch }, { status: 200 });
    } catch (Xchire_error: any) {
        console.error("Error fetching notes:", Xchire_error);
        return NextResponse.json(
            {
                success: false,
                error: Xchire_error.message || "Failed to fetch notes."
            },
            { status: 500 }
        );
    }
}

// Force dynamic rendering for fresh data
export const dynamic = "force-dynamic";
