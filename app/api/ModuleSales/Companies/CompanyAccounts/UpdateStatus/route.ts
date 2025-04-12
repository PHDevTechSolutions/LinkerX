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
async function updateUserStatus(
    userId: string,
    status: string
) {
    try {
        if (!userId || !status) {
            throw new Error("User ID and status are required.");
        }

        // Update the user status in the database and return the updated record
        const result = await sql`
            UPDATE accounts 
            SET 
                status = ${status}
            WHERE id = ${userId} 
            RETURNING *;
        `;

        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error updating user status:", error);
        return { success: false, error: error.message || "Failed to update user status." };
    }
}

// POST route to handle user status updates
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, status } = body;

        // Call the updateUserStatus function to update the status
        const result = await updateUserStatus(userId, status);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in POST /api/edituser:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
