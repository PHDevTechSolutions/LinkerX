import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

export async function POST(req: Request) {
    try {
        // Parse request body to extract the company details and new status
        const { companyname, status } = await req.json();

        // Update the company status in the database
        const result = await sql`
            UPDATE accounts
            SET status = ${status}
            WHERE companyname = ${companyname}
            RETURNING *;
        `;

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
