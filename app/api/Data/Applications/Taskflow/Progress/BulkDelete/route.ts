import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

async function remove(userIds: string[]) {
    try {
        if (!userIds || userIds.length === 0) {
            throw new Error("No user IDs provided.");
        }

        const Xchire_delete = await Xchire_sql`
            DELETE FROM progress 
            WHERE id = ANY(${userIds})
            RETURNING *;
        `;

        return { success: true, data: Xchire_delete };
    } catch (error: any) {
        console.error("Error deleting users:", error);
        return { success: false, error: error.message || "Failed to delete users." };
    }
}

export async function DELETE(req: Request) {
    try {
        const Xchire_body = await req.json();
        const { userIds } = Xchire_body;

        const Xchire_result = await remove(userIds);

        return NextResponse.json(Xchire_result);
    } catch (error: any) {
        console.error("Error in DELETE /api/bulk-delete:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
