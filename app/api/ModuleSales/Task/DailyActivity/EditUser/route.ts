import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure DATABASE_URL is set
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

// Create a reusable Neon database connection function
const sql = neon(databaseUrl);

/**
 * Updates user activity details in the database.
 * @param id - The ID of the activity to update.
 * @param data - The updated fields.
 * @returns Success or error response.
 */
async function updateUserActivity(id: string, data: any) {
    try {
        if (!id) {
            throw new Error("Activity ID is required for updating.");
        }

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

        // Prepare dynamic query
        const updateFields = [
            ["referenceid", referenceid],
            ["manager", manager],
            ["tsm", tsm],
            ["companyname", companyname],
            ["contactperson", contactperson],
            ["contactnumber", contactnumber],
            ["emailaddress", emailaddress],
            ["typeclient", typeclient],
            ["address", address],
            ["area", area],
            ["projectname", projectname],
            ["projectcategory", projectcategory],
            ["projecttype", projecttype],
            ["source", source],
            ["typeactivity", typeactivity],
            ["callback", callback || null],
            ["callstatus", callstatus || null],
            ["typecall", typecall || null],
            ["remarks", remarks || null],
            ["quotationnumber", quotationnumber || null],
            ["quotationamount", quotationamount || null],
            ["sonumber", sonumber || null],
            ["soamount", soamount || null],
            ["startdate", startdate || null],
            ["enddate", enddate || null],
            ["activitystatus", activitystatus || null],
            ["activitynumber", activitynumber || null],
            ["date_updated", new Date()], // Timestamp for update
        ]
            .filter(([_, value]) => value !== undefined) // Remove fields that are not provided
            .map(([key, value], index) => `${key} = $${index + 2}`) // Generate dynamic key-value pairs
            .join(", ");

        if (!updateFields) {
            throw new Error("No valid fields provided for update.");
        }

        const values = [id, ...updateFields.split(", ").map((field) => data[field.split(" = ")[0]])];

        const query = `
            UPDATE activity
            SET ${updateFields}
            WHERE id = $1
            RETURNING *;
        `;

        // Execute the update query
        const result = await sql(query, values);

        if (result.length === 0) {
            return { success: false, error: "Activity not found or no changes made." };
        }

        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error updating activity:", error);
        return { success: false, error: error.message || "Failed to update activity." };
    }
}

// Handle PUT request to update activity
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Missing activity ID." },
                { status: 400 }
            );
        }

        const result = await updateUserActivity(id, updateData);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in PUT /api/ModuleSales/Task/DailyActivity/EditUser:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
