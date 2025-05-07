// API route for fetching tracking tickets based on referenceId
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb";

// Handle GET request to fetch tracking tickets based on referenceId
export async function GET(Xchire_req: NextRequest) {
  try {
    const { searchParams } = new URL(Xchire_req.url);
    const referenceId = searchParams.get("referenceId");

    // Ensure referenceId is provided
    if (!referenceId) {
      return NextResponse.json({ error: "Missing referenceId" }, { status: 400 });
    }

    // Connect to the MongoDB database
    const Xchire_db = await connectToDatabase();
    const Xchire_collection = Xchire_db.collection("Tracking");

    // Fetch tickets where TrackingStatus is "Open" and TicketConcern matches specific types
    const Xchire_fetch = await Xchire_collection
      .find({
        ReferenceID: referenceId,
        TrackingStatus: "Open", // exclude Closed
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
        ]
      })
      .toArray();

    return NextResponse.json(Xchire_fetch);
  } catch (Xchire_error) {
    console.error("FetchTracking Error:", Xchire_error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
