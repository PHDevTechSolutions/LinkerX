import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure TASKFLOW_DB_URL is set
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Create Neon database connection
const Xchire_sql = neon(Xchire_databaseUrl);

// Handle POST request to save assigned companies
export async function POST(req: Request) {
    try {
        const Xchire_body = await req.json();
        console.log("Request body:", Xchire_body); // Log to check incoming data

        const { companies, remainingBalance } = Xchire_body;

        if (!Array.isArray(companies) || typeof remainingBalance !== "number") {
            throw new Error("Invalid input data.");
        }

        // Insert assigned companies data into `assigned_companies` table
        const Xchire_insert = await Xchire_sql`
            INSERT INTO assigned_companies (company_data, remaining_balance, date_created)
            VALUES (
                ${JSON.stringify(companies)}, 
                ${remainingBalance}, 
                CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'
            )
            RETURNING *;
        `;

        if (Xchire_insert.length === 0) {
            throw new Error("No rows were inserted. Please check the input data.");
        }

        return NextResponse.json(
            {
                success: true,
                message: "Assigned companies saved successfully.",
                data: Xchire_insert[0],
            },
            { status: 200 }
        );
    } catch (Xchire_error: any) {
        console.error("Error saving assigned companies:", Xchire_error);
        return NextResponse.json(
            {
                success: false,
                error: Xchire_error.message || "Failed to save assigned companies.",
            },
            { status: 500 }
        );
    }
}

// Force dynamic data fetch to avoid caching
export const dynamic = "force-dynamic";
