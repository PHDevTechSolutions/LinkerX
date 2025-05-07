import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Load and validate database URL
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Initialize Neon SQL client
const Xchire_sql = neon(Xchire_databaseUrl);

/**
 * PUT /api/updateStatus
 * Updates the status of a note/post in the `notes` table.
 */
export async function PUT(req: Request) {
    try {
        const { id, status } = await req.json(); // Parse request body

        if (!id || !status) {
            return NextResponse.json(
                { success: false, message: "Post ID and status are required" },
                { status: 400 }
            );
        }

        // Perform the update query
        const Xchire_update = await Xchire_sql`
            UPDATE notes 
            SET status = ${status}, date_updated = CURRENT_TIMESTAMP 
            WHERE id = ${id} 
            RETURNING *;
        `;

        if (Xchire_update.length === 0) {
            return NextResponse.json(
                { success: false, message: "Post not found" },
                { status: 404 }
            );
        }

        // Respond with the updated post
        return NextResponse.json(
            {
                success: true,
                message: "Status updated successfully",
                updatedPost: Xchire_update[0]
            },
            { status: 200 }
        );
    } catch (Xchire_error: any) {
        console.error("Error updating post status:", Xchire_error);
        return NextResponse.json(
            {
                success: false,
                error: Xchire_error.message || "Failed to update status"
            },
            { status: 500 }
        );
    }
}

// Ensure fresh data every request
export const dynamic = "force-dynamic";
