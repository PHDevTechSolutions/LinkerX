import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Get database URL from environment variable
const databaseUrl = process.env.TASKFLOW_DB_URL;
if (!databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

// Function to update email data
async function updateEmail(
    id: string,
    recepient: string,
    subject: string,
    message: string
) {
    try {
        if (!id || !recepient) {
            throw new Error("Email ID and Recepient are required.");
        }

        const result = await sql`
            UPDATE email
            SET
                recepient = ${recepient},
                subject = ${subject},
                message = ${message},
                date_updated = NOW()
            WHERE id = ${id}
            RETURNING *;
        `;

        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error updating email:", error);
        return { success: false, error: error.message || "Failed to update email." };
    }
}

// Accept PUT request for update
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, recepient, subject, message } = body;

        const result = await updateEmail(id, recepient, subject, message);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in PUT /api/EditEmail:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Optional: Reject other HTTP methods (GET, POST, etc.)
export function GET() {
    return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
}

export function POST() {
    return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
}
