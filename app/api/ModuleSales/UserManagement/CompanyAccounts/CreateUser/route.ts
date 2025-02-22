import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure DATABASE_URL is defined
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

// Create a reusable Neon database connection function
const sql = neon(databaseUrl);

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
    status: string,
) {
    try {
        if (!companyname || !typeclient) {
            throw new Error("Company Name and Type of Client are required.");
        }

        const result = await sql`
            INSERT INTO accounts (referenceid, manager, tsm, companyname, contactperson, contactnumber, emailaddress, typeclient, address, area, status, date_created) 
            VALUES (${referenceid}, ${manager}, ${tsm}, ${companyname}, ${contactperson}, ${contactnumber}, ${emailaddress}, ${typeclient}, ${address}, ${area}, ${status}, NOW()) 
            RETURNING *;
        `;

        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error inserting task:", error);
        return { success: false, error: error.message || "Failed to add task." };
    }
}

export async function POST(req: Request) {
    try {
        // Ensure request body is valid JSON
        const body = await req.json();
        const { referenceid, manager, tsm, companyname, contactperson, contactnumber, emailaddress, typeclient, address, area, status } = body;

        // Call the addUser function
        const result = await addUser(referenceid, manager, tsm, companyname, contactperson, contactnumber, emailaddress, typeclient, address, area, status);

        // Return response
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in POST /api/addTask:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
