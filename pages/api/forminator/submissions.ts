import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch("https://www.ecoshiftcorp.com/wp-json/forminator/v1/forms/40/submissions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // OPTIONAL: Kung required
        // Authorization: `Bearer ${process.env.WORDPRESS_JWT_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Forminator API error response:", errorText); // Add this
      throw new Error("Failed to fetch Forminator submissions");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching Forminator submissions:", err);
    res.status(500).json({ message: "Failed to fetch submissions." });
  }
}
