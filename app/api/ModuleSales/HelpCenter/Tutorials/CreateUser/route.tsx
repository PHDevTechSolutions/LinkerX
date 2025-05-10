import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Load database URL from environment variables
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Initialize Neon SQL client
const Xchire_sql = neon(Xchire_databaseUrl);

/**
 * Helper function to insert a new task/note into the database.
 * @param title - Short title of the note/task
 * @param description - Detailed description
 * @param link - Current status of the task
 */
async function create(
    title: string,
    description: string,
    link: string,
    type: string
) {
    try {
        if (!title) {
            throw new Error("Reference ID and Title are required.");
        }

        // Insert the note/task into the database
        const Xchire_result = await Xchire_sql`
            INSERT INTO tutorials (title, description, link, type, date_created) 
            VALUES (${title}, ${description}, ${link}, ${type}, NOW()) 
            RETURNING *;
        `;

        console.log("Database insert result:", Xchire_result);
        return { success: true, data: Xchire_result };
    } catch (Xchire_error: any) {
        console.error("Error inserting task:", Xchire_error);
        return {
            success: false,
            error: Xchire_error.message || "Failed to add task."
        };
    }
}

/**
 * POST /api/addTask
 * Accepts task/note details and inserts into the notes table.
 */
export async function POST(req: Request) {
    try {
        const Xchire_body = await req.json();
        console.log("Received body:", Xchire_body);

        const {title, description, link, type } = Xchire_body;

        const Xchire_result = await create(title, description, link, type);
        return NextResponse.json(Xchire_result);
    } catch (Xchire_error: any) {
        console.error("Error in POST /api/addTask:", Xchire_error);
        return NextResponse.json(
            {
                success: false,
                error: Xchire_error.message || "Internal Server Error"
            },
            { status: 500 }
        );
    }
}
