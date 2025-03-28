// ✅ app/api/ModuleSales/Notification/UpdateNotifications.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// ✅ Ensure DATABASE_URL is set
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in the environment variables.");
}

// ✅ Create Neon database connection
const sql = neon(databaseUrl);

// ✅ Handle PUT request to update notification status
export async function PUT(req: Request) {
  try {
    // ✅ Log incoming request data
    const requestBody = await req.json();
    console.log("✅ Received request body:", requestBody);

    const { notifId, status } = requestBody;

    // ✅ Check for valid values
    if (!notifId) {
      console.error("❌ Missing notifId.");
      return NextResponse.json(
        { success: false, message: "notifId is required." },
        { status: 400 }
      );
    }

    // ✅ Set default status if missing
    const updatedStatus = status || "Read";

    // ✅ Update notification status in the database
    const result = await sql`
      UPDATE notification
      SET status = ${updatedStatus}
      WHERE id = ${notifId}
      RETURNING *;
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Notification not found or already updated." },
        { status: 404 }
      );
    }

    console.log("✅ Notification updated successfully:", result[0]);

    // ✅ Return success with updated notification
    return NextResponse.json(
      { success: true, message: "Notification marked as read", data: result[0] },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error updating notification status:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update notification." },
      { status: 500 }
    );
  }
}

// ✅ Force dynamic to ensure fresh data
export const dynamic = "force-dynamic";
