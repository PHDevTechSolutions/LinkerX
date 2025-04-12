import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const referenceId = searchParams.get("referenceId");

    if (!referenceId) {
      return NextResponse.json({ error: "Missing referenceId" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const collection = db.collection("monitoring");

    // Fetch only tickets with Status "Endorsed"
    const tickets = await collection
      .find({
        ReferenceID: referenceId,
        Status: "Endorsed", // Only fetch if Status is Endorsed
        $or: [
          { WrapUp: "Customer Inquiry Sales" },
          { WrapUp: "Customer Inquiry Non-Sales" },
          { WrapUp: "Follow Up Sales" },
          { WrapUp: "After Sales" },
          { WrapUp: "Customer Complaint" },
          { WrapUp: "Follow Up Non-Sales" }
        ]
      })
      .toArray();

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("FetchTracking Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
