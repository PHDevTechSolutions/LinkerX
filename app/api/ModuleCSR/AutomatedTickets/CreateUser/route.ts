// API route for adding an inquiry and creating a notification
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

//Get the database URL from environment variables and ensure it's defined
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Initialize reusable Neon database connection
const Xchire_sql = neon(Xchire_databaseUrl);

// Insert inquiry data and trigger a notification
async function create(
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

        // Insert inquiry record into the database
        const Xchire_insert = await Xchire_sql`
            INSERT INTO inquiries (csragent, referenceid, salesagentname, tsm, ticketreferencenumber, companyname, contactperson, contactnumber, emailaddress, address, status, wrapup, inquiries, typeclient, date_created) 
            VALUES (${csragent}, ${referenceid}, ${salesagentname}, ${tsm}, ${ticketreferencenumber}, ${companyname}, ${contactperson}, ${contactnumber}, ${emailaddress}, ${address}, ${status}, ${wrapup}, ${inquiries}, ${typeclient}, ${dateCreated}) 
            RETURNING *;
        `;

        // Compose notification message for TSM
        const notificationMessage = `You have a new inquiry from "${companyname}" from CSR Department.`;

        // Insert the inquiry notification
        await Xchire_sql`
            INSERT INTO notification (referenceid, tsm, date_created, message, type)
            VALUES (
                ${referenceid}, ${tsm}, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila',
                ${notificationMessage}, 'Inquiry Notification'
            );
        `;

        return { success: true, data: Xchire_insert };
    } catch (Xchire_error: any) {
        console.error("Error inserting inquiry:", Xchire_error);
        return {
            success: false,
            error: Xchire_error.message || "Failed to add inquiry.",
        };
    }
}

// Handle POST request to insert a new inquiry and notify relevant personnel
export async function POST(Xchire_req: Request) {
    try {
        // Ensure request body is valid JSON
        const Xchire_body = await Xchire_req.json();
        const { csragent, referenceid, salesagentname, tsm, ticketreferencenumber, companyname, contactperson, contactnumber, emailaddress, address, status, wrapup, inquiries, typeclient } = Xchire_body;

        // Call the addUser function
        const Xchire_result = await create(csragent, referenceid, salesagentname, tsm, ticketreferencenumber, companyname, contactperson, contactnumber, emailaddress, address, status, wrapup, inquiries, typeclient);

        // Return response
        return NextResponse.json(Xchire_result);
    } catch (Xchire_error: any) {
        console.error("Error in POST /api/addInquiry:", Xchire_error);
        return NextResponse.json(
            {
                success: false,
                error: Xchire_error.message || "Internal Server Error"
            },
            { status: 500 }
        );
    }
}
