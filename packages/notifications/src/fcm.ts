import * as admin from "firebase-admin";

let initialized = false;

function initializeFCM(): void {
  if (initialized) return;

  const projectId = process.env["FCM_PROJECT_ID"];
  const clientEmail = process.env["FCM_CLIENT_EMAIL"];
  const privateKey = process.env["FCM_PRIVATE_KEY"]?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("FCM credentials not configured. Push notifications will be disabled.");
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });

  initialized = true;
}

export interface PushNotificationPayload {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export async function sendPushNotification(payload: PushNotificationPayload): Promise<string> {
  initializeFCM();

  if (!initialized) {
    throw new Error("FCM is not initialized. Check your environment variables.");
  }

  const message: admin.messaging.Message = {
    token: payload.token,
    notification: {
      title: payload.title,
      body: payload.body,
    },
    data: payload.data,
    android: {
      priority: "high",
      notification: { sound: "default" },
    },
    apns: {
      payload: {
        aps: { sound: "default", badge: 1 },
      },
    },
  };

  const messageId = await admin.messaging().send(message);
  return messageId;
}

export async function sendMulticastNotification(
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<admin.messaging.BatchResponse> {
  initializeFCM();

  if (!initialized) {
    throw new Error("FCM is not initialized. Check your environment variables.");
  }

  const message: admin.messaging.MulticastMessage = {
    tokens,
    notification: { title, body },
    data,
    android: {
      priority: "high",
      notification: { sound: "default" },
    },
  };

  return admin.messaging().sendEachForMulticast(message);
}
