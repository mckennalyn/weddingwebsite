"use server";

import { getDb, type RsvpStatus } from "@/lib/db";

export type SearchResultGuest = {
  id: string;
  firstName: string;
  lastName: string;
  rsvpStatus: RsvpStatus;
};

export type SearchResultHousehold = {
  householdId: string;
  guests: SearchResultGuest[];
};

// Public: guests search for their own invitation by name. Only names and
// RSVP status are exposed here — never addresses.
export async function searchInvitedGuests(
  query: string
): Promise<SearchResultHousehold[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const sql = getDb();
  const rows = await sql<
    {
      household_id: string;
      guest_id: string;
      first_name: string;
      last_name: string;
      rsvp_status: RsvpStatus;
    }[]
  >`
    select h.id as household_id, g.id as guest_id, g.first_name, g.last_name, g.rsvp_status
    from guests g
    join households h on h.id = g.household_id
    where h.id in (
      select household_id from guests
      where first_name ilike ${"%" + q + "%"} or last_name ilike ${"%" + q + "%"}
    )
    order by h.id, g.last_name, g.first_name
  `;

  const households = new Map<string, SearchResultHousehold>();
  for (const row of rows) {
    const existing = households.get(row.household_id);
    const guest: SearchResultGuest = {
      id: row.guest_id,
      firstName: row.first_name,
      lastName: row.last_name,
      rsvpStatus: row.rsvp_status,
    };
    if (existing) {
      existing.guests.push(guest);
    } else {
      households.set(row.household_id, {
        householdId: row.household_id,
        guests: [guest],
      });
    }
  }

  return Array.from(households.values()).slice(0, 8);
}

export type RsvpResponse = { guestId: string; attending: boolean };

export async function submitRsvp(
  householdId: string,
  responses: RsvpResponse[]
): Promise<{ success: boolean; error?: string }> {
  if (!householdId || responses.length === 0) {
    return { success: false, error: "Nothing to submit." };
  }

  const sql = getDb();
  const guestIds = responses.map((r) => r.guestId);

  // Only ever write to guests that actually belong to this household.
  const validGuests = await sql<{ id: string }[]>`
    select id from guests
    where household_id = ${householdId} and id in ${sql(guestIds)}
  `;
  const validIds = new Set(validGuests.map((g) => g.id));

  if (validIds.size === 0) {
    return { success: false, error: "Invitation not found." };
  }

  for (const { guestId, attending } of responses) {
    if (!validIds.has(guestId)) continue;
    await sql`
      update guests
      set rsvp_status = ${attending ? "attending" : "declined"}, responded_at = now()
      where id = ${guestId}
    `;
  }

  return { success: true };
}
