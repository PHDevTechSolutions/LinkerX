import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

/**
 * Updates an existing user in the database and inserts progress and notification.
 * @param userDetails - The updated details of the user.
 * @returns Success or error response.
 */
async function updateUser(userDetails: any) {
    try {
        const {
            id, referenceid, manager, tsm, companyname, contactperson, contactnumber, emailaddress, typeclient,
            address, area, projectname, projectcategory, projecttype, source, startdate, enddate, activitynumber,
            typeactivity, activitystatus, remarks, callback, typecall, quotationnumber, quotationamount,
            sonumber, soamount, callstatus, actualsales, targetquota, ticketreferencenumber, wrapup, inquiries,
        } = userDetails;

        // ✅ Update the activity table
        const updateResult = await sql`
            UPDATE activity
            SET contactperson = ${contactperson}, contactnumber = ${contactnumber}, emailaddress = ${emailaddress}, 
            typeclient = ${typeclient}, address = ${address}, area = ${area}, projectname = ${projectname}, 
            projectcategory = ${projectcategory}, projecttype = ${projecttype}, source = ${source}, 
            activitystatus = ${activitystatus}, date_updated = CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'
            WHERE id = ${id}
            RETURNING *;
        `;

        if (updateResult.length === 0) {
            return { success: false, error: "User not found or already updated." };
        }

        // ✅ Insert all fields including ticketreferencenumber, wrapup, and inquiries into the progress table
        await sql`
            INSERT INTO progress (
                ticketreferencenumber, wrapup, inquiries, referenceid, manager, tsm, companyname, contactperson, 
                contactnumber, emailaddress, typeclient, address, area, projectname, projectcategory, projecttype, 
                source, startdate, enddate, activitynumber, typeactivity, activitystatus, remarks, callback, 
                typecall, quotationnumber, quotationamount, sonumber, soamount, callstatus, date_created, 
                actualsales, targetquota
            ) VALUES (
                ${ticketreferencenumber}, ${wrapup}, ${inquiries}, ${referenceid}, ${manager}, ${tsm}, 
                ${companyname}, ${contactperson}, ${contactnumber}, ${emailaddress}, ${typeclient}, ${address}, 
                ${area}, ${projectname}, ${projectcategory}, ${projecttype}, ${source}, ${startdate}, ${enddate}, 
                ${activitynumber}, ${typeactivity}, ${activitystatus}, ${remarks}, ${callback}, ${typecall}, 
                ${quotationnumber}, ${quotationamount}, ${sonumber}, ${soamount}, ${callstatus}, 
                CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila', ${actualsales}, ${targetquota}
            );
        `;

        // ✅ CASE 1: Insert Callback Notification if applicable
        if ((typeactivity === "Outbound Call" || typeactivity === "Inbound Call") && callback) {
            const callbackMessage = `You have a callback in "${companyname}". Please make a call or activity.`;

            await sql`
                INSERT INTO notification (referenceid, manager, tsm, message, callback, date_created, type)
                VALUES (
                    ${referenceid}, ${manager}, ${tsm}, ${callbackMessage}, ${callback}, 
                    CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila', 'Callback Notification'
                );
            `;
        }

        // ✅ CASE 2: Insert Follow-Up Notification if applicable
        if (typecall === "Ringing Only" || typecall === "No Requirement") {
            const followUpMessage = `You have a new Follow-Up from "${companyname}". Please make an update.`;

            await sql`
                INSERT INTO notification (referenceid, manager, tsm, message, date_created, type)
                VALUES (
                    ${referenceid}, ${manager}, ${tsm}, ${followUpMessage}, 
                    CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila', 'Follow-Up Notification'
                );
            `;
        }

        return { success: true, data: updateResult };
    } catch (error: any) {
        console.error("Error updating user:", error);
        return { success: false, error: error.message || "Failed to update user." };
    }
}

/**
 * Handles PUT requests for updating users.
 * @param req - The incoming request.
 * @returns Success or error response.
 */
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;

        // ✅ Ensure the ID is provided for the update operation
        if (!id) {
            return NextResponse.json(
                { success: false, error: "User ID is required for update." },
                { status: 400 }
            );
        }

        const result = await updateUser(body);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in PUT /api/ModuleSales/Task/DailyActivity/UpdateUser:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
