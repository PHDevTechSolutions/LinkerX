import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure TASKFLOW_DB_URL is defined
const databaseUrl = process.env.TASKFLOW_DB_URL;
if (!databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
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
    status: string
) {
    try {
        const result = await sql`
            INSERT INTO accounts (referenceid, manager, tsm, companyname, contactperson, contactnumber, emailaddress, typeclient, address, area, status, date_created) 
            VALUES (${referenceid}, ${manager}, ${tsm}, ${companyname}, ${contactperson}, ${contactnumber}, ${emailaddress}, ${typeclient}, ${address}, ${area}, ${status}, NOW()) 
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
        // Parse the request body as JSON
        const body = await req.json();
        const { referenceid, tsm, data } = body;

        if (!referenceid || !tsm || !data || data.length === 0) {
            return NextResponse.json(
                { success: false, error: "Missing referenceid, tsm, or data." },
                { status: 400 }
            );
        }

        // Insert each record from the parsed data into the database
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
                account.status,
            );

            if (result.success) {
                insertedCount++;
            } else {
                console.error("Failed to insert account:", result.error);
            }
        }

        return NextResponse.json({
            success: true,
            insertedCount, // Return number of successfully inserted records
            message: `${insertedCount} records imported successfully!`,
        });
    } catch (error: any) {
        console.error("Error in POST /api/importAccounts:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
