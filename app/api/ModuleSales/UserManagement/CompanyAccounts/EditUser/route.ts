import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.TASKFLOW_DB_URL;
if (!databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const sql = neon(databaseUrl);

async function editUser(
    id: string, 
    referenceid: string, 
    manager: string, 
    tsm: string, 
    companyname: string,
    contactperson: string,
    contactnumber: string,
    emailaddress: string,
    typeclient: string,
    companygroup: string,
    address: string,
    area: string,
    status: string
) {
    try {
        if (!id || !companyname) {
            throw new Error("ID and company name are required.");
        }

        const result = await sql`
            UPDATE accounts 
            SET 
                referenceid = ${referenceid},
                manager = ${manager},
                tsm = ${tsm},
                companyname = ${companyname},
                contactperson = ${contactperson},
                contactnumber = ${contactnumber},
                emailaddress = ${emailaddress},
                typeclient = ${typeclient},
                companygroup = ${companygroup},
                address = ${address},
                area = ${area},
                status = ${status},
                date_updated = CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'
            WHERE id = ${id} 
            RETURNING *;
        `;

        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error updating user:", error);
        return { success: false, error: error.message || "Failed to update user." };
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { 
            id, 
            referenceid, 
            manager, 
            tsm, 
            companyname, 
            contactperson, 
            contactnumber, 
            emailaddress, 
            typeclient, 
            companygroup,
            address, 
            area, 
            status 
        } = body;

        const result = await editUser(
            id, referenceid, manager, tsm, companyname, contactperson, 
            contactnumber, emailaddress, typeclient, companygroup, address, area, status
        );

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in PUT /api/edituser:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
