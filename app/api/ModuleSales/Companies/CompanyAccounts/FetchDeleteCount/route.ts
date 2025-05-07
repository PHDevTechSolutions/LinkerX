import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Initialize Neon connection
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}
const Xchire_sql = neon(Xchire_databaseUrl);

/**
 * GET /api/ModuleSales/UserManagement/CompanyAccounts/Progress
 * Fetch accounts with status 'For Deletion' or 'Remove' by reference ID
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const referenceId = searchParams.get("referenceId");

    if (!referenceId) {
      return NextResponse.json(
        { success: false, error: "Reference ID is required." },
        { status: 400 }
      );
    }

    const Xchire_fetch = await Xchire_sql`
      SELECT *
      FROM accounts
      WHERE referenceid = ${referenceId}
      AND (status = 'For Deletion' OR status = 'Remove');
    `;

    console.log("Xchire fetched accounts (status = For Deletion/Remove):", Xchire_fetch);

    return NextResponse.json({ success: true, data: Xchire_fetch }, { status: 200 });
  } catch (Xchire_error: any) {
    console.error("Xchire error fetching accounts:", Xchire_error);
    return NextResponse.json(
      { success: false, error: Xchire_error.message || "Failed to fetch accounts." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"; // Ensure fresh fetch
