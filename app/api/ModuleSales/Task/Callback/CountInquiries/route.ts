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
    const referenceId = searchParams.get("referenceId");

    if (!referenceId) {
      return NextResponse.json({ success: false, error: "ReferenceID is required" }, { status: 400 });
    }

    // Fetch notifications where referenceid matches and status = 'pending' and type = 'Inquiry Notification'
    const progressData = await sql`
      SELECT callback, message, type, date_created, tsm, referenceid, csragent, status, id
      FROM notification
      WHERE referenceid = ${referenceId}
      AND status = 'pending'
      AND type = 'Inquiry Notification';
    `;

    console.log("Fetched Notifications:", progressData); // Log to check if data is being fetched

    return NextResponse.json({ success: true, data: progressData }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch notifications." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
