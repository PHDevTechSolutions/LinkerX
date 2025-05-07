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
        const Xchire_data = await req.json();

        const { activitystatus, activityremarks, startdate, enddate, referenceid, tsm, manager, typeactivity } = Xchire_data;

        // Prepare SQL queries for both tables (activity and progress)
        const Xchire_activityQuery = `
            INSERT INTO activity (
                activitystatus, activityremarks, startdate, enddate, referenceid, tsm, manager, date_created
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'
            ) RETURNING *;
        `;

        const Xchire_progressQuery = `
            INSERT INTO progress (
                activitystatus, activityremarks, startdate, enddate, referenceid, tsm, manager, typeactivity, date_created
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'
            ) RETURNING *;
        `;

        const values = [activitystatus, activityremarks, startdate, enddate, referenceid, tsm, manager];
        const progressValues = [...values, typeactivity]; // Add typeactivity to the progress query values

        // Execute queries for both tables
        const Xchire_activityResult = await Xchire_sql(Xchire_activityQuery, values); // Insert into activity table
        const Xchire_progressResult = await Xchire_sql(Xchire_progressQuery, progressValues); // Insert into progress table

        return NextResponse.json({
            success: true,
            activityData: Xchire_activityResult,
            progressData: Xchire_progressResult
        }, { status: 201 });

    } catch (Xchire_error: any) {
        console.error("Error inserting data:", Xchire_error);
        return NextResponse.json(
            { success: false, Xchire_error: "Failed to submit data." },
            { status: 500 }
        );
    }
}
