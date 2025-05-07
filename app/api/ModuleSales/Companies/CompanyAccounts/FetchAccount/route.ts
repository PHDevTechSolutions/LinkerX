import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Validate environment variable and initialize database client
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}
const Xchire_sql = neon(Xchire_databaseUrl);

/**
 * GET /api/ModuleSales/UserManagement/CompanyAccounts/ByReference
 * Fetch accounts by reference ID from query parameters
 */
export async function GET(req: Request) {
    try {
        const Xchire_url = new URL(req.url);
        const referenceId = Xchire_url.searchParams.get("referenceid");

        console.log("Received referenceid:", referenceId);

        if (!referenceId) {
            return NextResponse.json(
                { success: false, error: "Missing reference ID." },
                { status: 400 }
            );
        }

        const Xchire_fetch = await Xchire_sql`
            SELECT * FROM accounts WHERE referenceid = ${referenceId};
        `;

        if (Xchire_fetch.length === 0) {
            return NextResponse.json(
                { success: false, error: "No accounts found with the provided reference ID." },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: Xchire_fetch }, { status: 200 });
    } catch (Xchire_error: any) {
        console.error("Error fetching accounts:", Xchire_error);
        return NextResponse.json(
            { success: false, error: Xchire_error.message || "Failed to fetch accounts." },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic"; // Always fetch latest data
