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
            contactnumber, emailaddress, typeclient, address, area,
            projectname, projectcategory, projecttype, source, typeactivity,
            callback, callstatus, typecall, remarks, quotationnumber,
            quotationamount, sonumber, soamount, startdate, enddate,
            activitystatus, activitynumber, targetquota,
        } = data;

        if (!companyname || !typeclient) {
            throw new Error("Company Name and Type of Client are required.");
        }

        // Check if account already exists
        const checkQuery = `
            SELECT * FROM accounts
            WHERE companyname = $1 AND contactnumber = $2 AND contactperson = $3
              AND emailaddress = $4 AND typeclient = $5 AND address = $6 AND area = $7
            LIMIT 1;
        `;
        const checkValues = [
            companyname, contactnumber, contactperson, emailaddress, typeclient, address, area
        ];
        const existingAccount = await Xchire_sql(checkQuery, checkValues);
        const accountExists = existingAccount.length > 0;

        // Insert into activity
        const Xchire_activityColumns = [
            "referenceid", "manager", "tsm", "companyname", "contactperson",
            "contactnumber", "emailaddress", "typeclient", "address", "area",
            "projectname", "projectcategory", "projecttype", "source", 
            "activitystatus", "activitynumber", "targetquota",
        ];

        const Xchire_activityValues = [
            referenceid, manager, tsm, companyname, contactperson,
            contactnumber, emailaddress, typeclient, address, area,
            projectname, projectcategory, projecttype, source,
            activitystatus || null, activitynumber || null, targetquota || null
        ];

        const Xchire_activityPlaceholders = Xchire_activityValues.map((_, i) => `$${i + 1}`).join(", ");
        const Xchire_activityQuery = `
            INSERT INTO activity (${Xchire_activityColumns.join(", ")}, date_created) 
            VALUES (${Xchire_activityPlaceholders}, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila') 
            RETURNING *;
        `;
        const Xchire_activityResult = await Xchire_sql(Xchire_activityQuery, Xchire_activityValues);
        const Xchire_insertedActivity = Xchire_activityResult[0];

        if (!Xchire_insertedActivity) {
            throw new Error("Failed to insert into activity table.");
        }

        const Xchire_newActivityNumber = Xchire_insertedActivity.activitynumber;

        // Insert into accounts only if not existing
        if (!accountExists) {
            const Xchire_accountsQuery = `
                INSERT INTO accounts (
                    referenceid, manager, tsm, companyname, contactperson,
                    contactnumber, emailaddress, typeclient, address, area, status, date_created
                ) VALUES (
                    $1, $2, $3, $4, $5,
                    $6, $7, $8, $9, $10, 'Active', CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'
                ) RETURNING *;
            `;

            const Xchire_accountsValues = [
                referenceid, manager, tsm, companyname, contactperson,
                contactnumber, emailaddress, typeclient, address, area
            ];

            const Xchire_accountsResult = await Xchire_sql(Xchire_accountsQuery, Xchire_accountsValues);

            if (!Xchire_accountsResult[0]) {
                throw new Error("Failed to insert into accounts table.");
            }
        }

        // Insert into progress
        const Xchire_progressColumns = [
            ...Xchire_activityColumns, "typeactivity", "callback", "callstatus", "typecall", 
            "remarks", "quotationnumber", "quotationamount", "sonumber", "soamount", 
            "startdate", "enddate",
        ];

        const Xchire_progressValues = [
            ...Xchire_activityValues, typeactivity, callback || null, callstatus || null, typecall || null, 
            remarks || null, quotationnumber || null, quotationamount || null, sonumber || null, 
            soamount || null, startdate || null, enddate || null, 
        ];

        // Set updated activity number
        Xchire_progressValues[Xchire_progressColumns.indexOf("activitynumber")] = Xchire_newActivityNumber;

        const Xchire_progressPlaceholders = Xchire_progressValues.map((_, i) => `$${i + 1}`).join(", ");
        const Xchire_progressQuery = `
            INSERT INTO progress (${Xchire_progressColumns.join(", ")}, date_created) 
            VALUES (${Xchire_progressPlaceholders}, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila') 
            RETURNING *;
        `;
        const Xchire_progressResult = await Xchire_sql(Xchire_progressQuery, Xchire_progressValues);

        if (!Xchire_progressResult[0]) {
            throw new Error("Failed to insert into progress table.");
        }

        return { 
            success: true, 
            activity: Xchire_insertedActivity, 
            progress: Xchire_progressResult[0], 
            accountExists 
        };
    } catch (error: any) {
        console.error("Error inserting activity, accounts, and progress:", error);
        return { success: false, error: error.message || "Failed to add records." };
    }
}

export async function POST(req: Request) {
    try {
        const Xchire_body = await req.json();
        const Xchire_result = await create(Xchire_body);
        return NextResponse.json(Xchire_result);
    } catch (Xchire_error: any) {
        console.error("Error in POST /api/addActivity:", Xchire_error);
        return NextResponse.json(
            { success: false, error: Xchire_error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}