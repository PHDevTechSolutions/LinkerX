import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        // Extract query parameters
        const { ReferenceID, Role, month, year } = req.query;

        // Connect to the database
        const db = await connectToDatabase();
        const monitoringCollection = db.collection("monitoring");

        // Create filter object
        const matchFilter: any = {};

        // Apply month and year filter to createdAt
        if (month && year) {
            const monthNumber = parseInt(month as string, 10) - 1; // Convert month to zero-based index
            const yearNumber = parseInt(year as string, 10);
            const startDate = new Date(yearNumber, monthNumber, 1);
            const endDate = new Date(yearNumber, monthNumber + 1, 0, 23, 59, 59);

            matchFilter.createdAt = { $gte: startDate, $lte: endDate };
        }

        // Apply ReferenceID filter if Role is "Staff"
        if (Role === "Staff" && ReferenceID) {
            matchFilter.ReferenceID = ReferenceID;
        }

        // Fetch filtered monitoring data
        const data = await monitoringCollection.find(matchFilter).toArray();

        // Return the filtered dataset
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching monitoring data:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
