"use client";

import { useMemo, useState, useTransition } from "react";
import type { HouseholdWithGuests } from "@/actions/guests-admin";
import { setGuestRsvpStatus } from "@/actions/guests-admin";
import type { RsvpStatus } from "@/lib/db";
import { YesNoButtons } from "./GuestsTab";

type Filter = "all" | "pending" | "attending" | "declined";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Not Responded" },
  { id: "attending", label: "Yes" },
  { id: "declined", label: "No" },
];

export function GuestStatusTab({
  households,
}: {
  households: HouseholdWithGuests[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [, startTransition] = useTransition();

  const rows = useMemo(() => {
    return households
      .flatMap((h) =>
        h.guests.map((guest) => ({ guest, householdLabel: h.label }))
      )
      .sort((a, b) => {
        const lastName = a.guest.last_name.localeCompare(b.guest.last_name);
        return lastName !== 0
          ? lastName
          : a.guest.first_name.localeCompare(b.guest.first_name);
      });
  }, [households]);

  const counts = useMemo(() => {
    return {
      all: rows.length,
      pending: rows.filter((r) => r.guest.rsvp_status === "pending").length,
      attending: rows.filter((r) => r.guest.rsvp_status === "attending").length,
      declined: rows.filter((r) => r.guest.rsvp_status === "declined").length,
    };
  }, [rows]);

  const filtered = rows.filter(
    (r) => filter === "all" || r.guest.rsvp_status === filter
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`letter-wide border px-4 py-2 text-sm uppercase transition-colors ${
              filter === f.id
                ? "border-ink bg-ink text-paper"
                : "border-line text-ink hover:border-ink"
            }`}
          >
            {f.label} ({counts[f.id]})
          </button>
        ))}
      </div>

      <div className="mt-6 divide-y divide-line border-t border-line">
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-base text-ink">
            No guests match this filter.
          </p>
        ) : (
          filtered.map(({ guest, householdLabel }) => (
            <div
              key={guest.id}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div>
                <p className="text-ink">
                  {guest.first_name} {guest.last_name}
                </p>
                <p className="letter-wide text-xs uppercase text-ink/70">
                  {householdLabel}
                </p>
              </div>
              <YesNoButtons
                status={guest.rsvp_status}
                onSet={(status: RsvpStatus) =>
                  startTransition(() => setGuestRsvpStatus(guest.id, status))
                }
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
