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

    // Fetch accounts where referenceid matches and status is 'For Deletion' OR 'Remove'
    const progressData = await sql`
      SELECT *
      FROM accounts
      WHERE referenceid = ${referenceId}
      AND (status = 'For Deletion' OR status = 'Remove');
    `;

    console.log("Fetched Accounts (For Deletion or Remove):", progressData);

    return NextResponse.json({ success: true, data: progressData }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch accounts." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
