import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

/**
 * Deletes an activity from the database.
 * @param userid - The ID of the activity to delete.
 * @returns Success or error response.
 */
async function remove(userid: string) {
    try {
        if (!userid) {
            throw new Error("Activity ID is required.");
        }

        const Xchire_delete = await Xchire_sql`
            DELETE FROM tutorials 
            WHERE id = ${userid}
            RETURNING *;
        `;

        if (Xchire_delete.length === 0) {
            return { success: false, error: "Activity not found or already deleted." };
        }

        return { success: true, data: Xchire_delete };
    } catch (error: any) {
        console.error("Error deleting activity:", error);
        return { success: false, error: error.message || "Failed to delete activity." };
    }
}

export async function DELETE(req: Request) {
    try {
        const Xchire_body = await req.json();
        const { id } = Xchire_body; // Ensure frontend sends `{ id: "activity_id" }`

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Missing activity ID." },
                { status: 400 }
            );
        }

        const Xchire_result = await remove(id);

        return NextResponse.json(Xchire_result);
    } catch (error: any) {
        console.error("Error in DELETE /api/ModuleSales/Task/DailyActivity/DeleteActivity:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
