import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

// Function to update activity status
async function updateActivityStatus(id: string, activitystatus: string) {
    try {
        if (!id || !activitystatus) {
            throw new Error("ID and activity status are required.");
        }

        const result = await sql`
            UPDATE activity
            SET activitystatus = ${activitystatus}
            WHERE id = ${id}
            RETURNING *;
        `;

        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error updating activity status:", error);
        return { success: false, error: error.message || "Failed to update activity status." };
    }
}

// Handle PUT request for updating activity status
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, activitystatus } = body;

        if (!id || !activitystatus) {
            return NextResponse.json(
                { success: false, error: "ID and activity status are required." },
                { status: 400 }
            );
        }

        const result = await updateActivityStatus(id, activitystatus);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in PUT /api/ModuleSales/Task/DailyActivity/UpdateStatus:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
