import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Load database URL from environment variables
const taskflowDatabaseUrl = process.env.TASKFLOW_DB_URL;
if (!taskflowDatabaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Initialize Neon SQL client
const taskflowSql = neon(taskflowDatabaseUrl);

/**
 * Helper function to update an existing task/note in the database.
 * @param id - ID of the task/note to update
 * @param title - Updated title of the note/task
 * @param description - Updated description
 * @param link - Updated current status of the task
 */
async function updateTask(
    id: string,
    title: string,
    description: string,
    link: string,
    type: string
) {
    try {
        if (!id) {
            throw new Error("ID is required to update a task.");
        }

        if (!title) {
            throw new Error("Title is required.");
        }

        // Update the task/note in the database
        const result = await taskflowSql`
            UPDATE tutorials
            SET title = ${title}, description = ${description}, link = ${link}, type = ${type}, date_updated = NOW()
            WHERE id = ${id}
            RETURNING *;
        `;

        console.log("Database update result:", result);
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error updating task:", error);
        return {
            success: false,
            error: error.message || "Failed to update task."
        };
    }
}

/**
 * PUT /api/updateTask
 * Accepts task/note details and updates the task/note in the database.
 */
export async function PUT(req: Request) {
    try {
        const requestBody = await req.json();
        console.log("Received body:", requestBody);

        const { id, title, description, link, type } = requestBody;

        // Validate input
        if (!id || !title || !description || !link || !type) {
            return NextResponse.json(
                { success: false, error: "ID, title, description, and link are required." },
                { status: 400 }
            );
        }

        // Update task in the database
        const result = await updateTask(id, title, description, link, type);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in PUT /api/updateTask:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
