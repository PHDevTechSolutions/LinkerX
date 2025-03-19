import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const referenceID = searchParams.get("referenceID");

    if (!referenceID) {
      return NextResponse.json(
        { success: false, error: "ReferenceID is required." },
        { status: 400 }
      );
    }

    // ✅ Fetch total sales order today
    const salesResult = await sql`
      SELECT COALESCE(SUM(soamount), 0) AS totalSalesOrder
      FROM progress
      WHERE referenceid = ${referenceID}
      AND DATE_TRUNC('day', date_created) = CURRENT_DATE
    `;

    const totalSalesOrder = salesResult.length > 0 ? salesResult[0].totalsalesorder : 0;

    // ✅ Fetch all sales order data for filtering weekly and monthly
    const salesOrderData = await sql`
      SELECT soamount AS amount, date_created
      FROM progress
      WHERE referenceid = ${referenceID}
      AND date_created >= DATE_TRUNC('month', CURRENT_DATE)
    `;

    return NextResponse.json(
      {
        success: true,
        totalSalesOrder,
        data: salesOrderData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching sales order data:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch sales order data." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"; // ✅ Ensure fresh data fetch
