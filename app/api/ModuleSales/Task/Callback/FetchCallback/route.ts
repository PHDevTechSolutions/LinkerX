import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const referenceId = searchParams.get("referenceId");

        if (!referenceId) {
            return NextResponse.json({ success: false, error: "ReferenceID is required" }, { status: 400 });
        }

        // ✅ Updated Query: Check both referenceId and tsm
        const Xchire_fetch = await Xchire_sql`
        SELECT callback, message, type, date_created, tsm, referenceid, csragent, status, id
        FROM notification 
        WHERE referenceid = ${referenceId} OR tsm = ${referenceId} OR csragent = ${referenceId};
        `;

        return NextResponse.json({ success: true, data: Xchire_fetch }, { status: 200 });
    } catch (Xchire_error: any) {
        console.error("Error fetching notifications:", Xchire_error);
        return NextResponse.json(
            { success: false, error: Xchire_error.message || "Failed to fetch notifications." },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
