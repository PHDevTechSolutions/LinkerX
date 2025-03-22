import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure DATABASE_URL is set
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

// Create Neon database connection
const sql = neon(databaseUrl);

// Handle POST request to save assigned companies
export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Request body:", body); // Log to check incoming data

        const { companies, remainingBalance } = body;

        if (!Array.isArray(companies) || typeof remainingBalance !== "number") {
            throw new Error("Invalid input data.");
        }

        // Insert assigned companies data into `assigned_companies` table
        const result = await sql`
            INSERT INTO assigned_companies (company_data, remaining_balance, date_created)
            VALUES (
                ${JSON.stringify(companies)}, 
                ${remainingBalance}, 
                CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'
            )
            RETURNING *;
        `;

        if (result.length === 0) {
            throw new Error("No rows were inserted. Please check the input data.");
        }

        return NextResponse.json(
            {
                success: true,
                message: "Assigned companies saved successfully.",
                data: result[0],
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error saving assigned companies:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to save assigned companies.",
            },
            { status: 500 }
        );
    }
}

// Force dynamic data fetch to avoid caching
export const dynamic = "force-dynamic";
