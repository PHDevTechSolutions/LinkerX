import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}
const Xchire_sql = neon(Xchire_databaseUrl);

export async function PUT(req: NextRequest) {
  try {
    const {
      id, // Required to identify the record
      csragent, referenceid, tsm, ticketreferencenumber,
      companyname, contactperson, contactnumber, emailaddress,
      typeclient, address, status, wrapup, inquiries,
    } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing inquiry ID." }, { status: 400 });
    }

    await Xchire_sql`
      UPDATE inquiries SET
        csragent = ${csragent},
        referenceid = ${referenceid},
        tsm = ${tsm},
        ticketreferencenumber = ${ticketreferencenumber},
        companyname = ${companyname},
        contactperson = ${contactperson},
        contactnumber = ${contactnumber},
        emailaddress = ${emailaddress},
        typeclient = ${typeclient},
        address = ${address},
        status = ${status},
        wrapup = ${wrapup},
        inquiries = ${inquiries}
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true, message: "Inquiry successfully updated." }, { status: 200 });
  } catch (Xchire_error: any) {
    console.error("Edit Inquiry Error:", Xchire_error);
    return NextResponse.json(
      { success: false, error: Xchire_error.message || "Failed to update inquiry." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
