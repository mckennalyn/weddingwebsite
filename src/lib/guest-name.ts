import type { Guest } from "@/lib/db";

// A plus-one starts with no name; the guest fills it in when they RSVP.
export function guestDisplayName(guest: Guest, householdGuests: Guest[]) {
  const name = `${guest.first_name} ${guest.last_name}`.trim();
  if (name) return name;
  const host = householdGuests.find((g) => !g.is_plus_one);
  return host ? `Guest of ${host.first_name}` : "Plus-one";
}
