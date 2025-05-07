import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("recepient"); // Use 'referenceId' for PostgreSQL query.

    if (!userEmail) {
      return NextResponse.json({ success: false, error: "'referenceId' and 'userEmail' are required" }, { status: 400 });
    }

    // Modified query: Remove 'sender' condition and only match 'recipient'
    const Xchire_fetch = await Xchire_sql`
      SELECT * 
      FROM email 
      WHERE recepient = ${userEmail} 
    `;

    return NextResponse.json({ success: true, data: Xchire_fetch }, { status: 200 });
  } catch (Xchire_error: any) {
    console.error("Error fetching inquiries:", Xchire_error);
    return NextResponse.json(
      { success: false, error: Xchire_error.message || "Failed to fetch email." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
