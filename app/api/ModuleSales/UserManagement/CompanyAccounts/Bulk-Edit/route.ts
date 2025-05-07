import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

async function bulkupdate(userIds: string[], typeclient: string) {
    try {
        if (!userIds || userIds.length === 0 || !typeclient) {
            throw new Error("User IDs and typeclient are required.");
        }

        const Xchire_update = await Xchire_sql`
            UPDATE accounts
            SET 
                typeclient = ${typeclient},
                date_updated = CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'
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
        const { userIds, typeclient } = Xchire_body;

        const Xchire_result = await bulkupdate(userIds, typeclient);

        return NextResponse.json(Xchire_result);
    } catch (Xchire_error: any) {
        console.error("Error in PUT /api/ModuleSales/UserManagement/CompanyAccounts/Bulk-Edit:", Xchire_error);
        return NextResponse.json(
            { success: false, error: Xchire_error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
