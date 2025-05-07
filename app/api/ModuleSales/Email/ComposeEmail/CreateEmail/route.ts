import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

// Function to insert email data into both tables
async function insert(
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
        const emailInsert = await Xchire_sql`
            INSERT INTO email (referenceid, sender, recepient, subject, message, date_created)
            VALUES (${referenceid}, ${sender}, ${recepient}, ${subject}, ${message}, NOW())
            RETURNING *;
        `;

        // Insert into sentemail table
        const sentEmailInsert = await Xchire_sql`
            INSERT INTO sentemail (referenceid, sender, recepient, subject, message, date_sent)
            VALUES (${referenceid}, ${sender}, ${recepient}, ${subject}, ${message}, NOW())
            RETURNING *;
        `;

        return {
            success: true,
            email: emailInsert,
            sentemail: sentEmailInsert,
        };
    } catch (Xchire_error: any) {
        console.error("Error inserting email/sentemail:", Xchire_error);
        return { success: false, error: Xchire_error.message || "Database insertion failed." };
    }
}

export async function POST(req: Request) {
    try {
        const Xchire_body = await req.json();
        console.log("Received body:", Xchire_body);

        const { referenceid, sender, recepient, subject, message } = Xchire_body;

        const Xchire_result = await insert(referenceid, sender, recepient, subject, message);

        return NextResponse.json(Xchire_result);
    } catch (Xchire_error: any) {
        console.error("Error in POST /api/addTask:", Xchire_error);
        return NextResponse.json(
            { success: false, error: Xchire_error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
