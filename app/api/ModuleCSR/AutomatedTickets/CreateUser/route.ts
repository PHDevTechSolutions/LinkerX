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
    csragent: string,
    referenceid: string,
    salesagentname: string,
    tsm: string,
    ticketreferencenumber: string,
    companyname: string,
    contactperson: string,
    contactnumber: string,
    emailaddress: string,
    address: string,
    status: string,
    wrapup: string,
    inquiries: string,
    typeclient: string
) {
    try {
        if (!referenceid) {
            throw new Error("Company Name and Type of Client are required.");
        }

        // Get current timestamp in Manila time
        const dateCreated = new Intl.DateTimeFormat("en-PH", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: "Asia/Manila",
        }).format(new Date());

        const result = await sql`
            INSERT INTO inquiries (csragent, referenceid, salesagentname, tsm, ticketreferencenumber, companyname, contactperson, contactnumber, emailaddress, address, status, wrapup, inquiries, typeclient, date_created) 
            VALUES (${csragent}, ${referenceid}, ${salesagentname}, ${tsm}, ${ticketreferencenumber}, ${companyname}, ${contactperson}, ${contactnumber}, ${emailaddress}, ${address}, ${status}, ${wrapup}, ${inquiries}, ${typeclient}, ${dateCreated}) 
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
        const { csragent, referenceid, salesagentname, tsm, ticketreferencenumber, companyname, contactperson, contactnumber, emailaddress, address, status, wrapup, inquiries, typeclient } = body;

        // Call the addUser function
        const result = await addUser(csragent, referenceid, salesagentname, tsm, ticketreferencenumber, companyname, contactperson, contactnumber, emailaddress, address, status, wrapup, inquiries, typeclient);

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
