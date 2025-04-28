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
    const userReferenceId = searchParams.get("referenceId");

    if (!userReferenceId) {
      return NextResponse.json(
        { success: false, error: "userReferenceId is required" },
        { status: 400 }
      );
    }

    // Query for CSR inquiries (without filtering by today's date)
    const inquiries = await sql`
      SELECT 
        id, 
        date_created,
        activitystatus,
        csragent,
        companyname,
        ticketreferencenumber,
        typeactivity,
        typecall,
        remarks
      FROM progress 
      WHERE csragent = ${userReferenceId};
    `;

    return NextResponse.json({ success: true, data: inquiries }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch inquiries." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"; // Keeps the response dynamic for real-time data
