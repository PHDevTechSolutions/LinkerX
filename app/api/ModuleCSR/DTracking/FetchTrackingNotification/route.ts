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
    const collection = db.collection("Tracking");

    // Adjusted to fetch all TicketConcern types (Delivery / Pickup and Quotation)
    const tickets = await collection
      .find({ ReferenceID: referenceId, 
              $or: [
                { TicketConcern: "Delivery / Pickup" },
                { TicketConcern: "Quotation" },
                { TicketConcern: "Documents" },
                { TicketConcern: "Return Call" },
                { TicketConcern: "Payment Terms" },
                { TicketConcern: "Refund" },
                { TicketConcern: "Replacement" },
                { TicketConcern: "Site Visit" },
                { TicketConcern: "TDS" },
                { TicketConcern: "Shop Drawing" },
                { TicketConcern: "Dialux" },
                { TicketConcern: "Product Testing" },
                { TicketConcern: "SPF" },
                { TicketConcern: "Accreditation Request" },
                { TicketConcern: "Job Request" },
                { TicketConcern: "Product Recommendation" },
                { TicketConcern: "Product Certificate" }
              ]})
      .toArray();

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("FetchTracking Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
