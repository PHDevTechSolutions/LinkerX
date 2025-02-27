import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        // Connect to the database
        const db = await connectToDatabase();
        const monitoringCollection = db.collection("monitoring");

        // Fetch **all** monitoring data (removing projection to include everything)
        const data = await monitoringCollection.find({}).toArray();

        // Return the full dataset
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching monitoring data:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
