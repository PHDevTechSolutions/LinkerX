import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure TASKFLOW_DB_URL is defined
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Create a Neon database connection
const Xchire_sql = neon(Xchire_databaseUrl);

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const referenceid = url.searchParams.get("referenceid");

    // Check if referenceid is provided
    if (!referenceid) {
      return NextResponse.json(
        { success: false, error: "ReferenceID is required." },
        { status: 400 }
      );
    }

    // Fetch companies based on referenceid
    const Xchire_fetch = await Xchire_sql`
      SELECT * FROM accounts WHERE referenceid = ${referenceid};
    `;

    console.log("Fetched accounts:", Xchire_fetch); // Debugging line

    return NextResponse.json({ success: true, data: Xchire_fetch }, { status: 200 });
  } catch (Xchire_error: any) {
    console.error("Error fetching accounts:", Xchire_error);
    return NextResponse.json(
      { success: false, error: Xchire_error.message || "Failed to fetch accounts." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
