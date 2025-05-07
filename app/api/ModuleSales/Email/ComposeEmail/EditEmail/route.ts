import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Get database URL from environment variable
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

// Function to update email data
async function update(
    id: string,
    recepient: string,
    subject: string,
    message: string
) {
    try {
        if (!id || !recepient) {
            throw new Error("Email ID and Recepient are required.");
        }

        const Xchire_update = await Xchire_sql`
            UPDATE email
            SET
                recepient = ${recepient},
                subject = ${subject},
                message = ${message},
                date_updated = NOW()
            WHERE id = ${id}
            RETURNING *;
        `;

        return { success: true, data: Xchire_update };
    } catch (Xchire_error: any) {
        console.error("Error updating email:", Xchire_error);
        return { success: false, error: Xchire_error.message || "Failed to update email." };
    }
}

// Accept PUT request for update
export async function PUT(req: Request) {
    try {
        const Xchire_body = await req.json();
        const { id, recepient, subject, message } = Xchire_body;

        const Xchire_result = await update(id, recepient, subject, message);
        return NextResponse.json(Xchire_result);
    } catch (Xchire_error: any) {
        console.error("Error in PUT /api/EditEmail:", Xchire_error);
        return NextResponse.json(
            { success: false, error: Xchire_error.message || "Internal Server Error" },
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
