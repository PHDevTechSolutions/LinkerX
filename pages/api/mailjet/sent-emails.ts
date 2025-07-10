import { NextApiRequest, NextApiResponse } from "next";
import Mailjet from "node-mailjet";

interface MailjetMessage {
  ArrivedAt?: string;
  ContactAlt?: string;
  ContactID?: string;
  Status?: string;
  Subject?: string;
}

interface MailjetResponse {
  Count: string;
  Data: MailjetMessage[];
  Total: string;
}

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY || "",
  process.env.MAILJET_SECRET_KEY || ""
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await mailjet.get("message", { version: "v3" }).request();

    const rawBody = result.body;
    let body: MailjetResponse;

    if (typeof rawBody === "string") {
      body = JSON.parse(rawBody) as MailjetResponse;
    } else {
      body = rawBody as unknown as MailjetResponse;
    }

    if (!body || !body.Data) {
      return res.status(404).json({ message: "No messages found" });
    }

    // Map first
    const emails = body.Data.map((msg) => ({
      Status: msg.Status || "Unknown",
      Contact: msg.ContactAlt || msg.ContactID || "Unknown",
      Subject: msg.Subject || "(No subject)",
      Date: msg.ArrivedAt || "",
    }));

    // Sort descending by Date (latest first)
    emails.sort((a, b) => {
      const dateA = new Date(a.Date).getTime();
      const dateB = new Date(b.Date).getTime();
      return dateB - dateA;
    });

    res.status(200).json(emails);
  } catch (error) {
    console.error("Mailjet error:", error);
    res.status(500).json({ message: "Failed to fetch Mailjet emails." });
  }
}
