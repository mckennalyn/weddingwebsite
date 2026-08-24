import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "./session";

// Memoized per-request: cheap to call from multiple places in a render pass.
export const isAdmin = cache(async () => {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
});

export async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
}
