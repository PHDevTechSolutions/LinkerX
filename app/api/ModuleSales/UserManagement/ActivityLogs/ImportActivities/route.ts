import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure DATABASE_URL is defined
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Create a reusable Neon database connection function
const Xchire_sql = neon(Xchire_databaseUrl);

// Function to insert user data into the database
async function create(
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
        const Xchire_insert = await Xchire_sql`
            INSERT INTO activity (referenceid, manager, tsm, companyname, contactperson, contactnumber, emailaddress, typeclient, address, area, 
            projectname, projectcategory, projecttype, source, date_created, activitystatus, activitynumber, targetquota) 
            VALUES (${referenceid}, ${manager}, ${tsm}, ${companyname}, ${contactperson}, ${contactnumber}, ${emailaddress}, ${typeclient}, 
            ${address}, ${area}, ${projectname}, ${projectcategory}, ${projecttype}, ${source}, ${date_created}, ${activitystatus}, ${activitynumber}, ${targetquota})
            RETURNING *;
        `;

        return { success: true, data: Xchire_insert };
    } catch (error: any) {
        console.error("Error inserting account:", error);
        return { success: false, error: error.message || "Failed to add account." };
    }
}

// POST request handler
export async function POST(req: Request) {
    try {
        const Xchire_body = await req.json();
        const { referenceid, tsm, data } = Xchire_body;

        if (!referenceid || !tsm || !data || data.length === 0) {
            return NextResponse.json(
                { success: false, error: "Missing referenceid, tsm, or data." },
                { status: 400 }
            );
        }

        let insertedCount = 0;
        for (const account of data) {
            const result = await create(
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
    } catch (Xchire_error: any) {
        console.error("Error in POST /api/importActivities:", Xchire_error);
        return NextResponse.json(
            { success: false, error: Xchire_error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
