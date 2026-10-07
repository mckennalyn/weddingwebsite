"use client";

import { useState, useTransition } from "react";
import {
  findHouseholdByFullName,
  submitRsvp,
  type SearchResultHousehold,
} from "@/actions/rsvp";

function fullName(g: { firstName: string; lastName: string }) {
  return `${g.firstName} ${g.lastName}`;
}

export function RsvpFlow() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<SearchResultHousehold | null>(null);
  const [responses, setResponses] = useState<Record<string, boolean>>({});
  const [plusOneNames, setPlusOneNames] = useState<
    Record<string, { first: string; last: string }>
  >({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [isSearching, startSearch] = useTransition();
  const [isSubmitting, startSubmit] = useTransition();

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const name = query.trim();
    if (name.split(/\s+/).length < 2) {
      setLookupError("Please enter your first and last name.");
      return;
    }
    setLookupError("");
    startSearch(async () => {
      try {
        const household = await findHouseholdByFullName(name);
        if (!household) {
          setLookupError(
            "We couldn't find an invitation under that name. Please check the spelling, or reach out to us directly."
          );
          return;
        }
        const initial: Record<string, boolean> = {};
        const names: Record<string, { first: string; last: string }> = {};
        for (const guest of household.guests) {
          if (guest.rsvpStatus !== "pending") {
            initial[guest.id] = guest.rsvpStatus === "attending";
          }
          if (guest.isPlusOne) {
            names[guest.id] = { first: guest.firstName, last: guest.lastName };
          }
        }
        setResponses(initial);
        setPlusOneNames(names);
        setStatus("idle");
        setErrorMessage("");
        setSelected(household);
      } catch {
        setLookupError(
          "We couldn't reach the guest list just now. Please try again in a moment."
        );
      }
    });
  }

  function handleSubmit() {
    if (!selected) return;
    const answered = selected.guests.every((g) => g.id in responses);
    if (!answered) {
      setErrorMessage("Please respond for everyone in your party.");
      setStatus("error");
      return;
    }
    const missingName = selected.guests.some(
      (g) =>
        g.isPlusOne &&
        responses[g.id] &&
        (!plusOneNames[g.id]?.first.trim() || !plusOneNames[g.id]?.last.trim())
    );
    if (missingName) {
      setErrorMessage("Please enter your guest's first and last name.");
      setStatus("error");
      return;
    }

    startSubmit(async () => {
      try {
        const result = await submitRsvp(
          selected.householdId,
          selected.guests.map((g) => ({
            guestId: g.id,
            attending: responses[g.id],
            ...(g.isPlusOne && responses[g.id]
              ? {
                  firstName: plusOneNames[g.id]?.first,
                  lastName: plusOneNames[g.id]?.last,
                }
              : {}),
          }))
        );
        if (result.success) {
          setStatus("success");
        } else {
          setErrorMessage(result.error ?? "Something went wrong.");
          setStatus("error");
        }
      } catch {
        setErrorMessage("Something went wrong. Please try again.");
        setStatus("error");
      }
    });
  }

  if (status === "success" && selected) {
    return (
      <div className="text-center">
        <p className="font-display text-3xl italic text-ink">
          Thank you!
        </p>
        <p className="mt-4 text-ink/70">
          We&apos;ve saved your response for {selected.guests
            .filter((g) => !g.isPlusOne || responses[g.id])
            .map((g) =>
              g.isPlusOne
                ? `${plusOneNames[g.id]?.first.trim()} ${plusOneNames[g.id]?.last.trim()}`
                : fullName(g)
            )
            .join(", ")}.
        </p>
      </div>
    );
  }

  if (selected) {
    return (
      <div>
        <p className="text-center text-ink/70">
          Please respond for each member of your party.
        </p>

        <div className="mt-8 divide-y divide-line">
          {selected.guests.map((guest) => (
            <div key={guest.id} className="py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-display text-xl text-ink">
                {guest.isPlusOne ? "Your guest" : fullName(guest)}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setResponses((r) => ({ ...r, [guest.id]: true }))
                  }
                  className={`letter-wide border px-4 py-2 text-xs uppercase transition-colors ${
                    responses[guest.id] === true
                      ? "border-ink bg-ink text-paper"
                      : "border-line text-ink/70 hover:border-ink"
                  }`}
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setResponses((r) => ({ ...r, [guest.id]: false }))
                  }
                  className={`letter-wide border px-4 py-2 text-xs uppercase transition-colors ${
                    responses[guest.id] === false
                      ? "border-ink bg-ink text-paper"
                      : "border-line text-ink/70 hover:border-ink"
                  }`}
                >
                  Decline
                </button>
              </div>
            </div>
            {guest.isPlusOne && responses[guest.id] === true && (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={plusOneNames[guest.id]?.first ?? ""}
                  onChange={(e) =>
                    setPlusOneNames((n) => ({
                      ...n,
                      [guest.id]: { first: e.target.value, last: n[guest.id]?.last ?? "" },
                    }))
                  }
                  placeholder="Guest's first name"
                  autoComplete="off"
                  className="border-b border-line bg-transparent px-2 py-2 text-ink outline-none focus:border-ink"
                />
                <input
                  type="text"
                  value={plusOneNames[guest.id]?.last ?? ""}
                  onChange={(e) =>
                    setPlusOneNames((n) => ({
                      ...n,
                      [guest.id]: { first: n[guest.id]?.first ?? "", last: e.target.value },
                    }))
                  }
                  placeholder="Guest's last name"
                  autoComplete="off"
                  className="border-b border-line bg-transparent px-2 py-2 text-ink outline-none focus:border-ink"
                />
              </div>
            )}
            </div>
          ))}
        </div>

        {status === "error" && (
          <p className="mt-4 text-center text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <div className="mt-6 flex flex-col items-center gap-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="letter-wide border border-ink bg-ink px-8 py-3 text-xs uppercase text-paper transition-colors hover:bg-paper hover:text-ink disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Submit RSVP"}
          </button>
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setQuery("");
              setStatus("idle");
            }}
            className="letter-wide border border-line px-4 py-2 text-xs font-medium uppercase text-ink/70 transition-colors hover:border-ink hover:text-ink"
          >
            Not your invitation? Search again
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleLookup}>
      <label
        htmlFor="rsvp-name"
        className="letter-wide block text-center text-xs font-medium uppercase text-ink/75"
      >
        Enter your full name
      </label>
      <input
        id="rsvp-name"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="First and last name"
        className="mt-4 w-full border-b border-line bg-transparent px-2 py-3 text-center font-display text-2xl text-ink outline-none focus:border-ink"
        autoComplete="off"
      />

      {lookupError && (
        <p className="mt-4 text-center text-sm text-red-700">{lookupError}</p>
      )}

      <div className="mt-8 flex justify-center">
        <button
          type="submit"
          disabled={isSearching || query.trim().length === 0}
          className="letter-wide border border-ink bg-ink px-8 py-3 text-xs uppercase text-paper transition-colors hover:bg-paper hover:text-ink disabled:opacity-50"
        >
          {isSearching ? "Searching..." : "Continue"}
        </button>
      </div>
    </form>
  );
}
