import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure DATABASE_URL is set
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

// Create Neon database connection
const sql = neon(databaseUrl);

// Handle POST request to update company status
export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Request body:", body); // Log to check incoming data

        const { id, status } = body;
        console.log("Received request to update company status:", { id, status });

        // Update the company status in `daily_activity` table using `id`
        const result = await sql`
            UPDATE accounts
            SET status = ${status}
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


// Force dynamic data fetch to avoid caching
export const dynamic = "force-dynamic";
