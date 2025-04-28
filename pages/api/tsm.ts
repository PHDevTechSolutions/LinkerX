import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const db = await connectToDatabase();

        try {
            const { Roles } = req.query;

            if (!Roles) {
                return res.status(400).json({ error: "Roles are required" });
            }

            const rolesArray = (Roles as string).split(",").map(role => role.trim());

            const users = await db.collection("users")
                .find({
                    Role: { $in: rolesArray },
                    Status: { $nin: ["Resigned", "Terminated"] }
                })
                .project({ Firstname: 1, Lastname: 1, ReferenceID: 1, Status: 1, _id: 0 })
                .toArray();

            if (users.length === 0) {
                return res.status(404).json({ error: "No users found with these roles" });
            }

            return res.status(200).json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            return res.status(500).json({ error: "Server error" });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}
