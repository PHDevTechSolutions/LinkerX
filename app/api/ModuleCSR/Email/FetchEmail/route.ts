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
    const userEmail = searchParams.get("recepient"); // Use 'referenceId' for PostgreSQL query.

    if (!userEmail) {
      return NextResponse.json({ success: false, error: "'referenceId' and 'userEmail' are required" }, { status: 400 });
    }

    // Modified query: Remove 'sender' condition and only match 'recipient'
    const inquiries = await sql`
      SELECT * 
      FROM email 
      WHERE recepient = ${userEmail} 
    `;

    return NextResponse.json({ success: true, data: inquiries }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch email." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
