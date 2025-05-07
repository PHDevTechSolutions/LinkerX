// routes/api/addTask/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;

if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

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

        const Xchire_insert = await Xchire_sql`
            INSERT INTO email (sender, recepient, subject, message, date_created) 
            VALUES (${sender}, ${recepient}, ${subject}, ${message}, NOW()) 
            RETURNING *;
        `;

        console.log("Database insert result:", Xchire_insert);
        return { success: true, data: Xchire_insert };
    } catch (Xchire_error: any) {
        console.error("Error inserting task:", Xchire_error);
        return { success: false, error: Xchire_error.message || "Failed to add task." };
    }
}

export async function POST(req: NextRequest) {
    try {
        const Xchire_body = await req.json();
        console.log("Received body:", Xchire_body); // Log the body received from the frontend

        const { sender, recepient, subject, message } = Xchire_body;

        const Xchire_result = await addUser(sender, recepient, subject, message);
        return NextResponse.json(Xchire_result);
    } catch (Xchire_error: any) {
        console.error("Error in POST /api/addTask:", Xchire_error);
        return NextResponse.json(
            { success: false, error: Xchire_error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
