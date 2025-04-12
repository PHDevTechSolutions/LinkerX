import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.TASKFLOW_DB_URL;
if (!databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

async function requestDeletion(id: string, remarks: string) {
    try {
        if (!id || !remarks) {
            throw new Error("User ID and remarks are required.");
        }

        console.log("Processing deletion request for ID:", id);

        const result = await sql`
            UPDATE accounts
            SET status = 'Subject for Deletion', remarks = ${remarks}
            WHERE id = ${id}
            RETURNING *;
        `;

        if (result.length === 0) {
            throw new Error("No account found with the provided User ID.");
        }

        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error updating account for deletion request:", error);
        return { success: false, error: error.message || "Failed to request deletion." };
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, remarks } = body;

        if (!id || !remarks) {
            return NextResponse.json(
                { success: false, error: "User ID and remarks are required." },
                { status: 400 }
            );
        }

        const result = await requestDeletion(id, remarks);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in PUT /api/ModuleSales/Companies/CompanyAccounts/RequestDeletion:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
