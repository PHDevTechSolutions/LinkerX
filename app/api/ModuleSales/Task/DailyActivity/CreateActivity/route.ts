import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure DATABASE_URL is defined
const databaseUrl = process.env.TASKFLOW_DB_URL;
if (!databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Create a Neon database connection instance
const sql = neon(databaseUrl);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const { activitystatus, activityremarks, startdate, enddate, referenceid, manager, tsm } = data;

    // Prepare SQL queries for both tables
    const activityQuery = `
      INSERT INTO activity (activitystatus, activityremarks, startdate, enddate, referenceid, manager, tsm, date_created)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila') RETURNING *;
    `;
    const progressQuery = `
      INSERT INTO progress (activitystatus, activityremarks, startdate, enddate, referenceid, manager, tsm, date_created)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila') RETURNING *;
    `;
    
    const values = [activitystatus, activityremarks, startdate, enddate, referenceid, manager, tsm];

    // Execute queries for both tables
    const activityResult = await sql(activityQuery, values);
    const progressResult = await sql(progressQuery, values);

    return NextResponse.json(
      { success: true, activityData: activityResult, progressData: progressResult },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error inserting data:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit data." },
      { status: 500 }
    );
  }
}
