import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

export async function PUT(req: Request) {
  try {
    const { notifIds } = await req.json();

    if (!Array.isArray(notifIds) || notifIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "notifIds is required and must be a non-empty array." },
        { status: 400 }
      );
    }

    const Xchire_update = await Xchire_sql`
      UPDATE notification
      SET status = 'Read'
      WHERE id = ANY(${notifIds})
      RETURNING *;
    `;

    if (Xchire_update.length === 0) {
      return NextResponse.json(
        { success: false, message: "No notifications found or updated." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "All notifications marked as read", data: Xchire_update },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update notifications." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
