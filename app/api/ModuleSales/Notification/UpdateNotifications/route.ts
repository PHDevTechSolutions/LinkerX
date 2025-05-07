// app/api/ModuleSales/Notification/UpdateNotifications.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure TASKFLOW_DB_URL is set
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// ✅ Create Neon database connection
const Xchire_sql = neon(Xchire_databaseUrl);

// ✅ Handle PUT request to update notification status
export async function PUT(req: Request) {
  try {
    // ✅ Log incoming request data
    const Xchire_body = await req.json();
    console.log("Received request body:", Xchire_body);

    const { notifId, status } = Xchire_body;

    // Check for valid values
    if (!notifId) {
      console.error("Missing notifId.");
      return NextResponse.json(
        { success: false, message: "notifId is required." },
        { status: 400 }
      );
    }

    // Set default status if missing
    const updatedStatus = status || "Read";

    // Update notification status in the database
    const Xchire_update = await Xchire_sql`
      UPDATE notification
      SET status = ${updatedStatus}
      WHERE id = ${notifId}
      RETURNING *;
    `;

    if (Xchire_update.length === 0) {
      return NextResponse.json(
        { success: false, message: "Notification not found or already updated." },
        { status: 404 }
      );
    }

    console.log("Notification updated successfully:", Xchire_update[0]);

    // Return success with updated notification
    return NextResponse.json(
      { success: true, message: "Notification marked as read", data: Xchire_update[0] },
      { status: 200 }
    );
  } catch (Xchire_error: any) {
    console.error("Error updating notification status:", Xchire_error);
    return NextResponse.json(
      { success: false, error: Xchire_error.message || "Failed to update notification." },
      { status: 500 }
    );
  }
}

// ✅ Force dynamic to ensure fresh data
export const dynamic = "force-dynamic";
