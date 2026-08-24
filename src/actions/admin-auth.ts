"use server";

import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, createAdminSessionToken } from "@/lib/session";

export type LoginState = { error?: string } | undefined;

function passwordsMatch(input: string, expected: string) {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function loginAdmin(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return { error: "ADMIN_PASSWORD isn't configured on the server yet." };
  }
  if (!password || !passwordsMatch(password, expected)) {
    return { error: "Incorrect password." };
  }

  const token = await createAdminSessionToken();
  (await cookies()).set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  (await cookies()).delete(ADMIN_COOKIE_NAME);
  redirect("/admin");
}
