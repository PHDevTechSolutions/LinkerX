import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}
const Xchire_sql = neon(Xchire_databaseUrl);

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing inquiry ID." }, { status: 400 });
    }

    await Xchire_sql`
      DELETE FROM inquiries
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true, message: "Inquiry successfully deleted." }, { status: 200 });
  } catch (Xchire_error: any) {
    console.error("Delete Inquiry Error:", Xchire_error);
    return NextResponse.json(
      { success: false, error: Xchire_error.message || "Failed to delete inquiry." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
