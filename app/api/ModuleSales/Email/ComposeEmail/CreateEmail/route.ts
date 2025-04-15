import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.TASKFLOW_DB_URL;
if (!databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

// Function to insert email data into both tables
async function insertEmailAndSentEmail(
    referenceid: string,
    sender: string,
    recepient: string,
    subject: string,
    message: string
) {
    try {
        if (!referenceid || !sender || !recepient) {
            throw new Error("Missing required fields.");
        }

        // Insert into email table
        const emailInsert = await sql`
            INSERT INTO email (referenceid, sender, recepient, subject, message, date_created)
            VALUES (${referenceid}, ${sender}, ${recepient}, ${subject}, ${message}, NOW())
            RETURNING *;
        `;

        // Insert into sentemail table
        const sentEmailInsert = await sql`
            INSERT INTO sentemail (referenceid, sender, recepient, subject, message, date_sent)
            VALUES (${referenceid}, ${sender}, ${recepient}, ${subject}, ${message}, NOW())
            RETURNING *;
        `;

        return {
            success: true,
            email: emailInsert,
            sentemail: sentEmailInsert,
        };
    } catch (error: any) {
        console.error("Error inserting email/sentemail:", error);
        return { success: false, error: error.message || "Database insertion failed." };
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Received body:", body);

        const { referenceid, sender, recepient, subject, message } = body;

        const result = await insertEmailAndSentEmail(referenceid, sender, recepient, subject, message);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in POST /api/addTask:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
