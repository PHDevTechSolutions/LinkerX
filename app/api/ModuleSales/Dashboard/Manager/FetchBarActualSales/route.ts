import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const getFormattedDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
};

const databaseUrl = process.env.TASKFLOW_DB_URL;
if (!databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const manager = searchParams.get("manager");
    const selectedMonth = searchParams.get("month");
    const selectedYear = searchParams.get("year");

    if (!manager) {
      return NextResponse.json({ success: false, error: "manager is required." }, { status: 400 });
    }

    if (!selectedMonth || !selectedYear) {
      return NextResponse.json({ success: false, error: "Month and Year are required." }, { status: 400 });
    }

    // Fetch total actual sales filtered by selected month and year
    const salesResult = await sql`
      SELECT DATE(date_created) AS date_created, COALESCE(SUM(actualsales), 0) AS totalActualSales
      FROM progress 
      WHERE manager = ${manager}
      AND EXTRACT(MONTH FROM date_created) = ${selectedMonth}
      AND EXTRACT(YEAR FROM date_created) = ${selectedYear}
      GROUP BY DATE(date_created)
      ORDER BY date_created DESC
    `;

    // Format results for frontend
    const salesData = salesResult.map((sale) => ({
      date_created: getFormattedDate(sale.date_created),
      actualsales: sale.totalactualsales,
    }));

    return NextResponse.json({ success: true, data: salesData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching actual sales data:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch actual sales data." }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
