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

  try {
    const cookieSession = (await cookies()).get("session");

    if (cookieSession && cookieSession.value !== session) {
      console.log("Сессия в куках не совпадает с переданной сессией");
      return null;
    }

    if (!session || typeof session !== 'string' || session.split('.').length !== 3) {
      console.log("Некорректная сессия");
      return null;
    }

    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload;

  } catch (error) {
    console.log("Failed to verify session", error);
  }
}

export async function getSessionUser() {
  try {
    const session = (await cookies()).get("session");

    if (session) {
      const payload = await decrypt(session.value);
      return payload
    }

    return null;

  } catch (error) {
    console.log("Failed to get session", error);
  }

}