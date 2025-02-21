import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

// Create PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Neon
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { CompanyName, ContactPerson } = req.body;

    if (!CompanyName || !ContactPerson) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
      const client = await pool.connect();
      const result = await client.query(
        `INSERT INTO accounts ("CompanyName", "ContactPerson", "createdAt") VALUES ($1, $2, NOW()) RETURNING *`,
        [CompanyName, ContactPerson]
      );
      client.release();

      res.status(201).json({ success: true, message: "Account created successfully", user: result.rows[0] });
    } catch (error: any) {
      console.error("Database error:", error);
      res.status(400).json({ success: false, message: "Failed to create account" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
