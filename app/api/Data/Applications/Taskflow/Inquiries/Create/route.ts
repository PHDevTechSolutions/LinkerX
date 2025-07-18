import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}
const Xchire_sql = neon(Xchire_databaseUrl);

export async function POST(req: NextRequest) {
  try {
    const {
      csragent, referenceid, tsm, ticketreferencenumber,
      companyname, contactperson, contactnumber, emailaddress,
      typeclient, address, status, wrapup, inquiries,
    } = await req.json();

    await Xchire_sql`
      INSERT INTO inquiries (
        csragent, referenceid, tsm, ticketreferencenumber,
        companyname, contactperson, contactnumber, emailaddress,
        typeclient, address, status, wrapup, inquiries
      ) VALUES (
        ${csragent}, ${referenceid}, ${tsm}, ${ticketreferencenumber},
        ${companyname}, ${contactperson}, ${contactnumber}, ${emailaddress},
        ${typeclient}, ${address}, ${status}, ${wrapup}, ${inquiries}
      )
    `;

    return NextResponse.json({ success: true, message: "Inquiry successfully created." }, { status: 201 });
  } catch (Xchire_error: any) {
    console.error("Create Inquiry Error:", Xchire_error);
    return NextResponse.json(
      { success: false, error: Xchire_error.message || "Failed to create inquiry." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
