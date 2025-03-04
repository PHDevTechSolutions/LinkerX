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

        const { activitystatus, activityremarks, startdate, enddate, referenceid, tsm, manager } = data;

        // Validate required fields
        if (!activitystatus || !activityremarks || !enddate) {
            return NextResponse.json(
                { success: false, error: "Please fill in all fields before submitting." },
                { status: 400 }
            );
        }

        // Prepare SQL query
        const query = `
            INSERT INTO activity (
                activitystatus, activityremarks, startdate, enddate, referenceid, tsm, manager, date_created
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'
            ) RETURNING *;
        `;

        const values = [activitystatus, activityremarks, startdate, enddate, referenceid, tsm, manager];

        // Execute query
        const result = await sql(query, values);

        return NextResponse.json({ success: true, data: result }, { status: 201 });

    } catch (error: any) {
        console.error("Error inserting activity:", error);
        return NextResponse.json(
            { success: false, error: "Failed to submit activity." },
            { status: 500 }
        );
    }
}
