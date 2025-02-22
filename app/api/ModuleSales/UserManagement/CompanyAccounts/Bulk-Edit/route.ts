import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

async function bulkEditUsers(userIds: string[], typeclient: string) {
    try {
        if (!userIds || userIds.length === 0 || !typeclient) {
            throw new Error("User IDs and typeclient are required.");
        }

        const result = await sql`
            UPDATE accounts
            SET typeclient = ${typeclient}
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
        const { userIds, typeclient } = body;

        const result = await bulkEditUsers(userIds, typeclient);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in PUT /api/ModuleSales/UserManagement/CompanyAccounts/Bulk-Edit:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
