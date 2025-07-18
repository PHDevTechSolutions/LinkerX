import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

async function update(
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
    deliveryaddress: string,
    area: string,
    status: string
) {
    try {
        if (!id || !companyname) {
            throw new Error("ID and company name are required.");
        }

        const Xchire_update = await Xchire_sql`
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
                deliveryaddress = ${deliveryaddress},
                area = ${area},
                status = ${status}
            WHERE id = ${id} 
            RETURNING *;
        `;

        return { success: true, data: Xchire_update };
    } catch (Xchire_error: any) {
        console.error("Error updating user:", Xchire_error);
        return { success: false, error: Xchire_error.message || "Failed to update user." };
    }
}

export async function PUT(req: Request) {
    try {
        const Xchire_body = await req.json();
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
            deliveryaddress,
            area, 
            status 
        } = Xchire_body;

        const Xchire_result = await update(
            id, referenceid, manager, tsm, companyname, contactperson, 
            contactnumber, emailaddress, typeclient, companygroup, address, deliveryaddress, area, status
        );

        return NextResponse.json(Xchire_result);
    } catch (Xchire_error: any) {
        console.error("Error in PUT /api/edituser:", Xchire_error);
        return NextResponse.json(
            { success: false, error: Xchire_error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
