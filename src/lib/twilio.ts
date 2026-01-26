import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken) {
  console.warn("Twilio credentials not configured - SMS will be disabled");
}

export const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendSMS(to: string, message: string): Promise<string | null> {
  if (!twilioClient || !fromNumber) {
    console.log(`[SMS Mock] To: ${to}, Message: ${message}`);
    return "mock-sid";
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: fromNumber,
      to,
    });
    return result.sid;
  } catch (error) {
    console.error("Failed to send SMS:", error);
    return null;
  }
}

export default twilioClient;
