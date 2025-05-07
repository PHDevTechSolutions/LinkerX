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
    const referenceID = searchParams.get("referenceID");

    if (!referenceID) {
      return NextResponse.json(
        { success: false, error: "ReferenceID is required." },
        { status: 400 }
      );
    }

    // ✅ Fetch total actual sales today
    const Xchire_fetch = await Xchire_sql`
      SELECT COALESCE(SUM(actualsales), 0) AS Xchire_totalActualSales
      FROM progress
      WHERE referenceid = ${referenceID}
      AND DATE_TRUNC('day', date_created) = CURRENT_DATE
    `;

    const totalactualsales =
      Xchire_fetch.length > 0 ? Xchire_fetch[0].totalactualsales : 0;

    // ✅ Fetch all actual sales data for filtering weekly and monthly
    const actualSalesData = await Xchire_sql`
      SELECT actualsales AS amount, date_created
      FROM progress
      WHERE referenceid = ${referenceID}
      AND date_created >= DATE_TRUNC('month', CURRENT_DATE)
    `;

    return NextResponse.json(
      {
        success: true,
        totalactualsales,
        data: actualSalesData,
      },
      { status: 200 }
    );
  } catch (Xchire_error: any) {
    console.error("Xchire error fetching actual sales data:", Xchire_error);
    return NextResponse.json(
      {
        success: false,
        error: Xchire_error.message || "Failed to fetch actual sales data.",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"; // ✅ Ensure fresh data fetch
