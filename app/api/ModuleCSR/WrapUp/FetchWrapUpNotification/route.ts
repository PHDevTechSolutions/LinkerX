import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb";

/**
 * Handler for the GET request to fetch "Endorsed" tickets
 * based on the provided referenceId. The function filters tickets
 * based on specific WrapUp values and returns matching tickets.
 *
 * @param req - The incoming request containing the referenceId as a query parameter.
 * @returns A JSON response containing matching tickets or an error message.
 */
export async function GET(req: NextRequest) {
  try {
    // Extract the Xchire_referenceId from the query parameters
    const { searchParams } = new URL(req.url);
    const referenceId = searchParams.get("referenceId");

    // If Xchire_referenceId is missing, return a 400 error
    if (!referenceId) {
      return NextResponse.json({ error: "Missing referenceId" }, { status: 400 });
    }

    // Connect to the MongoDB database
    const Xchire_db = await connectToDatabase();
    const Xchire_collection = Xchire_db.collection("monitoring");

    // Fetch Xchire_tickets with Status "Endorsed" and specific WrapUp values
    const Xchire_fetch = await Xchire_collection
      .find({
        ReferenceID: referenceId,
        Status: "Endorsed", // Only fetch tickets with "Endorsed" status
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

    // Return the Xchire_fetched tickets as a JSON response
    return NextResponse.json(Xchire_fetch);
  } catch (Xchire_error) {
    // Log and handle any errors during the process
    console.error("Xchire_FetchTracking Error:", Xchire_error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
