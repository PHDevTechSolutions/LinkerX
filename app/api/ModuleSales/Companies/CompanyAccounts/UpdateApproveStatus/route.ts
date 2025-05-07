import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure the database URL is set in environment variables
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Initialize the neon database client
const Xchire_sql = neon(Xchire_databaseUrl);

// Function to update the user status in the database
async function update(id: string, status: string) {
  try {
    if (!id || !status) {
      throw new Error("User ID and status are required.");
    }

    // Update the user status in the database and return the updated record
    const Xchire_update = await Xchire_sql`
            UPDATE accounts 
            SET 
                status = ${status}
            WHERE id = ${id} 
            RETURNING *;
        `;

    return { success: true, data: Xchire_update };
  } catch (Xchire_error: any) {
    console.error("Xchire error updating user status:", Xchire_error);
    return { success: false, error: Xchire_error.message || "Failed to update user status." };
  }
}

// PUT route to handle user status updates
export async function PUT(req: Request) {
  try {
    const Xchire_body = await req.json();
    const { id, status } = Xchire_body; // Changed to Xchire_id and Xchire_status

    // Call the Xchire_updateUserStatus function to update the status
    const Xchire_update = await update(id, status);

    return NextResponse.json(Xchire_update);
  } catch (Xchire_error: any) {
    console.error("Xchire error in PUT /api/UpdateApproveStatus:", Xchire_error);
    return NextResponse.json(
      { success: false, error: Xchire_error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
