import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure database URL is defined
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Create a reusable Neon database connection function
const Xchire_sql = neon(Xchire_databaseUrl);

// Update multiple progress csrremarks
async function update(ids: string[], csrremarks: string) {
  try {
    if (!ids || ids.length === 0 || !csrremarks) {
      throw new Error("IDs and csrremarks are required.");
    }

    const Xchire_result = await Xchire_sql`
      UPDATE progress
      SET csrremarks = ${csrremarks}
      WHERE id = ANY(${ids})
      RETURNING *;
    `;

    if (Xchire_result.length === 0) {
      throw new Error("No records found to update.");
    }

    return { success: true, data: Xchire_result };
  } catch (Xchire_error: any) {
    console.error("Error updating progress csrremarks:", Xchire_error);
    return { success: false, error: Xchire_error.message || "Failed to update csrremarks." };
  }
}

// Handle PUT request
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { ids, csrremarks } = body;

    console.log("Received PUT request to update progress:", { ids, csrremarks });

    const Xchire_result = await update(ids, csrremarks);
    return NextResponse.json(Xchire_result);
  } catch (Xchire_error: any) {
    console.error("Error in PUT /api/ModuleCSR/Task/Progress/UpdateProgress:", Xchire_error);
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
