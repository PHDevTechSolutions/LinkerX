// API route for fetching email inquiries
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure TASKFLOW_DB_URL is set in environment variables
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Create a reusable Neon database connection function
const Xchire_sql = neon(Xchire_databaseUrl);

// Handle GET request to fetch email inquiries based on recipient
export async function GET(Xchire_req: Request) {
  try {
    const { searchParams } = new URL(Xchire_req.url);
    const userEmail = searchParams.get("recepient"); // Use 'recepient' for query

    // Validate that 'recepient' email is provided
    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "'recepient' is required" },
        { status: 400 }
      );
    }

    // Query the database to fetch emails for the given recipient
    const Xchire_inquiries = await Xchire_sql`
      SELECT * 
      FROM email 
      WHERE recepient = ${userEmail}
    `;

    // Return success response with fetched email data
    return NextResponse.json({ success: true, data: Xchire_inquiries }, { status: 200 });
  } catch (Xchire_error: any) {
    // Enhanced error logging
    console.error("Error fetching inquiries:", Xchire_error);
    return NextResponse.json(
      { success: false, error: Xchire_error.message || "Failed to fetch email." },
      { status: 500 }
    );
  }
}

// Force dynamic data fetching
export const dynamic = "force-dynamic";
