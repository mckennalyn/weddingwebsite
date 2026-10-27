"use server";

import { after } from "next/server";
import { getDb, type RsvpStatus } from "@/lib/db";
import { notifyRsvpChanges, type RsvpChange } from "@/lib/notify";

export type SearchResultGuest = {
  id: string;
  firstName: string;
  lastName: string;
  isPlusOne: boolean;
  rsvpStatus: RsvpStatus;
};

export type SearchResultHousehold = {
  householdId: string;
  guests: SearchResultGuest[];
};

// Public: a guest looks up their invitation by typing their full name. Only
// an exact (case-insensitive) match on "first last" returns a party, so the
// guest list can't be browsed by partial names. Only names and RSVP status are
// exposed here — never addresses.
export async function findHouseholdByFullName(
  fullName: string
): Promise<SearchResultHousehold | null> {
  const name = fullName.trim().replace(/\s+/g, " ");
  if (name.length < 3) return null;

  const sql = getDb();
  const rows = await sql<
    {
      household_id: string;
      guest_id: string;
      first_name: string;
      last_name: string;
      is_plus_one: boolean;
      rsvp_status: RsvpStatus;
    }[]
  >`
    select h.id as household_id, g.id as guest_id, g.first_name, g.last_name, g.is_plus_one, g.rsvp_status
    from guests g
    join households h on h.id = g.household_id
    where h.id = (
      select household_id from guests
      where not is_plus_one
        and lower(trim(trim(first_name) || ' ' || trim(last_name))) = lower(trim(${name}))
      order by id
      limit 1
    )
    order by g.is_plus_one, g.last_name, g.first_name
  `;

  if (rows.length === 0) return null;

  return {
    householdId: rows[0].household_id,
    guests: rows.map((row) => ({
      id: row.guest_id,
      firstName: row.first_name,
      lastName: row.last_name,
      isPlusOne: row.is_plus_one,
      rsvpStatus: row.rsvp_status,
    })),
  };
}

export type RsvpResponse = {
  guestId: string;
  attending: boolean;
  // Only used for plus-ones, who give their name when they accept.
  firstName?: string;
  lastName?: string;
};

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
  const validGuests = await sql<
    {
      id: string;
      is_plus_one: boolean;
      first_name: string;
      last_name: string;
      rsvp_status: RsvpStatus;
    }[]
  >`
    select id, is_plus_one, first_name, last_name, rsvp_status from guests
    where household_id = ${householdId} and id in ${sql(guestIds)}
  `;
  const validIds = new Set(validGuests.map((g) => g.id));
  const plusOneIds = new Set(
    validGuests.filter((g) => g.is_plus_one).map((g) => g.id)
  );

  for (const r of responses) {
    if (!plusOneIds.has(r.guestId) || !r.attending) continue;
    if (!r.firstName?.trim() || !r.lastName?.trim()) {
      return {
        success: false,
        error: "Please enter your guest's first and last name.",
      };
    }
  }

  if (validIds.size === 0) {
    return { success: false, error: "Invitation not found." };
  }

  const previous = new Map(validGuests.map((g) => [g.id, g]));
  const changes: RsvpChange[] = [];

  for (const { guestId, attending, firstName, lastName } of responses) {
    if (!validIds.has(guestId)) continue;
    const before = previous.get(guestId)!;
    const newStatus = attending ? "attending" : "declined";
    if (before.rsvp_status !== newStatus) {
      const name = plusOneIds.has(guestId) && attending
        ? `${firstName!.trim()} ${lastName!.trim()} (plus-one)`
        : `${before.first_name} ${before.last_name}`.trim() || "Plus-one";
      changes.push({ name, from: before.rsvp_status, to: newStatus });
    }
    if (plusOneIds.has(guestId) && attending) {
      await sql`
        update guests
        set first_name = ${firstName!.trim()}, last_name = ${lastName!.trim()}
        where id = ${guestId}
      `;
    } else if (plusOneIds.has(guestId)) {
      await sql`
        update guests set first_name = '', last_name = '' where id = ${guestId}
      `;
    }
    await sql`
      update guests
      set rsvp_status = ${attending ? "attending" : "declined"}, responded_at = now()
      where id = ${guestId}
    `;
  }

  if (changes.length > 0) after(() => notifyRsvpChanges(changes));

  return { success: true };
}
