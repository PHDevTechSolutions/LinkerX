// API route for updating notification status
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb";
import { ObjectId } from "mongodb"; // Import ObjectId for MongoDB query

// Handle PUT request to update notification status
export async function PUT(Xchire_req: NextRequest) {
  try {
    const Xchire_requestBody = await Xchire_req.json();
    const { notifId, status } = Xchire_requestBody;

    // Validate notifId presence
    if (!notifId) {
      return NextResponse.json(
        { success: false, message: "notifId is required." },
        { status: 400 }
      );
    }

    // Convert notifId to ObjectId for MongoDB query
    const notificationId = new ObjectId(notifId);

    // Set default status to "Read" if not provided
    const updatedStatus = status || "Read";

    // Connect to MongoDB database
    const Xchire_db = await connectToDatabase();
    const Xchire_collection = Xchire_db.collection("Tracking");

    // Update the notification status in the MongoDB collection
    const Xchire_result = await Xchire_collection.updateOne(
      { _id: notificationId },
      { $set: { status: updatedStatus } }
    );

    // If no document matched, return a 404 error
    if (Xchire_result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Notification not found or already updated." },
        { status: 404 }
      );
    }

    // Return success response after updating notification status
    return NextResponse.json(
      { success: true, message: "Notification marked as read" },
      { status: 200 }
    );
  } catch (Xchire_error: any) {
    // Enhanced error logging with message and stack trace
    console.error("Error updating notification status:", Xchire_error.message, Xchire_error.stack);
    return NextResponse.json(
      { success: false, error: Xchire_error.message || "Failed to update notification." },
      { status: 500 }
    );
  }
}
