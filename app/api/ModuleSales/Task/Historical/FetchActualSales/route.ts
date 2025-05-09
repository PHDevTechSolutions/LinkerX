import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Load database connection URL from environment variables
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Initialize Neon SQL client
const Xchire_sql = neon(Xchire_databaseUrl);

/**
 * GET /api/...
 * Fetches progress records from the database.
 * If a referenceid is provided in the query parameters, it filters the records accordingly.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const referenceid = searchParams.get("referenceid"); // Get referenceid from query params

    // Build SQL query string
    let Xchire_fetch = `SELECT * FROM progress`;
    if (referenceid) {
      Xchire_fetch += ` WHERE referenceid = '${referenceid}'`;
    }

    // Execute query using Neon
    const Xchire_accounts = await Xchire_sql(Xchire_fetch);

    console.log("Fetched accounts:", Xchire_accounts); // Debugging line

    return NextResponse.json({ success: true, data: Xchire_accounts }, { status: 200 });
  } catch (Xchire_error: any) {
    console.error("Error fetching accounts:", Xchire_error);
    return NextResponse.json(
      { success: false, error: Xchire_error.message || "Failed to fetch accounts." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch every time
