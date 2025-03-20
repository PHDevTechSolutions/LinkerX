import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure DATABASE_URL is defined
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

// Create a reusable Neon database connection function
const sql = neon(databaseUrl);

const generateActivityNumber = (companyname: string, referenceid: string) => {
    const firstLetter = companyname.charAt(0).toUpperCase();
    const firstTwoRef = referenceid.substring(0, 2).toUpperCase();

    const now = new Date();
    const formattedDate = now
        .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
        })
        .replace("/", "");

    const randomNumber = String(Math.floor(100000 + Math.random() * 900000)).slice(0, 6);

    const generatedNumber = `${firstLetter}-${firstTwoRef}-${formattedDate}-${randomNumber}`;
    return generatedNumber;
};

async function addUser(data: any) {
    try {
        const {
            ticketreferencenumber,
            referenceid,
            tsm,
            companyname,
            contactperson,
            contactnumber,
            emailaddress,
            address,
            wrapup,
            inquiries,
            remarks,
            targetquota, // ✅ Added targetquota
            csragent,
        } = data;

        // Validate required fields
        if (!companyname || !referenceid) {
            return { success: false, error: "Company Name and Reference ID are required." };
        }

        // Generate the activity number
        const activitynumber = generateActivityNumber(companyname, referenceid);

        // ✅ Insert into activity table
        const activityColumns = [
            "ticketreferencenumber",
            "referenceid",
            "tsm",
            "companyname",
            "contactperson",
            "contactnumber",
            "emailaddress",
            "address",
            "wrapup",
            "inquiries",
            "activitystatus",
            "typeclient",
            "activitynumber",
            "targetquota", // ✅ Added targetquota
            "csragent",
        ];

        const activityValues = [
            ticketreferencenumber,
            referenceid,
            tsm,
            companyname,
            contactperson,
            contactnumber,
            emailaddress,
            address,
            wrapup,
            inquiries,
            "Cold",
            "CSR Inquiries",
            activitynumber,
            targetquota || "0", // ✅ Default to "0" if targetquota is not provided
            csragent || null,
        ];

        const activityPlaceholders = activityValues.map((_, index) => `$${index + 1}`).join(", ");
        const activityQuery = `
            INSERT INTO activity (${activityColumns.join(", ")}, date_created) 
            VALUES (${activityPlaceholders}, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila') 
            RETURNING *;
        `;

        const activityResult = await sql(activityQuery, activityValues);
        if (!activityResult || activityResult.length === 0) {
            return { success: false, error: "Failed to insert into activity table." };
        }

        // ✅ Insert into progress table with typeactivity, remarks, and targetquota
        const progressColumns = [
            "ticketreferencenumber",
            "referenceid",
            "tsm",
            "companyname",
            "contactperson",
            "contactnumber",
            "emailaddress",
            "address",
            "wrapup",
            "inquiries",
            "activitynumber",
            "typeclient",
            "activitystatus",
            "remarks",
            "typeactivity",
            "targetquota", // ✅ Added targetquota
            "csragent",
        ];

        const progressValues = [
            ticketreferencenumber,
            referenceid,
            tsm,
            companyname,
            contactperson,
            contactnumber,
            emailaddress,
            address,
            wrapup,
            inquiries,
            activitynumber,
            "CSR Inquiries",
            "Cold",
            remarks || "N/A",
            "CSR Inquiries",
            targetquota || "0", // ✅ Default to "0" if targetquota is not provided
            csragent,
        ];

        const progressPlaceholders = progressValues.map((_, index) => `$${index + 1}`).join(", ");
        const progressQuery = `
            INSERT INTO progress (${progressColumns.join(", ")}, date_created) 
            VALUES (${progressPlaceholders}, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila') 
            RETURNING *;
        `;

        const progressResult = await sql(progressQuery, progressValues);
        if (!progressResult || progressResult.length === 0) {
            return { success: false, error: "Failed to insert into progress table." };
        }

        // ✅ Update inquiries table status to "Used"
        const updateQuery = `
            UPDATE inquiries 
            SET status = 'Used', date_updated = CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila' 
            WHERE ticketreferencenumber = $1
        `;

        await sql(updateQuery, [ticketreferencenumber]);

        return { success: true, data: { activity: activityResult[0], progress: progressResult[0] } };
    } catch (error: any) {
        console.error("Error inserting activity, progress, and updating inquiries:", error);
        return { success: false, error: error.message || "Failed to process request." };
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = await addUser(body);

        return NextResponse.json(result, { status: result.success ? 200 : 400 });
    } catch (error: any) {
        console.error("Error in POST /api/addActivity:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
