import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure the database URL is set in environment variables
const databaseUrl = process.env.TASKFLOW_DB_URL;
if (!databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Initialize the neon database client
const sql = neon(databaseUrl);

// Function to update the user status in the database
async function updateUserStatus(id: string, status: string) {
  try {
    if (!id || !status) {
      throw new Error("User ID and status are required.");
    }

    // Update the user status in the database and return the updated record
    const result = await sql`
            UPDATE accounts 
            SET 
                status = ${status}
            WHERE id = ${id} 
            RETURNING *;
        `;

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error updating user status:", error);
    return { success: false, error: error.message || "Failed to update user status." };
  }
}

// PUT route to handle user status updates
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body; // Changed to id

    // Call the updateUserStatus function to update the status
    const result = await updateUserStatus(id, status);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in PUT /api/UpdateApproveStatus:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
