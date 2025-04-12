import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.TASKFLOW_DB_URL;
if (!databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

async function bulkTransferUsers(userIds: string[], tsmReferenceID: string) {
    try {
        if (!userIds || userIds.length === 0 || !tsmReferenceID) {
            throw new Error("User IDs and TSM Reference ID are required.");
        }

        const result = await sql`
            UPDATE accounts
            SET tsm = ${tsmReferenceID}
            WHERE id = ANY(${userIds})
            RETURNING *;
        `;

        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error updating users:", error);
        return { success: false, error: error.message || "Failed to update users." };
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { userIds, tsmReferenceID } = body;

        const result = await bulkTransferUsers(userIds, tsmReferenceID);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in PUT /api/ModuleSales/UserManagement/CompanyAccounts/Bulk-Transfer:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
