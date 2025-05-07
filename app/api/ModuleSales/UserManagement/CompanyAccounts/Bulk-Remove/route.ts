import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

// ✅ Added remarks parameter in the bulkEditUsers function
async function bulkremove(userIds: string[], status: string, remarks: string) {
    try {
        if (!userIds || userIds.length === 0 || !status || !remarks) {
            throw new Error("User IDs, status, and remarks are required.");
        }

        const Xchire_update = await Xchire_sql`
            UPDATE accounts
            SET status = ${status}, remarks = ${remarks}
            WHERE id = ANY(${userIds})
            RETURNING *;
        `;

        return { success: true, data: Xchire_update };
    } catch (error: any) {
        console.error("Error updating users:", error);
        return { success: false, error: error.message || "Failed to update users." };
    }
}

export async function PUT(req: Request) {
    try {
        const Xchire_body = await req.json();
        const { userIds, status, remarks } = Xchire_body; // ✅ Added remarks from the request body

        // ✅ Pass remarks to the bulkEditUsers function
        const Xchire_result = await bulkremove(userIds, status, remarks);

        return NextResponse.json(Xchire_result);
    } catch (Xchire_error: any) {
        console.error("Error in PUT /api/ModuleSales/UserManagement/CompanyAccounts/Bulk-Edit:", Xchire_error);
        return NextResponse.json(
            { success: false, error: Xchire_error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
