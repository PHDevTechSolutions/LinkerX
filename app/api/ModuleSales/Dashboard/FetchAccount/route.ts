import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const referenceID = searchParams.get("referenceID");

    if (!referenceID) {
      return Response.json(
        { success: false, error: "ReferenceID is required." },
        { status: 400 }
      );
    }

    // Get total accounts count for the given referenceID
    const Xchire_fetch = await Xchire_sql`
      SELECT COUNT(*)::int AS total 
      FROM accounts 
      WHERE referenceid = ${referenceID}
    `;

    return Response.json(
      { success: true, totalAccounts: Xchire_fetch[0]?.total || 0 },
      { status: 200 }
    );
  } catch (Xchire_error: any) {
    console.error("Xchire error fetching account count:", Xchire_error);
    return Response.json(
      { success: false, error: Xchire_error.message || "Failed to fetch account count." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
