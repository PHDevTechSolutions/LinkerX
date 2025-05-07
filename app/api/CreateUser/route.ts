// API route for adding a user account
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Get the database URL from environment variables and check if it's defined
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Create a reusable Neon database connection
const Xchire_sql = neon(Xchire_databaseUrl);

// Function to add a new user/company account to the database
async function create(CompanyName: string, ContactPerson: string) {
    try {
        if (!CompanyName || !ContactPerson) {
            throw new Error("CompanyName and ContactPerson are required.");
        }

        const Xchire_insert = await Xchire_sql`
            INSERT INTO accounts (CompanyName, ContactPerson) 
            VALUES (${CompanyName}, ${ContactPerson}) 
            RETURNING *;
        `;

        return { success: true, data: Xchire_insert };
    } catch (Xchire_error: any) {
        console.error("Error inserting account:", Xchire_error);
        return {
            success: false,
            error: Xchire_error.message || "Failed to add account.",
        };
    }
}

// Handle POST request to create a new account
export async function POST(Xchire_req: Request) {
    try {
        const Xchire_body = await Xchire_req.json();
        const {
            UserId: UserId,
            CompanyName: CompanyName,
            ContactPerson: ContactPerson,
        } = Xchire_body;

        if (!CompanyName || !ContactPerson) {
            return NextResponse.json(
                {
                    success: false,
                    error: "CompanyName and ContactPerson are required.",
                },
                { status: 400 }
            );
        }

        const Xchire_result = await create(CompanyName, ContactPerson);

        return NextResponse.json(Xchire_result);
    } catch (Xchire_error: any) {
        console.error("Error in POST /api/addAccount:", Xchire_error);
        return NextResponse.json(
            { success: false, error: Xchire_error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
