import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

async function insertActivity(data: any) {
    try {
        const {
            date_created,
            typeactivity,
            startdate,
            enddate,
            callback,
            callstatus,
            typecall,
            quotationnumber,
            quotationamount,
            soamount,
            sonumber,
            actualsales,
            remarks,
            activitystatus,
            referenceid,
            manager,
            tsm,
            activitynumber,
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
            targetquota,
        } = data;

        const result = await Xchire_sql`
      INSERT INTO progress (
        date_created,
        typeactivity,
        startdate,
        enddate,
        callback,
        callstatus,
        typecall,
        quotationnumber,
        quotationamount,
        soamount,
        sonumber,
        actualsales,
        remarks,
        activitystatus,
        referenceid,
        manager,
        tsm,
        activitynumber,
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
        targetquota
      ) VALUES (
        ${date_created},
        ${typeactivity},
        ${startdate},
        ${enddate},
        ${callback},
        ${callstatus},
        ${typecall},
        ${quotationnumber},
        ${quotationamount},
        ${soamount},
        ${sonumber},
        ${actualsales},
        ${remarks},
        ${activitystatus},
        ${referenceid},
        ${manager},
        ${tsm},
        ${activitynumber},
        ${companyname},
        ${contactperson},
        ${contactnumber},
        ${emailaddress},
        ${typeclient},
        ${address},
        ${deliveryaddress},
        ${area},
        ${projectname},
        ${projectcategory},
        ${projecttype},
        ${source},
        ${targetquota}
      )
      RETURNING *;
    `;

        return { success: true, data: result[0] };
    } catch (error: any) {
        console.error("Error inserting activity:", error);
        return { success: false, error: error.message || "Failed to insert activity." };
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Basic validation
        if (!body.referenceid || !body.activitynumber || !body.startdate || !body.enddate) {
            return NextResponse.json(
                { success: false, error: "Missing required fields." },
                { status: 400 }
            );
        }

        const result = await insertActivity(body);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in POST /api/ModuleSales/Task/AddProgress:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
