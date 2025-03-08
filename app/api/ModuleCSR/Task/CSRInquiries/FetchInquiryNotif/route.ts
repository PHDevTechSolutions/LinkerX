import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const csrAgent = searchParams.get("referenceId"); // Use 'referenceId' for PostgreSQL query.

    if (!csrAgent) {
      return NextResponse.json({ success: false, error: "csragent is required" }, { status: 400 });
    }

    const inquiries = await sql`
      SELECT * 
      FROM inquiries 
      WHERE csragent = ${csrAgent};
    `;

    console.log("Fetched inquiries:", inquiries); // Debugging line

    return NextResponse.json({ success: true, data: inquiries }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch inquiries." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
