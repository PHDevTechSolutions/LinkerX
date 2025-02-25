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
            referenceid,
            manager,
            tsm,
            companyname,
            contactperson,
            contactnumber,
            emailaddress,
            typeclient,
            address,
            area,
            projectname,
            projectcategory,
            projecttype,
            source,
            typeactivity,
            callback,
            callstatus,
            typecall,
            remarks,
            quotationnumber,
            quotationamount,
            sonumber,
            soamount,
            startdate,
            enddate,
            activitystatus,
            activitynumber,
        } = data;

        // Validate required fields
        if (!companyname || !typeclient || !typeactivity) {
            throw new Error("Company Name, Type of Client, and Type of Activity are required.");
        }

        // Build dynamic insert query
        const columns = [
            "referenceid",
            "manager",
            "tsm",
            "companyname",
            "contactperson",
            "contactnumber",
            "emailaddress",
            "typeclient",
            "address",
            "area",
            "projectname",
            "projectcategory",
            "projecttype",
            "source",
            "typeactivity",
            "callback",
            "callstatus",
            "typecall",
            "remarks",
            "quotationnumber",
            "quotationamount",
            "sonumber",
            "soamount",
            "startdate",
            "enddate",
            "activitystatus",
            "activitynumber",
            "date_created"
        ];
        
        const values = [
            referenceid,
            manager,
            tsm,
            companyname,
            contactperson,
            contactnumber,
            emailaddress,
            typeclient,
            address,
            area,
            projectname,
            projectcategory,
            projecttype,
            source,
            typeactivity,
            callback || null, // Ensure NULL values for optional fields
            callstatus || null,
            typecall || null,
            remarks || null,
            quotationnumber || null,
            quotationamount || null,
            sonumber || null,
            soamount || null,
            startdate || null,
            enddate || null,
            activitystatus || null,
            activitynumber || null,
            new Date() // Use JavaScript Date for timestamp
        ];

        // Construct query dynamically
        const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
        
        const query = `
            INSERT INTO activity (${columns.join(", ")}) 
            VALUES (${placeholders}) 
            RETURNING *;
        `;

        // Execute query
        const result = await sql(query, values);

        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error inserting activity:", error);
        return { success: false, error: error.message || "Failed to add activity." };
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
