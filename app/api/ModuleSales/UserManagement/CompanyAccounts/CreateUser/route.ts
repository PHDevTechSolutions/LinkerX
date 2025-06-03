import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure TASKFLOW_DB_URL is defined
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Create a reusable Neon database connection function
const Xchire_sql = neon(Xchire_databaseUrl);

async function create(
    referenceid: string,
    manager: string,
    tsm: string,
    companyname: string, 
    contactperson: string,
    contactnumber: string,
    emailaddress: string,
    typeclient: string,
    companygroup: string,
    address: string,
    deliveryaddress: string,
    area: string,
    status: string,
) {
    try {
        if (!companyname || !typeclient) {
            throw new Error("Company Name and Type of Client are required.");
        }

        const Xchire_insert = await Xchire_sql`
            INSERT INTO accounts (referenceid, manager, tsm, companyname, contactperson, contactnumber, emailaddress, typeclient, companygroup, address, deliveryaddress, area, status, date_created) 
            VALUES (${referenceid}, ${manager}, ${tsm}, ${companyname}, ${contactperson}, ${contactnumber}, ${emailaddress}, ${typeclient}, ${companygroup}, ${address}, ${deliveryaddress}, ${area}, ${status}, NOW()) 
            RETURNING *;
        `;

        return { success: true, data: Xchire_insert };
    } catch (error: any) {
        console.error("Error inserting task:", error);
        return { success: false, error: error.message || "Failed to add task." };
    }
}

export async function POST(req: Request) {
    try {
        // Ensure request body is valid JSON
        const Xchire_body = await req.json();
        const { referenceid, manager, tsm, companyname, contactperson, contactnumber, emailaddress, typeclient, companygroup, address, deliveryaddress, area, status } = Xchire_body;

        // Call the addUser function
        const Xchire_result = await create(referenceid, manager, tsm, companyname, contactperson, contactnumber, emailaddress, typeclient, companygroup, address, deliveryaddress, area, status);

        // Return response
        return NextResponse.json(Xchire_result);
    } catch (Xchire_error: any) {
        console.error("Error in POST /api/addTask:", Xchire_error);
        return NextResponse.json(
            { success: false, error: Xchire_error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
