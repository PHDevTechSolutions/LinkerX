import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

async function bulktransfer(userIds: string[], tsmReferenceID: string) {
    try {
        if (!userIds || userIds.length === 0 || !tsmReferenceID) {
            throw new Error("User IDs and TSM Reference ID are required.");
        }

        const Xchire_update = await Xchire_sql`
            UPDATE accounts
            SET tsm = ${tsmReferenceID}
            WHERE id = ANY(${userIds})
            RETURNING *;
        `;

        return { success: true, data: Xchire_update };
    } catch (Xchire_error: any) {
        console.error("Error updating users:", Xchire_error);
        return { success: false, error: Xchire_error.message || "Failed to update users." };
    }
}

export async function PUT(req: Request) {
    try {
        const Xchire_body = await req.json();
        const { userIds, tsmReferenceID } = Xchire_body;

        const Xchire_result = await bulktransfer(userIds, tsmReferenceID);

        return NextResponse.json(Xchire_result);
    } catch (Xchire_error: any) {
        console.error("Error in PUT /api/ModuleSales/UserManagement/CompanyAccounts/Bulk-Transfer:", Xchire_error);
        return NextResponse.json(
            { success: false, error: Xchire_error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
