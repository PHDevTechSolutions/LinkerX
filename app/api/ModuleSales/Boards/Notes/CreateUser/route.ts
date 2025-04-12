import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.TASKFLOW_DB_URL;
if (!databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

// Function to insert user data into the database
async function addUser(
    referenceid: string,
    title: string,
    description: string,
    status: string
) {
    try {
        if (!referenceid || !title) {
            throw new Error("Reference ID and Title are required.");
        }

        const result = await sql`
            INSERT INTO notes (referenceid, title, description, status, date_created) 
            VALUES (${referenceid}, ${title}, ${description}, ${status}, NOW()) 
            RETURNING *;
        `;

        console.log("Database insert result:", result); // Log result of the insert operation
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error inserting task:", error);
        return { success: false, error: error.message || "Failed to add task." };
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Received body:", body); // Log the body received from the frontend

        const { referenceid, title, description, status } = body;

        const result = await addUser(referenceid, title, description, status);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in POST /api/addTask:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
