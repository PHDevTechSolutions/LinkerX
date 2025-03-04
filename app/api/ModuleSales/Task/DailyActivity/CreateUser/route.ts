import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure DATABASE_URL is defined
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

// Create a reusable Neon database connection function
const sql = neon(databaseUrl);

async function addUser(data: any) {
    try {
        const {
            referenceid, manager, tsm, companyname, contactperson,
            contactnumber, emailaddress, typeclient, address, area,
            projectname, projectcategory, projecttype, source, typeactivity,
            callback, callstatus, typecall, remarks, quotationnumber,
            quotationamount, sonumber, soamount, startdate, enddate,
            activitystatus, activitynumber,
        } = data;

        // Validate required fields
        if (!companyname || !typeclient) {
            throw new Error("Company Name and Type of Client are required.");
        }

        // Fields for activity table
        const activityColumns = [
            "referenceid", "manager", "tsm", "companyname", "contactperson",
            "contactnumber", "emailaddress", "typeclient", "address", "area",
            "projectname", "projectcategory", "projecttype", "source", 
            "activitystatus", "activitynumber"
        ];

        const activityValues = [
            referenceid, manager, tsm, companyname, contactperson,
            contactnumber, emailaddress, typeclient, address, area,
            projectname, projectcategory, projecttype, source, 
            activitystatus || null, activitynumber || null
        ];

        // Construct and execute the query for activity table
        const activityPlaceholders = activityValues.map((_, index) => `$${index + 1}`).join(", ");
        const activityQuery = `
            INSERT INTO activity (${activityColumns.join(", ")}, date_created) 
            VALUES (${activityPlaceholders}, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila') 
            RETURNING *;
        `;

        const activityResult = await sql(activityQuery, activityValues);
        const insertedActivity = activityResult[0];

        if (!insertedActivity) {
            throw new Error("Failed to insert into activity table.");
        }

        // Use the returned activitynumber from the inserted activity
        const newActivityNumber = insertedActivity.activitynumber;

        // Fields for progress table
        const progressColumns = [
            ...activityColumns, "typeactivity", "callback", "callstatus", "typecall", 
            "remarks", "quotationnumber", "quotationamount", "sonumber", "soamount", 
            "startdate", "enddate"
        ];

        const progressValues = [
            ...activityValues, typeactivity, callback || null, callstatus || null, typecall || null, 
            remarks || null, quotationnumber || null, quotationamount || null, sonumber || null, 
            soamount || null, startdate || null, enddate || null
        ];

        // Update activitynumber in progressValues to use the returned one
        progressValues[progressColumns.indexOf("activitynumber")] = newActivityNumber;

        // Construct and execute the query for progress table
        const progressPlaceholders = progressValues.map((_, index) => `$${index + 1}`).join(", ");
        const progressQuery = `
            INSERT INTO progress (${progressColumns.join(", ")}, date_created) 
            VALUES (${progressPlaceholders}, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila') 
            RETURNING *;
        `;

        const progressResult = await sql(progressQuery, progressValues);

        if (!progressResult[0]) {
            throw new Error("Failed to insert into progress table.");
        }

        return { success: true, activity: insertedActivity, progress: progressResult[0] };
    } catch (error: any) {
        console.error("Error inserting activity and progress:", error);
        return { success: false, error: error.message || "Failed to add activity and progress." };
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Call the addUser function
        const result = await addUser(body);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in POST /api/addActivity:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
