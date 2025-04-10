import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb";
import { ObjectId } from "mongodb"; // Import ObjectId

// Handle PUT request to update notification status
export async function PUT(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const { notifId, status } = requestBody;

    // Validate notifId
    if (!notifId) {
      return NextResponse.json(
        { success: false, message: "notifId is required." },
        { status: 400 }
      );
    }

    // Convert notifId to ObjectId for MongoDB query
    const notificationId = new ObjectId(notifId); 

    // Set default status if missing
    const updatedStatus = status || "Read";

    const db = await connectToDatabase();
    const collection = db.collection("Tracking");

    // Update notification status in the MongoDB database
    const result = await collection.updateOne(
      { _id: notificationId },
      { $set: { status: updatedStatus } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Notification not found or already updated." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Notification marked as read" },
      { status: 200 }
    );
  } catch (error: any) {
    // Enhanced error logging
    console.error("Error updating notification status:", error.message, error.stack);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update notification." },
      { status: 500 }
    );
  }
}
