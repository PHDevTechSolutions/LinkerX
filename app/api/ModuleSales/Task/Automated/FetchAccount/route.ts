import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure DATABASE_URL is defined
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in the environment variables.");
}

// Create a Neon database connection
const sql = neon(databaseUrl);

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
    const accounts = await sql`
      SELECT * FROM accounts WHERE referenceid = ${referenceid};
    `;

    console.log("Fetched accounts:", accounts); // Debugging line

    return NextResponse.json({ success: true, data: accounts }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch accounts." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
