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
    activitynumber: string,
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
    typeactivity: string,
    callback: string,
    callstatus: string,
    typecall: string,
    remarks: string,
    quotationnumber: string,
    quotationamount: any, // Change type to 'any' to handle both strings and numbers
    sonumber: string,
    soamount: any, // Change type to 'any' to handle both strings and numbers
    startdate: string,
    enddate: string,
    activitystatus: string,
    actualsales: any, // Change type to 'any' to handle both strings and numbers
    targetquota: string,
) {
    try {
        // Parse the numeric fields to integers
        const parsedQuotationAmount = parseInt(quotationamount, 10) || 0; // Default to 0 if NaN
        const parsedSoAmount = parseInt(soamount, 10) || 0; // Default to 0 if NaN
        const parsedActualSales = parseInt(actualsales, 10) || 0; // Default to 0 if NaN

        // Log the data to verify it's being passed correctly
        console.log('Inserting data:', {
            referenceid, manager, tsm, activitynumber, companyname, contactperson, 
            contactnumber, emailaddress, typeclient, address, area, projectname, 
            projectcategory, projecttype, source, typeactivity, callback, callstatus, 
            typecall, remarks, quotationnumber, parsedQuotationAmount, sonumber, 
            parsedSoAmount, startdate, enddate, activitystatus, parsedActualSales, targetquota
        });

        const result = await sql`
            INSERT INTO progress 
            (referenceid, manager, tsm, activitynumber, companyname, contactperson, contactnumber, emailaddress, typeclient, 
            address, area, projectname, projectcategory, projecttype, source, typeactivity, callback, 
            callstatus, typecall, remarks, quotationnumber, quotationamount, sonumber, soamount, startdate, 
            enddate, activitystatus, actualsales, targetquota, date_created) 
            VALUES 
            (${referenceid}, ${manager}, ${tsm}, ${activitynumber}, ${companyname}, ${contactperson}, ${contactnumber}, 
            ${emailaddress}, ${typeclient}, ${address}, ${area}, ${projectname}, ${projectcategory}, ${projecttype}, 
            ${source}, ${typeactivity}, ${callback}, ${callstatus}, ${typecall}, ${remarks}, 
            ${quotationnumber}, ${parsedQuotationAmount}, ${sonumber}, ${parsedSoAmount}, ${startdate}, ${enddate}, 
            ${activitystatus}, ${parsedActualSales}, ${targetquota}, ${startdate})  -- Set date_created to startdate
            RETURNING *;
        `;

        return { success: true, data: result };
    } catch (error: any) {
        // Log the error for more detailed debugging
        console.error("Error inserting account:", error);
        return { success: false, error: error.message || "Failed to add account." };
    }
}

// POST request handler
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { referenceid, tsm, data } = body;

        // Validate the required fields
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
                account.manager,
                account.tsm,
                account.activitynumber,
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
                account.typeactivity,
                account.callback,
                account.callstatus,
                account.typecall,
                account.remarks,
                account.quotationnumber,
                account.quotationamount,
                account.sonumber,
                account.soamount,
                account.startdate,
                account.enddate,
                account.activitystatus,
                account.actualsales,
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
        console.error("Error in POST /api/importProgress:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
