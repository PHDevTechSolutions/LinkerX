// routes/api/addTask/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.TASKFLOW_DB_URL;

if (!databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

// Function to insert user data into the database
async function addUser(
    sender: string,
    recepient: string,
    subject: string,
    message: string
) {
    try {
        if (!sender || !recepient || !subject || !message) {
            throw new Error("All fields are required.");
        }

        const result = await sql`
            INSERT INTO email (sender, recepient, subject, message, date_created) 
            VALUES (${sender}, ${recepient}, ${subject}, ${message}, NOW()) 
            RETURNING *;
        `;

        console.log("Database insert result:", result);
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error inserting task:", error);
        return { success: false, error: error.message || "Failed to add task." };
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("Received body:", body); // Log the body received from the frontend

        const { sender, recepient, subject, message } = body;

        const result = await addUser(sender, recepient, subject, message);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in POST /api/addTask:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
