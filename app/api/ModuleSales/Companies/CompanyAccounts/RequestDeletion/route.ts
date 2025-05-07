import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Initialize Neon connection
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}
const Xchire_sql = neon(Xchire_databaseUrl);

/**
 * PUT /api/ModuleSales/Companies/CompanyAccounts/RequestDeletion
 * Request deletion for an account by ID and remarks
 */
async function Xchire_requestDeletion(id: string, remarks: string) {
  try {
    if (!id || !remarks) {
      throw new Error("User ID and remarks are required.");
    }

    console.log("Xchire processing deletion request for ID:", id);

    const Xchire_update = await Xchire_sql`
      UPDATE accounts
      SET status = 'Subject for Deletion', remarks = ${remarks}
      WHERE id = ${id}
      RETURNING *;
    `;

    if (Xchire_update.length === 0) {
      throw new Error("No account found with the provided User ID.");
    }

    return { success: true, data: Xchire_update };
  } catch (Xchire_error: any) {
    console.error("Xchire error processing deletion request:", Xchire_error);
    return { success: false, error: Xchire_error.message || "Failed to request deletion." };
  }
}

/**
 * PUT /api/ModuleSales/Companies/CompanyAccounts/RequestDeletion
 * Handles the PUT request for initiating account deletion
 */
export async function PUT(req: Request) {
  try {
    const Xchire_body = await req.json();
    const { id, remarks } = Xchire_body;

    if (!id || !remarks) {
      return NextResponse.json(
        { success: false, error: "User ID and remarks are required." },
        { status: 400 }
      );
    }

    const Xchire_result = await Xchire_requestDeletion(id, remarks);

    return NextResponse.json(Xchire_result);
  } catch (Xchire_error: any) {
    console.error("Xchire error in PUT /api/ModuleSales/Companies/CompanyAccounts/RequestDeletion:", Xchire_error);
    return NextResponse.json(
      { success: false, error: Xchire_error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"; // Ensure fresh data fetch
