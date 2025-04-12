import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.TASKFLOW_DB_URL;
if (!databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
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
      id, referenceid, manager,
      tsm, companyname, contactperson,
      contactnumber, emailaddress, typeclient,
      address, area, projectname,
      projectcategory, projecttype, source,
      startdate, enddate, activitynumber,
      typeactivity, activitystatus, remarks,
      callback, typecall, quotationnumber,
      quotationamount, sonumber, soamount,
      callstatus, actualsales, targetquota,
      ticketreferencenumber, wrapup, inquiries,
      csragent, // ✅ Added csragent
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

    // ✅ Insert all fields including ticketreferencenumber, wrapup, inquiries, and csragent into the progress table
    await sql`
      INSERT INTO progress (
        ticketreferencenumber, wrapup, inquiries, referenceid, manager, tsm, companyname, contactperson,
        contactnumber, emailaddress, typeclient, address, area, projectname, projectcategory, projecttype,
        source, startdate, enddate, activitynumber, typeactivity, activitystatus, remarks, callback,
        typecall, quotationnumber, quotationamount, sonumber, soamount, callstatus, date_created,
        actualsales, targetquota, csragent
      ) VALUES (
        ${ticketreferencenumber}, ${wrapup}, ${inquiries}, ${referenceid}, ${manager}, ${tsm},
        ${companyname}, ${contactperson}, ${contactnumber}, ${emailaddress}, ${typeclient}, ${address},
        ${area}, ${projectname}, ${projectcategory}, ${projecttype}, ${source}, ${startdate}, ${enddate},
        ${activitynumber}, ${typeactivity}, ${activitystatus}, ${remarks}, ${callback}, ${typecall},
        ${quotationnumber}, ${quotationamount}, ${sonumber}, ${soamount}, ${callstatus},
        CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila', ${actualsales}, ${targetquota}, ${csragent}
      );
    `;

    // ✅ CASE 1: Insert Callback Notification if applicable
    if ((typeactivity === "Outbound Call" || typeactivity === "Inbound Call") && callback) {
      const callbackMessage = `You have a callback in "${companyname}". Please make a call or activity.`;

      await sql`
        INSERT INTO notification (
          referenceid, manager, tsm, csragent, message, callback, date_created, type
        )
        VALUES (
          ${referenceid}, ${manager}, ${tsm}, 
          ${typeclient === "CSR Inquiries" ? csragent : null}, -- ✅ Check CSR Inquiries
          ${callbackMessage}, ${callback}, 
          CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila', 'Callback Notification'
        );
      `;
    }

    // ✅ CASE 2: Insert Follow-Up Notification if applicable
    if (
      typecall === "Ringing Only" ||
      typecall === "No Requirements" ||
      typecall === "Sent Quotation - Standard" ||
      typecall === "Sent Quotation - With Special Price" ||
      typecall === "Sent Quotation - With SPF" ||
      typecall === "Not Connected With The Company" ||
      typecall === "Waiting for Projects" ||
      typecall === "Cannot Be Reached"
    ) {
      const followUpMessage = `You have a new follow-up from "${companyname}". The status is "${typecall}". Please make an update.`;

      await sql`
        INSERT INTO notification (
          referenceid, manager, tsm, csragent, message, date_created, type
        )
        VALUES (
          ${referenceid}, ${manager}, ${tsm}, 
          ${typeclient === "CSR Inquiries" ? csragent : null}, -- ✅ Check CSR Inquiries
          ${followUpMessage}, 
          CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila', 'Follow-Up Notification'
        );
      `;
    }

    // ✅ CASE 3: Insert CSR Notification if typeclient is CSR Inquiries
    if (typeclient === "CSR Inquiries" && csragent) {
      const csrnotificationMessage = `The Ticket Number "${ticketreferencenumber}" of "${companyname}". and Status is "${typecall}" `;

      await sql`
        INSERT INTO notification (
          referenceid, manager, tsm, csragent, message, date_created, type
        )
        VALUES (
          ${referenceid}, ${manager}, ${tsm}, ${csragent}, 
          ${csrnotificationMessage},
          CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila', 'CSR Notification'
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
