import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb";
import { ObjectId } from "mongodb"; // Import ObjectId

/**
 * Handles the PUT request to update the notification status.
 * It updates the notification status to "Read" or the status provided in the request.
 *
 * @param req - The incoming PUT request containing notifId and NotificationStatus.
 * @returns A JSON response indicating the success or failure of the update.
 */
export async function PUT(req: NextRequest) {
  try {
    const Xchire_requestBody = await req.json();
    const { notifId, NotificationStatus } = Xchire_requestBody;

    // Validate notificationId
    if (!notifId) {
      return NextResponse.json(
        { success: false, message: "notifId is required." },
        { status: 400 }
      );
    }

    // Convert notificationId to ObjectId for MongoDB query
    const notificationId = new ObjectId(notifId); 

    // Set default status if missing
    const updatedStatus = NotificationStatus || "Read";

    const Xchire_db = await connectToDatabase();
    const Xchire_collection = Xchire_db.collection("monitoring");

    // Update Xchire_notificationStatus in the MongoDB database
    const Xchire_result = await Xchire_collection.updateOne(
      { _id: notificationId },
      { $set: { NotificationStatus: updatedStatus } }
    );

    if (Xchire_result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Notification not found or already updated." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Notification marked as read" },
      { status: 200 }
    );
  } catch (Xchire_error: any) {
    // Enhanced error logging
    console.error("Xchire_Error updating notification status:", Xchire_error.message, Xchire_error.stack);
    return NextResponse.json(
      { success: false, error: Xchire_error.message || "Failed to update notification." },
      { status: 500 }
    );
  }
}
