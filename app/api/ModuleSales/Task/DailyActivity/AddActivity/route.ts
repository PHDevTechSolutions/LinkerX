import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure DATABASE_URL is defined
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

// Create a Neon database connection instance
const sql = neon(databaseUrl);

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        const { activitystatus, activityremarks, startdate, enddate, referenceid, tsm, manager, typeactivity } = data;

        // Prepare SQL queries for both tables (activity and progress)
        const activityQuery = `
            INSERT INTO activity (
                activitystatus, activityremarks, startdate, enddate, referenceid, tsm, manager, date_created
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'
            ) RETURNING *;
        `;

        const progressQuery = `
            INSERT INTO progress (
                activitystatus, activityremarks, startdate, enddate, referenceid, tsm, manager, typeactivity, date_created
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'
            ) RETURNING *;
        `;

        const values = [activitystatus, activityremarks, startdate, enddate, referenceid, tsm, manager];
        const progressValues = [...values, typeactivity]; // Add typeactivity to the progress query values

        // Execute queries for both tables
        const activityResult = await sql(activityQuery, values); // Insert into activity table
        const progressResult = await sql(progressQuery, progressValues); // Insert into progress table

        return NextResponse.json({
            success: true,
            activityData: activityResult,
            progressData: progressResult
        }, { status: 201 });

    } catch (error: any) {
        console.error("Error inserting data:", error);
        return NextResponse.json(
            { success: false, error: "Failed to submit data." },
            { status: 500 }
        );
    }
}
