import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.TASKFLOW_DB_URL;
if (!databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

// Update multiple progress csrremarks
async function updateMultipleProgress(ids: string[], csrremarks: string) {
  try {
    if (!ids || ids.length === 0 || !csrremarks) {
      throw new Error("IDs and csrremarks are required.");
    }

    const result = await sql`
      UPDATE progress
      SET csrremarks = ${csrremarks}
      WHERE id = ANY(${ids})
      RETURNING *;
    `;

    if (result.length === 0) {
      throw new Error("No records found to update.");
    }

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error updating progress csrremarks:", error);
    return { success: false, error: error.message || "Failed to update csrremarks." };
  }
}

// Handle PUT request
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { ids, csrremarks } = body;

    console.log("Received PUT request to update progress:", { ids, csrremarks });

    const result = await updateMultipleProgress(ids, csrremarks);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in PUT /api/ModuleCSR/Task/Progress/UpdateProgress:", error);
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
