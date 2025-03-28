import { NextResponse } from "next/server";
import twilio from "twilio";

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!;

// Create Twilio client
const client = twilio(accountSid, authToken);

// ✅ Handle POST request
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    }

    // Make the call using Twilio
    const call = await client.calls.create({
      url: "http://demo.twilio.com/docs/voice.xml", // Twilio demo XML
      to: phoneNumber,
      from: twilioPhoneNumber,
    });

    console.log("Call initiated, SID:", call.sid);
    return NextResponse.json({ success: true, callSid: call.sid }, { status: 200 });
  } catch (error: any) {
    console.error("Error making call:", error);
    return NextResponse.json({ error: "Failed to make the call." }, { status: 500 });
  }
}

// ✅ Handle unsupported methods
export async function OPTIONS() {
  return NextResponse.json({ success: true }, { status: 200 });
}
