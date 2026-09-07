"use client";

import { useMemo, useState, useTransition } from "react";
import type { HouseholdWithGuests } from "@/actions/guests-admin";
import {
  addGuestToHousehold,
  deleteGuest,
  deleteHousehold,
  setGuestRsvpStatus,
  updateHouseholdAddress,
} from "@/actions/guests-admin";
import type { RsvpStatus } from "@/lib/db";

function addressLines(h: HouseholdWithGuests) {
  return [h.address_line1, h.address_line2, [h.city, h.state, h.postal_code].filter(Boolean).join(", "), h.country]
    .filter((line) => line && line.length > 0);
}

function YesNoButtons({
  status,
  onSet,
}: {
  status: RsvpStatus;
  onSet: (status: RsvpStatus) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onSet(status === "attending" ? "pending" : "attending")}
        className={`letter-wide rounded-full border px-3 py-1 text-xs uppercase transition-colors ${
          status === "attending"
            ? "border-gold bg-gold text-paper"
            : "border-line text-ink hover:border-gold hover:text-gold-deep"
        }`}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onSet(status === "declined" ? "pending" : "declined")}
        className={`letter-wide rounded-full border px-3 py-1 text-xs uppercase transition-colors ${
          status === "declined"
            ? "border-ink/60 bg-ink/60 text-paper"
            : "border-line text-ink hover:border-ink hover:text-ink"
        }`}
      >
        No
      </button>
    </div>
  );
}

function HouseholdCard({ household }: { household: HouseholdWithGuests }) {
  const [editing, setEditing] = useState(false);
  const [addingGuest, setAddingGuest] = useState(false);
  const [, startTransition] = useTransition();

  const responded = household.guests.filter((g) => g.rsvp_status !== "pending").length;

  return (
    <div className="border border-line p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-display text-xl text-ink">{household.label}</p>
          {!editing && (
            <p className="mt-1 text-base text-ink">
              {addressLines(household).join(" · ") || "No address on file"}
            </p>
          )}
          <p className="letter-wide mt-1 text-xs uppercase text-ink">
            {responded}/{household.guests.length} responded
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="letter-wide uppercase text-ink hover:text-gold-deep"
          >
            {editing ? "Cancel" : "Edit address"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete ${household.label} and all their guests?`)) {
                startTransition(() => deleteHousehold(household.id));
              }
            }}
            className="letter-wide uppercase text-ink hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {editing && (
        <form
          action={(formData) => {
            startTransition(() => updateHouseholdAddress(household.id, formData));
            setEditing(false);
          }}
          className="mt-4 grid grid-cols-2 gap-3"
        >
          <input name="label" defaultValue={household.label} placeholder="Label" className="col-span-2 border border-line px-3 py-2 text-base text-ink outline-none placeholder:text-ink/70 focus:border-gold" />
          <input name="addressLine1" defaultValue={household.address_line1 ?? ""} placeholder="Address line 1" className="border border-line px-3 py-2 text-base text-ink outline-none placeholder:text-ink/70 focus:border-gold" />
          <input name="addressLine2" defaultValue={household.address_line2 ?? ""} placeholder="Address line 2" className="border border-line px-3 py-2 text-base text-ink outline-none placeholder:text-ink/70 focus:border-gold" />
          <input name="city" defaultValue={household.city ?? ""} placeholder="City" className="border border-line px-3 py-2 text-base text-ink outline-none placeholder:text-ink/70 focus:border-gold" />
          <input name="state" defaultValue={household.state ?? ""} placeholder="State" className="border border-line px-3 py-2 text-base text-ink outline-none placeholder:text-ink/70 focus:border-gold" />
          <input name="postalCode" defaultValue={household.postal_code ?? ""} placeholder="Postal code" className="border border-line px-3 py-2 text-base text-ink outline-none placeholder:text-ink/70 focus:border-gold" />
          <input name="country" defaultValue={household.country ?? ""} placeholder="Country" className="border border-line px-3 py-2 text-base text-ink outline-none placeholder:text-ink/70 focus:border-gold" />
          <button type="submit" className="letter-wide col-span-2 border border-gold py-2 text-sm uppercase text-gold-deep hover:bg-gold hover:text-paper">
            Save address
          </button>
        </form>
      )}

      <div className="mt-4 divide-y divide-line">
        {household.guests.map((guest) => (
          <div key={guest.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div>
              <p className="text-ink">
                {guest.first_name} {guest.last_name}
              </p>
              {guest.rsvp_status === "pending" && (
                <p className="letter-wide text-xs uppercase text-ink">
                  Awaiting response
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <YesNoButtons
                status={guest.rsvp_status}
                onSet={(status) => startTransition(() => setGuestRsvpStatus(guest.id, status))}
              />
              <button
                type="button"
                onClick={() => startTransition(() => deleteGuest(guest.id))}
                className="text-ink hover:text-red-700"
                aria-label="Remove guest"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>

      {addingGuest ? (
        <form
          action={(formData) => {
            startTransition(() => addGuestToHousehold(household.id, formData));
            setAddingGuest(false);
          }}
          className="mt-3 flex gap-2"
        >
          <input name="firstName" placeholder="First name" required className="flex-1 border border-line px-3 py-2 text-base text-ink outline-none placeholder:text-ink/70 focus:border-gold" />
          <input name="lastName" placeholder="Last name" required className="flex-1 border border-line px-3 py-2 text-base text-ink outline-none placeholder:text-ink/70 focus:border-gold" />
          <button type="submit" className="letter-wide border border-gold px-3 text-sm uppercase text-gold-deep hover:bg-gold hover:text-paper">
            Add
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAddingGuest(true)}
          className="letter-wide mt-3 text-sm uppercase text-gold-deep hover:underline"
        >
          + Add guest to this household
        </button>
      )}
    </div>
  );
}

export function GuestsTab({ households }: { households: HouseholdWithGuests[] }) {
  const [query, setQuery] = useState("");

  const totals = useMemo(() => {
    const guests = households.flatMap((h) => h.guests);
    return {
      households: households.length,
      guests: guests.length,
      attending: guests.filter((g) => g.rsvp_status === "attending").length,
      declined: guests.filter((g) => g.rsvp_status === "declined").length,
      pending: guests.filter((g) => g.rsvp_status === "pending").length,
    };
  }, [households]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return households;
    return households.filter((h) => {
      const haystack = [
        h.label,
        h.address_line1,
        h.city,
        ...h.guests.map((g) => `${g.first_name} ${g.last_name}`),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [households, query]);

  return (
    <div>
      <div className="flex flex-wrap gap-6 text-center">
        {[
          ["Households", totals.households],
          ["Guests", totals.guests],
          ["Attending", totals.attending],
          ["Declined", totals.declined],
          ["Pending", totals.pending],
        ].map(([label, value]) => (
          <div key={label as string}>
            <p className="font-display text-2xl text-ink">{value}</p>
            <p className="letter-wide text-xs uppercase text-ink">{label}</p>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search guests, households, or addresses"
        className="mt-8 w-full border border-line px-4 py-2 text-base text-ink outline-none placeholder:text-ink/70 focus:border-gold"
      />

      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-center text-base text-ink">No matches.</p>
        ) : (
          filtered.map((h) => <HouseholdCard key={h.id} household={h} />)
        )}
      </div>
    </div>
  );
}
