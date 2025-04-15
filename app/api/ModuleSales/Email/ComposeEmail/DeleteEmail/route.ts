import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.TASKFLOW_DB_URL;
if (!databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

/**
 * Deletes an activity from the database.
 * @param emailId - The ID of the activity to delete.
 * @returns Success or error response.
 */
async function deleteActivity(emailId: string) {
    try {
        if (!emailId) {
            throw new Error("Activity ID is required.");
        }

        const result = await sql`
            DELETE FROM email 
            WHERE id = ${emailId}
            RETURNING *;
        `;

        if (result.length === 0) {
            return { success: false, error: "Email not found or already deleted." };
        }

        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error deleting activity:", error);
        return { success: false, error: error.message || "Failed to delete activity." };
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { id } = body; // Ensure frontend sends `{ id: "activity_id" }`

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Missing activity ID." },
                { status: 400 }
            );
        }

        const result = await deleteActivity(id);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in DELETE /api/ModuleSales/Email/ComposeEmail/DeleteEmail:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
