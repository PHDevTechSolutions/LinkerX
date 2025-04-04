import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure DATABASE_URL is defined
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

// Create a reusable Neon database connection function
const sql = neon(databaseUrl);

// Function to insert user data into the database
async function addUser(
    referenceid: string,
    manager: string,
    tsm: string,
    companyname: string,
    contactperson: string,
    contactnumber: string,
    emailaddress: string,
    typeclient: string,
    address: string,
    area: string,
    projectname: string,
    projectcategory: string,
    projecttype: string,
    source: string,
    date_created: string,
    activitystatus: string,
    activitynumber: string,
    targetquota: string,
) {
    try {
        const result = await sql`
            INSERT INTO activity (referenceid, manager, tsm, companyname, contactperson, contactnumber, emailaddress, typeclient, address, area, 
            projectname, projectcategory, projecttype, source, date_created, activitystatus, activitynumber, targetquota) 
            VALUES (${referenceid}, ${manager}, ${tsm}, ${companyname}, ${contactperson}, ${contactnumber}, ${emailaddress}, ${typeclient}, 
            ${address}, ${area}, ${projectname}, ${projectcategory}, ${projecttype}, ${source}, ${date_created}, ${activitystatus}, ${activitynumber}, ${targetquota})
            RETURNING *;
        `;

        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error inserting account:", error);
        return { success: false, error: error.message || "Failed to add account." };
    }
}

// POST request handler
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { referenceid, tsm, data } = body;

        if (!referenceid || !tsm || !data || data.length === 0) {
            return NextResponse.json(
                { success: false, error: "Missing referenceid, tsm, or data." },
                { status: 400 }
            );
        }

        let insertedCount = 0;
        for (const account of data) {
            const result = await addUser(
                account.referenceid,
                account.manager,  // Assuming manager is optional
                account.tsm,
                account.companyname,
                account.contactperson,
                account.contactnumber,
                account.emailaddress,
                account.typeclient,
                account.address,
                account.area,
                account.projectname,
                account.projectcategory,
                account.projecttype,
                account.source,
                account.date_created,
                account.activitystatus,
                account.activitynumber,
                account.targetquota
            );

            if (result.success) {
                insertedCount++;
            } else {
                console.error("Failed to insert account:", result.error);
            }
        }

        return NextResponse.json({
            success: true,
            insertedCount,
            message: `${insertedCount} records imported successfully!`,
        });
    } catch (error: any) {
        console.error("Error in POST /api/importActivities:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
