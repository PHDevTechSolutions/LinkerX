import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

/**
 * Deletes an activity from the database.
 * @param progressId - The ID of the activity to delete.
 * @returns Success or error response.
 */
async function deleteActivity(progressId: string) {
    try {
        if (!progressId) {
            throw new Error("Activity ID is required.");
        }

        const result = await sql`
            DELETE FROM progress 
            WHERE id = ${progressId}
            RETURNING *;
        `;

        if (result.length === 0) {
            return { success: false, error: "Activity not found or already deleted." };
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
        console.error("Error in DELETE /api/ModuleSales/Task/DailyActivity/DeleteActivity:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
