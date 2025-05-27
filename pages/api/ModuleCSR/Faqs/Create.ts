import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

// Function to add an account directly in this file
async function create({ ReferenceID, userName, DateCreated, Title, Description, }: {

    ReferenceID: string;
    userName: string;
    DateCreated: string;
    Title: string;
    Description: string;
}) {
    const Xchire_db = await connectToDatabase();
    const Xchire_Collection = Xchire_db.collection("Faqs");
    const newAccount = { ReferenceID, userName, DateCreated, Title, Description, };
    await Xchire_Collection.insertOne(newAccount);

    return { success: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { ReferenceID, userName, DateCreated, Title, Description } = req.body;

        // Validate required fields
        if (!Title) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required fields" });
        }

        try {
            const Xchire_insert = await create({ ReferenceID, userName, DateCreated, Title, Description });
            res.status(200).json(Xchire_insert);
        } catch (Xchire_error) {
            console.error("Error adding account:", Xchire_error);
            res
                .status(500)
                .json({ success: false, message: "Error adding account", Xchire_error });
        }
    } else {
        res
            .status(405)
            .json({ success: false, message: "Method not allowed" });
    }
}
