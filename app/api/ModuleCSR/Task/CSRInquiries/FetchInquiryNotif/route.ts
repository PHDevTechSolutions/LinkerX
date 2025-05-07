import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure TASKFLOW_DB_URL is defined
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Create a reusable Neon database connection function
const Xchire_sql = neon(Xchire_databaseUrl);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const csrAgent = searchParams.get("referenceId");

    if (!csrAgent) {
      return NextResponse.json(
        { success: false, error: "csragent is required" },
        { status: 400 }
      );
    }

    // Query for inquiries where csrAgent matches
    const Xchire_inquiries = await Xchire_sql`
      SELECT 
        salesagentname,
        date_created,
        status,
        csragent,
        companyname,
        ticketreferencenumber
      FROM inquiries 
      WHERE csragent = ${csrAgent};
    `;

    return NextResponse.json({ success: true, data: Xchire_inquiries }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch inquiries." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
