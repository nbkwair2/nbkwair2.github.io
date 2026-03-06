import twilio from "twilio";

let client: twilio.Twilio | null = null;

function getTwilioClient(): twilio.Twilio {
  if (client) return client;

  const accountSid = process.env["TWILIO_ACCOUNT_SID"];
  const authToken = process.env["TWILIO_AUTH_TOKEN"];

  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials not configured. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.");
  }

  client = twilio(accountSid, authToken);
  return client;
}

export interface SmsPayload {
  to: string;
  body: string;
  from?: string;
}

export async function sendSms(payload: SmsPayload): Promise<string> {
  const twilioClient = getTwilioClient();
  const from = payload.from ?? process.env["TWILIO_PHONE_NUMBER"];

  if (!from) {
    throw new Error("No sender phone number. Set TWILIO_PHONE_NUMBER environment variable.");
  }

  const message = await twilioClient.messages.create({
    to: payload.to,
    from,
    body: payload.body,
  });

  return message.sid;
}

export async function sendOrderStatusSms(
  phoneNumber: string,
  orderNumber: string,
  status: string
): Promise<string> {
  const statusMessages: Record<string, string> = {
    CONFIRMED: `Your order #${orderNumber} has been confirmed! We'll start preparing it shortly.`,
    PREPARING: `Your order #${orderNumber} is now being prepared by our kitchen team.`,
    READY: `Your order #${orderNumber} is ready and will be dispatched shortly.`,
    OUT_FOR_DELIVERY: `Your order #${orderNumber} is on its way! Our driver is heading to you.`,
    DELIVERED: `Your order #${orderNumber} has been delivered. Enjoy your meal!`,
    CANCELLED: `Your order #${orderNumber} has been cancelled. Please contact us if you have questions.`,
  };

  const body = statusMessages[status] ?? `Your order #${orderNumber} status has been updated to ${status}.`;

  return sendSms({ to: phoneNumber, body });
}
