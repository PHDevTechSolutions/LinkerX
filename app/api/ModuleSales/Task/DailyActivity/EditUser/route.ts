import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);
/**
 * Updates an existing user in the database and inserts progress and notification.
 * @param userDetails - The updated details of the user.
 * @returns Success or error response.
 */
async function update(userDetails: any) {
  try {
    const {
      id, referenceid, manager,
      tsm, companyname, companygroup, contactperson,
      contactnumber, emailaddress, typeclient,
      address, deliveryaddress, area, projectname,
      projectcategory, projecttype, source,
      startdate, enddate, activitynumber,
      typeactivity, activitystatus, remarks,
      callback, typecall, quotationnumber,
      quotationamount, sonumber, soamount,
      callstatus, actualsales, targetquota,
      ticketreferencenumber, wrapup, inquiries,
      csragent, paymentterm, deliverydate,
    } = userDetails;

    // ✅ Update the activity table
    const Xchire_update = await Xchire_sql`
      UPDATE activity
      SET companygroup = ${companygroup}, contactperson = ${contactperson}, contactnumber = ${contactnumber}, emailaddress = ${emailaddress},
      typeclient = ${typeclient}, address = ${address}, deliveryaddress = ${deliveryaddress}, area = ${area}, projectname = ${projectname},
      projectcategory = ${projectcategory}, projecttype = ${projecttype}, source = ${source},
      activitystatus = ${activitystatus}, date_updated = CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'
      WHERE id = ${id}
      RETURNING *;
    `;

    if (Xchire_update.length === 0) {
      return { success: false, error: "User not found or already updated." };
    }

    // ✅ Insert all fields including ticketreferencenumber, wrapup, inquiries, and csragent into the progress table
    await Xchire_sql`
      INSERT INTO progress (
        ticketreferencenumber, wrapup, inquiries, referenceid, manager, tsm, companyname, companygroup, contactperson,
        contactnumber, emailaddress, typeclient, address, deliveryaddress, area, projectname, projectcategory, projecttype,
        source, startdate, enddate, activitynumber, typeactivity, activitystatus, remarks, callback,
        typecall, quotationnumber, quotationamount, sonumber, soamount, callstatus, date_created,
        actualsales, targetquota, csragent, paymentterm, deliverydate
      ) VALUES (
        ${ticketreferencenumber}, ${wrapup}, ${inquiries}, ${referenceid}, ${manager}, ${tsm},
        ${companyname}, ${companygroup}, ${contactperson}, ${contactnumber}, ${emailaddress}, ${typeclient}, ${address}, ${deliveryaddress},
        ${area}, ${projectname}, ${projectcategory}, ${projecttype}, ${source}, ${startdate}, ${enddate},
        ${activitynumber}, ${typeactivity}, ${activitystatus}, ${remarks}, ${callback}, ${typecall},
        ${quotationnumber}, ${quotationamount}, ${sonumber}, ${soamount}, ${callstatus},
        CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila', ${actualsales}, ${targetquota}, ${csragent}, ${paymentterm}, ${deliverydate}
      );
    `;

    // ✅ CASE 1: Insert Callback Notification if applicable
    if ((typeactivity === "Outbound Call" || typeactivity === "Inbound Call") && callback) {
      const callbackMessage = `You have a callback in "${companyname}". Please make a call or activity.`;

      await Xchire_sql`
        INSERT INTO notification (
          referenceid, manager, tsm, csragent, message, callback, date_created, type
        )
        VALUES (
          ${referenceid}, ${manager}, ${tsm}, 
          ${typeclient === "CSR Inquiries" ? csragent : null}, -- Check CSR Inquiries
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

      await Xchire_sql`
        INSERT INTO notification (
          referenceid, manager, tsm, csragent, message, date_created, type
        )
        VALUES (
          ${referenceid}, ${manager}, ${tsm}, 
          ${typeclient === "CSR Inquiries" ? csragent : null}, -- Check CSR Inquiries
          ${followUpMessage}, 
          CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila', 'Follow-Up Notification'
        );
      `;
    }

    // ✅ CASE 3: Insert CSR Notification if typeclient is CSR Inquiries
    if (typeclient === "CSR Inquiries" && csragent) {
      const csrnotificationMessage = `The Ticket Number "${ticketreferencenumber}" of "${companyname}". and Status is "${typecall}" `;

      await Xchire_sql`
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

    return { success: true, data: Xchire_update };
  } catch (Xchire_error: any) {
    console.error("Error updating user:", Xchire_error);
    return { success: false, error: Xchire_error.message || "Failed to update user." };
  }
}

/**
 * Handles PUT requests for updating users.
 * @param req - The incoming request.
 * @returns Success or error response.
 */
export async function PUT(req: Request) {
  try {
    const Xchire_body = await req.json();
    const { id } = Xchire_body;

    // ✅ Ensure the ID is provided for the update operation
    if (!id) {
      return NextResponse.json(
        { success: false, error: "User ID is required for update." },
        { status: 400 }
      );
    }

    const Xchire_result = await update(Xchire_body);
    return NextResponse.json(Xchire_result);
  } catch (Xchire_error: any) {
    console.error("Error in PUT /api/ModuleSales/Task/DailyActivity/UpdateUser:", Xchire_error);
    return NextResponse.json(
      { success: false, error: Xchire_error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
