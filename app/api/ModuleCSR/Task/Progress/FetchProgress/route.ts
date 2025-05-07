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
    const userReferenceId = searchParams.get("referenceId");

    if (!userReferenceId) {
      return NextResponse.json(
        { success: false, error: "userReferenceId is required" },
        { status: 400 }
      );
    }

    // Query for CSR inquiries (without filtering by today's date)
    const Xchire_fetch = await Xchire_sql`
      SELECT 
        id, 
        date_created,
        activitystatus,
        csragent,
        companyname,
        ticketreferencenumber,
        typeactivity,
        typecall,
        remarks,
        csrremarks,
        referenceid
      FROM progress 
      WHERE csragent = ${userReferenceId};
    `;

    return NextResponse.json({ success: true, data: Xchire_fetch }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch inquiries." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"; // Keeps the response dynamic for real-time data
