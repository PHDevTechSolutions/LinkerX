import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

async function update(userDetails: any) {
  try {
    const {
      id,
      callstatus,
      typecall,
      quotationnumber,
      quotationamount,
      soamount,
      sonumber,
      actualsales,
      remarks,
      activitystatus,
    } = userDetails;

    // ✅ Update only editable fields
    const Xchire_update = await Xchire_sql`
      UPDATE progress
      SET 
        callstatus = ${callstatus},
        typecall = ${typecall},
        quotationnumber = ${quotationnumber},
        quotationamount = ${quotationamount},
        soamount = ${soamount},
        sonumber = ${sonumber},
        actualsales = ${actualsales},
        remarks = ${remarks},
        activitystatus = ${activitystatus}
      WHERE id = ${id}
      RETURNING *;
    `;

    if (Xchire_update.length === 0) {
      return { success: false, error: "Activity not found or already updated." };
    }

    return { success: true, data: Xchire_update };
  } catch (error: any) {
    console.error("Error updating user:", error);
    return { success: false, error: error.message || "Failed to update activity." };
  }
}

export async function PUT(req: Request) {
  try {
    const Xchire_body = await req.json();
    const { id } = Xchire_body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Activity ID is required for update." },
        { status: 400 }
      );
    }

    const Xchire_result = await update(Xchire_body);
    return NextResponse.json(Xchire_result);
  } catch (Xchire_error: any) {
    console.error("Error in PUT /api/ModuleSales/Task/EditProgress:", Xchire_error);
    return NextResponse.json(
      { success: false, error: Xchire_error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
