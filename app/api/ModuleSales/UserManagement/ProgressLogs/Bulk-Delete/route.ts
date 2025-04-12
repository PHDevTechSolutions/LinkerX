import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.TASKFLOW_DB_URL;
if (!databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

async function deleteUsers(userIds: string[]) {
    try {
        if (!userIds || userIds.length === 0) {
            throw new Error("No user IDs provided.");
        }

        const result = await sql`
            DELETE FROM progress 
            WHERE id = ANY(${userIds})
            RETURNING *;
        `;

        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error deleting users:", error);
        return { success: false, error: error.message || "Failed to delete users." };
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { userIds } = body;

        const result = await deleteUsers(userIds);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in DELETE /api/bulk-delete:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
