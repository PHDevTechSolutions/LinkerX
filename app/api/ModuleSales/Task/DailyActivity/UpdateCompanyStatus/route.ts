import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.TASKFLOW_DB_URL;
if (!databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Request body:", body);

        const { id, status } = body;
        if (!id || !status) {
            throw new Error("Missing 'id' or 'status' in the request body.");
        }

        const result = await sql`
            UPDATE accounts
            SET 
                status = ${status},
                date_updated = CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'
            WHERE id = ${id}
            RETURNING *;
        `;

        if (result.length === 0) {
            throw new Error("No rows were updated. Please check the company ID.");
        }

        return NextResponse.json(
            {
                success: true,
                message: "Company status updated successfully",
                data: result[0],
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error updating company status:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to update company status.",
            },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
