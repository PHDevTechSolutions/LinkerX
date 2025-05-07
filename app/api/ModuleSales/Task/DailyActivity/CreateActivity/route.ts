import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure DATABASE_URL is defined
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Create a Neon database connection instance
const Xchire_sql = neon(Xchire_databaseUrl);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const { activitystatus, activityremarks, startdate, enddate, referenceid, manager, tsm } = data;

    // Prepare SQL queries for both tables
    const Xchire_activityQuery = `
      INSERT INTO activity (activitystatus, activityremarks, startdate, enddate, referenceid, manager, tsm, date_created)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila') RETURNING *;
    `;
    const Xchire_progressQuery = `
      INSERT INTO progress (activitystatus, activityremarks, startdate, enddate, referenceid, manager, tsm, date_created)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila') RETURNING *;
    `;
    
    const values = [activitystatus, activityremarks, startdate, enddate, referenceid, manager, tsm];

    // Execute queries for both tables
    const Xchire_activityResult = await Xchire_sql(Xchire_activityQuery, values);
    const Xchire_progressResult = await Xchire_sql(Xchire_progressQuery, values);

    return NextResponse.json(
      { success: true, activityData: Xchire_activityResult, progressData: Xchire_progressResult },
      { status: 201 }
    );
  } catch (Xchire_error: any) {
    console.error("Error inserting data:", Xchire_error);
    return NextResponse.json(
      { success: false, error: Xchire_error.message || "Failed to submit data." },
      { status: 500 }
    );
  }
}
