import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

// Function to update activity status
async function update(id: string, activitystatus: string) {
    try {
        if (!id || !activitystatus) {
            throw new Error("ID and activity status are required.");
        }

        const Xchire_update = await Xchire_sql`
            UPDATE activity
            SET activitystatus = ${activitystatus}
            WHERE id = ${id}
            RETURNING *;
        `;

        return { success: true, data: Xchire_update };
    } catch (Xchire_error: any) {
        console.error("Error updating activity status:", Xchire_error);
        return { success: false, error: Xchire_error.message || "Failed to update activity status." };
    }
}

// Handle PUT request for updating activity status
export async function PUT(req: Request) {
    try {
        const Xchire_body = await req.json();
        const { id, activitystatus } = Xchire_body;

        if (!id || !activitystatus) {
            return NextResponse.json(
                { success: false, error: "ID and activity status are required." },
                { status: 400 }
            );
        }

        const Xchire_result = await update(id, activitystatus);

        return NextResponse.json(Xchire_result);
    } catch (Xchire_error: any) {
        console.error("Error in PUT /api/ModuleSales/Task/DailyActivity/UpdateStatus:", Xchire_error);
        return NextResponse.json(
            { success: false, error: Xchire_error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
