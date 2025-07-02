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
      referenceid, manager, tsm, companyname, contactperson,
<<<<<<< HEAD
      contactnumber, emailaddress, typeclient, address, deliveryaddress, area,
      projectname, projectcategory, projecttype, source, typeactivity,
      callback, callstatus, typecall, remarks, quotationnumber,
      quotationamount, sonumber, soamount, startdate, enddate,
      activitystatus, activitynumber, targetquota, status, companygroup,
=======
      contactnumber, emailaddress, typeclient, address, area,
      projectname, projectcategory, projecttype, source, typeactivity,
      callback, callstatus, typecall, remarks, quotationnumber,
      quotationamount, sonumber, soamount, startdate, enddate,
      activitystatus, activitynumber, targetquota,
>>>>>>> 2b204b1d32bfd8c4242ab86a70eb5c3ae5e2ac1a
    } = data;

    if (!companyname || !typeclient) {
      throw new Error("Company Name and Type of Client are required.");
    }

<<<<<<< HEAD
    // Check if company already exists
    const checkQuery = `
      SELECT * FROM accounts
      WHERE companyname = $1
      LIMIT 1;
    `;
    const existingAccount = await Xchire_sql(checkQuery, [companyname]);
    const accountExists = existingAccount.length > 0;

    // Insert into activity table
    const activityColumns = [
      "referenceid", "manager", "tsm", "companyname", "contactperson",
      "contactnumber", "emailaddress", "typeclient", "address", "deliveryaddress", "area",
      "projectname", "projectcategory", "projecttype", "source",
=======
    // ✅ Check if company already exists based on companyname AND referenceid
    const checkQuery = `
      SELECT * FROM accounts
      WHERE companyname = $1 AND referenceid = $2
      LIMIT 1;
    `;
    const checkValues = [companyname, referenceid];
    const existingAccount = await Xchire_sql(checkQuery, checkValues);
    const accountExists = existingAccount.length > 0;

    // ✅ Insert into activity table
    const activityColumns = [
      "referenceid", "manager", "tsm", "companyname", "contactperson",
      "contactnumber", "emailaddress", "typeclient", "address", "area",
      "projectname", "projectcategory", "projecttype", "source", 
>>>>>>> 2b204b1d32bfd8c4242ab86a70eb5c3ae5e2ac1a
      "activitystatus", "activitynumber", "targetquota"
    ];
    const activityValues = [
      referenceid, manager, tsm, companyname, contactperson,
<<<<<<< HEAD
      contactnumber, emailaddress, typeclient, address, deliveryaddress, area,
=======
      contactnumber, emailaddress, typeclient, address, area,
>>>>>>> 2b204b1d32bfd8c4242ab86a70eb5c3ae5e2ac1a
      projectname, projectcategory, projecttype, source,
      activitystatus || null, activitynumber || null, targetquota || null
    ];
    const activityPlaceholders = activityValues.map((_, i) => `$${i + 1}`).join(", ");
    const activityQuery = `
<<<<<<< HEAD
      INSERT INTO activity (${activityColumns.join(", ")}, date_created)
      VALUES (${activityPlaceholders}, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila')
=======
      INSERT INTO activity (${activityColumns.join(", ")}, date_created) 
      VALUES (${activityPlaceholders}, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila') 
>>>>>>> 2b204b1d32bfd8c4242ab86a70eb5c3ae5e2ac1a
      RETURNING *;
    `;
    const activityResult = await Xchire_sql(activityQuery, activityValues);
    const insertedActivity = activityResult[0];

    if (!insertedActivity) {
      throw new Error("Failed to insert into activity table.");
    }

    const newActivityNumber = insertedActivity.activitynumber;

<<<<<<< HEAD
    // Insert into accounts table if company is new
=======
    // ✅ Insert into accounts table only if account does NOT exist
>>>>>>> 2b204b1d32bfd8c4242ab86a70eb5c3ae5e2ac1a
    if (!accountExists) {
      const accountsQuery = `
        INSERT INTO accounts (
          referenceid, manager, tsm, companyname, contactperson,
<<<<<<< HEAD
          contactnumber, emailaddress, typeclient, address, deliveryaddress, area, status, companygroup, date_created
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'
=======
          contactnumber, emailaddress, typeclient, address, area, status, date_created
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10, 'Active', CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'
>>>>>>> 2b204b1d32bfd8c4242ab86a70eb5c3ae5e2ac1a
        ) RETURNING *;
      `;
      const accountsValues = [
        referenceid, manager, tsm, companyname, contactperson,
<<<<<<< HEAD
        contactnumber, emailaddress, typeclient, address, deliveryaddress, area,
        status, companygroup
=======
        contactnumber, emailaddress, typeclient, address, area
>>>>>>> 2b204b1d32bfd8c4242ab86a70eb5c3ae5e2ac1a
      ];
      const accountsResult = await Xchire_sql(accountsQuery, accountsValues);

      if (!accountsResult[0]) {
        throw new Error("Failed to insert into accounts table.");
      }
    }

<<<<<<< HEAD
    // Update date_updated if callback has value
    if (callback && accountExists) {
      const updateCallbackQuery = `
        UPDATE accounts
        SET date_updated = $1
        WHERE companyname = $2;
      `;
      await Xchire_sql(updateCallbackQuery, [callback, companyname]);
    }

    // Insert into progress table
    const progressColumns = [
      ...activityColumns,
      "typeactivity", "callback", "callstatus", "typecall",
      "remarks", "quotationnumber", "quotationamount", "sonumber", "soamount",
=======
    // ✅ Insert into progress table
    const progressColumns = [
      ...activityColumns,
      "typeactivity", "callback", "callstatus", "typecall", 
      "remarks", "quotationnumber", "quotationamount", "sonumber", "soamount", 
>>>>>>> 2b204b1d32bfd8c4242ab86a70eb5c3ae5e2ac1a
      "startdate", "enddate"
    ];
    const progressValues = [
      ...activityValues,
      typeactivity, callback || null, callstatus || null, typecall || null,
      remarks || null, quotationnumber || null, quotationamount || null,
      sonumber || null, soamount || null, startdate || null, enddate || null
    ];
<<<<<<< HEAD

    // Update activitynumber value for progress insert
    progressValues[progressColumns.indexOf("activitynumber")] = newActivityNumber;

=======
    progressValues[progressColumns.indexOf("activitynumber")] = newActivityNumber;
>>>>>>> 2b204b1d32bfd8c4242ab86a70eb5c3ae5e2ac1a
    const progressPlaceholders = progressValues.map((_, i) => `$${i + 1}`).join(", ");
    const progressQuery = `
      INSERT INTO progress (${progressColumns.join(", ")}, date_created)
      VALUES (${progressPlaceholders}, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila')
      RETURNING *;
    `;
    const progressResult = await Xchire_sql(progressQuery, progressValues);

    if (!progressResult[0]) {
      throw new Error("Failed to insert into progress table.");
    }

    return {
      success: true,
      activity: insertedActivity,
      progress: progressResult[0],
      accountExists
    };
  } catch (error: any) {
    console.error("Error inserting activity, accounts, and progress:", error);
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
