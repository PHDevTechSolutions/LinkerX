// route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure DATABASE_URL is defined
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

// Create a reusable Neon database connection function
const sql = neon(databaseUrl);

async function addUser(CompanyName: string, ContactPerson: string) {
    try {
        if (!CompanyName || !ContactPerson) {
            throw new Error("Title and description are required.");
        }

        const result = await sql`
            INSERT INTO accounts (CompanyName, ContactPerson) 
            VALUES (${CompanyName}, ${ContactPerson}) 
            RETURNING *;
        `;

        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error inserting task:", error);
        return { success: false, error: error.message || "Failed to add task." };
    }
}

export async function POST(req: Request) {
    try {
        // Ensure request body is valid JSON
        const body = await req.json();
        const { UserId, CompanyName, ContactPerson } = body;

        // Validate input
        if (!CompanyName || !ContactPerson) {
            return NextResponse.json(
                { success: false, error: "Title and description are required." },
                { status: 400 }
            );
        }

        // Call the addUser function
        const result = await addUser(CompanyName, ContactPerson);

        // Return response
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in POST /api/addTask:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
