import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

async function create(data: any) {
  try {
    const {
      referenceid,
      manager,
      tsm,
      companyname,
      contactperson,
      contactnumber,
      emailaddress,
      typeclient,
      address,
      deliveryaddress,
      area,
      projectname,
      projectcategory,
      projecttype,
      source,
      typeactivity,
      callback,
      callstatus,
      typecall,
      remarks,
      quotationnumber,
      quotationamount,
      sonumber,
      soamount,
      startdate,
      enddate,
      activitystatus,
      activitynumber,
      targetquota,
    } = data;

    if (!companyname || !typeclient) {
      throw new Error("Company Name and Type of Client are required.");
    }

    // Prepare INSERT into activity table
    const activityColumns = [
      "referenceid",
      "manager",
      "tsm",
      "companyname",
      "contactperson",
      "contactnumber",
      "emailaddress",
      "typeclient",
      "address",
      "deliveryaddress",
      "area",
      "projectname",
      "projectcategory",
      "projecttype",
      "source",
      "activitystatus",
      "activitynumber",
      "targetquota"
    ];

    const activityValues = [
      referenceid,
      manager,
      tsm,
      companyname,
      contactperson,
      contactnumber,
      emailaddress,
      typeclient,
      address,
      deliveryaddress,
      area,
      projectname,
      projectcategory,
      projecttype,
      source,
      activitystatus || null,
      activitynumber || null,
      targetquota || null
    ];

    const placeholders = activityValues.map((_, i) => `$${i + 1}`).join(", ");
    const activityQuery = `
      INSERT INTO activity (${activityColumns.join(", ")}, date_created)
      VALUES (${placeholders}, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila')
      RETURNING *;
    `;

    const activityResult = await Xchire_sql(activityQuery, activityValues);
    const insertedActivity = activityResult[0];

    if (!insertedActivity) {
      throw new Error("Failed to insert into activity table.");
    }

    return {
      success: true,
      activity: insertedActivity,
    };

  } catch (error: any) {
    console.error("Error inserting activity:", error);
    return { success: false, error: error.message || "Failed to add records." };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await create(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in POST /api/addActivity:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
