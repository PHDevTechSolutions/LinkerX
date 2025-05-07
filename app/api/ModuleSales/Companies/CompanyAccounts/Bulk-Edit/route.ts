import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Load and validate database URL
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Initialize Neon SQL client
const Xchire_sql = neon(Xchire_databaseUrl);

/**
 * Bulk update user status in the accounts table
 */
async function bulkupdate(userIds: string[], status: string) {
    try {
        if (!userIds || userIds.length === 0 || !status) {
            throw new Error("User IDs and status are required.");
        }

        const Xchire_result = await Xchire_sql`
            UPDATE accounts
            SET status = ${status},
                date_updated = CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'
            WHERE id = ANY(${userIds})
            RETURNING *;
        `;

        return { success: true, data: Xchire_result };
    } catch (Xchire_error: any) {
        console.error("Error updating users:", Xchire_error);
        return { success: false, error: Xchire_error.message || "Failed to update users." };
    }
}

/**
 * PUT /api/ModuleSales/UserManagement/CompanyAccounts/Bulk-Edit
 */
export async function PUT(req: Request) {
    try {
        const { userIds, status } = await req.json();

        const Xchire_result = await bulkupdate(userIds, status);

        return NextResponse.json(Xchire_result);
    } catch (Xchire_error: any) {
        console.error("Error in PUT /api/ModuleSales/UserManagement/CompanyAccounts/Bulk-Edit:", Xchire_error);
        return NextResponse.json(
            { success: false, error: Xchire_error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
