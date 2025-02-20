import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/app/ModuleCSR/lib/mongodb"; // Import connectToDatabase

// Function to add an account directly in this file
async function AddTracking({ UserID, userName, DateRecord, CompanyName, CustomerName, ContactNumber, TicketType, TicketConcern, TrackingStatus, TrackingRemarks, Department, EndorsedDate, ClosedDate }: {
  UserID: string;
  userName: string;
  DateRecord: string;
  CompanyName: string;
  CustomerName: string;
  ContactNumber: string;
  TicketType: string;
  TicketConcern: string;
  TrackingStatus: string;
  TrackingRemarks: string;
  Department: string;
  EndorsedDate: string;
  ClosedDate: string;
}) {
  const db = await connectToDatabase();
  const accountsCollection = db.collection("Tracking");
  const newAccount = { UserID, userName, DateRecord, CompanyName, CustomerName, ContactNumber, TicketType, TicketConcern, TrackingStatus, TrackingRemarks, Department, EndorsedDate, ClosedDate, createdAt: new Date(), };
  await accountsCollection.insertOne(newAccount);

  // Broadcast logic if needed
  if (typeof io !== "undefined" && io) {
    io.emit("newAccount", newAccount);
  }

  return { success: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { UserID, userName, DateRecord, CompanyName, CustomerName, ContactNumber, TicketType, TicketConcern, TrackingStatus, TrackingRemarks, Department, EndorsedDate, ClosedDate } = req.body;

    // Validate required fields
    if (!CompanyName) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    try {
      const result = await AddTracking({ UserID, userName, DateRecord, CompanyName, CustomerName, ContactNumber, TicketType, TicketConcern, TrackingStatus, TrackingRemarks, Department, EndorsedDate, ClosedDate });
      res.status(200).json(result);
    } catch (error) {
      console.error("Error adding account:", error);
      res
        .status(500)
        .json({ success: false, message: "Error adding account", error });
    }
  } else {
    res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
