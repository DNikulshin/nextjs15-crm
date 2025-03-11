import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type SessionPayload = {
  userId: string;
  userEmail: string;
  expiresAt: Date;
};

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: string, userEmail: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, userEmail, expiresAt });

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });
}

export async function deleteSession() {
  (await cookies()).delete("session");
}


export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  if (!session) {
    console.log('Session token is empty or undefined');
    return null
  }

  console.log("Attempting to verify session:", session);

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload;

  } catch (error) {
    console.log("Failed to verify session", error);
    return null
  }
}

export async function getSessionUser() {
  try {
    const session = (await cookies()).get("session");

    if (!session) {
      console.log('Session token is empty or undefined');
      return null
    }
  
    console.log("Attempting to verify session:", session);

    if (session && session?.value) {
      const payload = await decrypt(session.value);
      return payload
    }

    return null;

  } catch (error) {
    console.log("Failed to get session", error);
    return null
  }

}