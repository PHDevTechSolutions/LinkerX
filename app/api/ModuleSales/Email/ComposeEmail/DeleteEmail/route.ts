import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

/**
 * Deletes an activity from the database.
 * @param emailId - The ID of the activity to delete.
 * @returns Success or error response.
 */
async function remove(emailId: string) {
    try {
        if (!emailId) {
            throw new Error("Activity ID is required.");
        }

        const Xchire_delete = await Xchire_sql`
            DELETE FROM email 
            WHERE id = ${emailId}
            RETURNING *;
        `;

        if (Xchire_delete.length === 0) {
            return { success: false, error: "Email not found or already deleted." };
        }

        return { success: true, data: Xchire_delete };
    } catch (Xchire_error: any) {
        console.error("Error deleting activity:", Xchire_error);
        return { success: false, error: Xchire_error.message || "Failed to delete activity." };
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
    } catch (Xchire_error: any) {
        console.error("Error in DELETE /api/ModuleSales/Email/ComposeEmail/DeleteEmail:", Xchire_error);
        return NextResponse.json(
            { success: false, error: Xchire_error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
