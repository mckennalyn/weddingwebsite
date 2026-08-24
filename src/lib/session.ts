import "server-only";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";
const SESSION_DURATION = "30d";

function getEncodedKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "Missing ADMIN_SESSION_SECRET environment variable. Generate one with `openssl rand -base64 32` and set it in .env.local."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminSessionToken() {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getEncodedKey());
}

export async function verifyAdminSessionToken(token: string | undefined) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getEncodedKey(), {
      algorithms: ["HS256"],
    });
    return payload.admin === true;
  } catch {
    return false;
  }
}

export { COOKIE_NAME as ADMIN_COOKIE_NAME };
