import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.TASKFLOW_DB_URL;
if (!databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

async function updateUser(userDetails: any) {
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
    const updateResult = await sql`
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

    if (updateResult.length === 0) {
      return { success: false, error: "Activity not found or already updated." };
    }

    return { success: true, data: updateResult };
  } catch (error: any) {
    console.error("Error updating user:", error);
    return { success: false, error: error.message || "Failed to update activity." };
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Activity ID is required for update." },
        { status: 400 }
      );
    }

    const result = await updateUser(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in PUT /api/ModuleSales/Task/EditProgress:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
