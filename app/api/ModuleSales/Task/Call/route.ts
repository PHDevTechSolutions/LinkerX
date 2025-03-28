import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

// Twilio credentials from your environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!;

// Create Twilio client
const client = twilio(accountSid, authToken);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: "Phone number is required." });
    }

    try {
      // Make the call using Twilio
      const call = await client.calls.create({
        url: "http://demo.twilio.com/docs/voice.xml", // Twilio demo XML
        to: phoneNumber,
        from: twilioPhoneNumber,
      });

      console.log("Call initiated, SID:", call.sid);
      return res.status(200).json({ success: true, callSid: call.sid });
    } catch (error: any) {
      console.error("Error making call:", error);
      return res.status(500).json({ error: "Failed to make the call." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
