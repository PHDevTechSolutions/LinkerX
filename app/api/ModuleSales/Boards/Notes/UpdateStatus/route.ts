import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

// Handler for updating the status of a post
export async function PUT(req: Request) {
    try {
        const { id, status } = await req.json(); // Extract ID and new status from the request body

        if (!id || !status) {
            return NextResponse.json(
                { success: false, message: "Post ID and status are required" },
                { status: 400 }
            );
        }

        // Update the post's status in the database
        const result = await sql`
            UPDATE notes 
            SET status = ${status}, date_updated = CURRENT_TIMESTAMP 
            WHERE id = ${id} 
            RETURNING *;
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { success: false, message: "Post not found" },
                { status: 404 }
            );
        }

        // Return success response with updated post details
        return NextResponse.json(
            { success: true, message: "Status updated successfully", updatedPost: result[0] },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error updating post status:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to update status" },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
