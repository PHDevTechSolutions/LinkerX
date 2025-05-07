import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const getFormattedDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
};

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tsm = searchParams.get("tsm");
    let selectedMonth = searchParams.get("month");
    let selectedYear = searchParams.get("year");

    if (!tsm) {
      return NextResponse.json({ success: false, error: "tsm is required." }, { status: 400 });
    }

    // If no month or year is provided, use the current month and year
    if (!selectedMonth || !selectedYear) {
      const currentDate = new Date();
      selectedMonth = (currentDate.getMonth() + 1).toString(); // Months are 0-based
      selectedYear = currentDate.getFullYear().toString();
    }

    // Fetch total actual sales filtered by selected month and year
    const Xchire_fetch = await Xchire_sql`
      SELECT DATE(date_created) AS date_created, COALESCE(SUM(actualsales), 0) AS totalActualSales
      FROM progress 
      WHERE tsm = ${tsm}
      AND EXTRACT(MONTH FROM date_created) = ${selectedMonth}
      AND EXTRACT(YEAR FROM date_created) = ${selectedYear}
      GROUP BY DATE(date_created)
      ORDER BY date_created DESC
    `;

    // Format results for frontend
    const salesData = Xchire_fetch.map((sale) => ({
      date_created: getFormattedDate(sale.date_created),
      actualsales: sale.totalactualsales,
    }));

    return NextResponse.json({ success: true, data: salesData }, { status: 200 });
  } catch (Xchire_error) {
    console.error("Error fetching actual sales data:", Xchire_error);
    return NextResponse.json({ success: false, Xchire_error: "Failed to fetch actual sales data." }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
