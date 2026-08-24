"use server";

import { revalidatePath } from "next/cache";
import { getDb, type RsvpStatus, type Guest, type Household } from "@/lib/db";
import { requireAdmin } from "@/lib/dal";

export type HouseholdWithGuests = Household & { guests: Guest[] };

export async function getAllHouseholds(): Promise<HouseholdWithGuests[]> {
  await requireAdmin();
  const sql = getDb();

  const households = await sql<Household[]>`
    select * from households order by created_at desc
  `;
  const guests = await sql<Guest[]>`
    select * from guests order by last_name, first_name
  `;

  const guestsByHousehold = new Map<string, Guest[]>();
  for (const guest of guests) {
    const list = guestsByHousehold.get(guest.household_id) ?? [];
    list.push(guest);
    guestsByHousehold.set(guest.household_id, list);
  }

  return households.map((h) => ({
    ...h,
    guests: guestsByHousehold.get(h.id) ?? [],
  }));
}

export async function createHousehold(formData: FormData) {
  await requireAdmin();
  const sql = getDb();

  const label = String(formData.get("label") ?? "").trim();
  const addressLine1 = String(formData.get("addressLine1") ?? "").trim();
  const addressLine2 = String(formData.get("addressLine2") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const postalCode = String(formData.get("postalCode") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();

  const firstNames = formData.getAll("guestFirstName").map((v) => String(v).trim());
  const lastNames = formData.getAll("guestLastName").map((v) => String(v).trim());

  const guestPairs = firstNames
    .map((first, i) => ({ first, last: lastNames[i] ?? "" }))
    .filter((g) => g.first.length > 0 && g.last.length > 0);

  if (!label || guestPairs.length === 0) {
    throw new Error("A household needs a label and at least one guest.");
  }

  const [household] = await sql<{ id: string }[]>`
    insert into households (label, address_line1, address_line2, city, state, postal_code, country)
    values (${label}, ${addressLine1 || null}, ${addressLine2 || null}, ${city || null}, ${state || null}, ${postalCode || null}, ${country || null})
    returning id
  `;

  for (const { first, last } of guestPairs) {
    await sql`
      insert into guests (household_id, first_name, last_name)
      values (${household.id}, ${first}, ${last})
    `;
  }

  revalidatePath("/admin");
}

export async function updateHouseholdAddress(
  householdId: string,
  formData: FormData
) {
  await requireAdmin();
  const sql = getDb();

  const label = String(formData.get("label") ?? "").trim();
  const addressLine1 = String(formData.get("addressLine1") ?? "").trim();
  const addressLine2 = String(formData.get("addressLine2") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const postalCode = String(formData.get("postalCode") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();

  await sql`
    update households
    set label = ${label},
        address_line1 = ${addressLine1 || null},
        address_line2 = ${addressLine2 || null},
        city = ${city || null},
        state = ${state || null},
        postal_code = ${postalCode || null},
        country = ${country || null}
    where id = ${householdId}
  `;

  revalidatePath("/admin");
}

export async function addGuestToHousehold(
  householdId: string,
  formData: FormData
) {
  await requireAdmin();
  const sql = getDb();

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  if (!firstName || !lastName) {
    throw new Error("Guest needs a first and last name.");
  }

  await sql`
    insert into guests (household_id, first_name, last_name)
    values (${householdId}, ${firstName}, ${lastName})
  `;

  revalidatePath("/admin");
}

export async function deleteGuest(guestId: string) {
  await requireAdmin();
  const sql = getDb();
  await sql`delete from guests where id = ${guestId}`;
  revalidatePath("/admin");
}

export async function deleteHousehold(householdId: string) {
  await requireAdmin();
  const sql = getDb();
  await sql`delete from households where id = ${householdId}`;
  revalidatePath("/admin");
}

export async function setGuestRsvpStatus(
  guestId: string,
  status: RsvpStatus
) {
  await requireAdmin();
  const sql = getDb();
  await sql`
    update guests
    set rsvp_status = ${status}, responded_at = ${status === "pending" ? null : new Date()}
    where id = ${guestId}
  `;
  revalidatePath("/admin");
}
