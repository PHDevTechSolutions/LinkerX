import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

export async function POST(req: Request) {
    try {
        const Xchire_body = await req.json();
        console.log("Request body:", Xchire_body);

        const { id, status } = Xchire_body;
        if (!id || !status) {
            throw new Error("Missing 'id' or 'status' in the request body.");
        }

        const Xchire_update = await Xchire_sql`
            UPDATE accounts
            SET 
                status = ${status},
                date_updated = CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'
            WHERE id = ${id}
            RETURNING *;
        `;

        if (Xchire_update.length === 0) {
            throw new Error("No rows were updated. Please check the company ID.");
        }

        return NextResponse.json(
            {
                success: true,
                message: "Company status updated successfully",
                data: Xchire_update[0],
            },
            { status: 200 }
        );
    } catch (Xchire_error: any) {
        console.error("Error updating company status:", Xchire_error);
        return NextResponse.json(
            {
                success: false,
                error: Xchire_error.message || "Failed to update company status.",
            },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
