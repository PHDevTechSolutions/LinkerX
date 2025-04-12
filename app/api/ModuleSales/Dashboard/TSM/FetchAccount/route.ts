import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.TASKFLOW_DB_URL;
if (!databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const tsm = searchParams.get("tsm");

        if (!tsm) {
            return Response.json({ success: false, error: "TSM is required." }, { status: 400 });
        }

        // Get total accounts count for the given tsm (Territory Sales Manager)
        const result = await sql`SELECT COUNT(*)::int AS total FROM accounts WHERE tsm = ${tsm}`;

        return Response.json({ success: true, totalAccounts: result[0]?.total || 0 }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching account count:", error);
        return Response.json(
            { success: false, error: error.message || "Failed to fetch account count." },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
