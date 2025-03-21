import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

export async function POST(req: Request) {
    try {
        // Parse request body to extract companyId and new status
        const { companyId, status } = await req.json();
        console.log("Received request to update company status:", { companyId, status });

        // Update the company status in the database using `id` (companyId)
        const result = await sql`
            UPDATE accounts
            SET status = ${status}
            WHERE id = ${companyId}
            RETURNING *;
        `;

        if (result.length === 0) {
            throw new Error("No rows were updated. Please check the companyId.");
        }

        return NextResponse.json({ success: true, message: "Company status updated successfully", data: result[0] }, { status: 200 });
    } catch (error: any) {
        console.error("Error updating company status:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to update company status." },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
