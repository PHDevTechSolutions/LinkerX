import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Get database URL from environment variable
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

// Update multiple emails
async function updateMultipleEmails(ids: string[], status: string) {
  try {
    if (!ids || ids.length === 0 || !status) {
      throw new Error("Email IDs and status are required.");
    }

    const Xchire_update = await Xchire_sql`
      UPDATE email
      SET
        status = ${status},
        date_updated = NOW()
      WHERE id = ANY(${ids})
      RETURNING *;
    `;

    return { success: true, data: Xchire_update };
  } catch (Xchire_error: any) {
    console.error("Error updating emails:", Xchire_error);
    return { success: false, error: Xchire_error.message || "Failed to update email statuses." };
  }
}

// Handle PUT request
export async function PUT(req: Request) {
  try {
    const Xchire_body = await req.json();
    const { ids, status } = Xchire_body;

    const Xchire_result = await updateMultipleEmails(ids, status);
    return NextResponse.json(Xchire_result);
  } catch (Xchire_error: any) {
    console.error("Error in PUT /api/ModuleSales/Email/UpdateStatus:", Xchire_error);
    return NextResponse.json(
      { success: false, error: Xchire_error.message || "Internal Server Error" },
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
