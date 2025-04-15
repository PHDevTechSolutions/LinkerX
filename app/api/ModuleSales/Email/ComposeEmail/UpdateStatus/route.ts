import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Get database URL from environment variable
const databaseUrl = process.env.TASKFLOW_DB_URL;
if (!databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

// Update multiple emails
async function updateMultipleEmails(ids: string[], status: string) {
  try {
    if (!ids || ids.length === 0 || !status) {
      throw new Error("Email IDs and status are required.");
    }

    const result = await sql`
      UPDATE email
      SET
        status = ${status},
        date_updated = NOW()
      WHERE id = ANY(${ids})
      RETURNING *;
    `;

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error updating emails:", error);
    return { success: false, error: error.message || "Failed to update email statuses." };
  }
}

// Handle PUT request
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { ids, status } = body;

    const result = await updateMultipleEmails(ids, status);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in PUT /api/ModuleSales/Email/UpdateStatus:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Reject unsupported methods
export function GET() {
  return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
}

export function POST() {
  return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
}
