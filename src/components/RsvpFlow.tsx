"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  searchInvitedGuests,
  submitRsvp,
  type SearchResultHousehold,
} from "@/actions/rsvp";

function fullName(g: { firstName: string; lastName: string }) {
  return `${g.firstName} ${g.lastName}`;
}

export function RsvpFlow() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultHousehold[]>([]);
  const [selected, setSelected] = useState<SearchResultHousehold | null>(null);
  const [responses, setResponses] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [isSearching, startSearch] = useTransition();
  const [isSubmitting, startSubmit] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      return;
    }
    debounceRef.current = setTimeout(() => {
      startSearch(async () => {
        try {
          const found = await searchInvitedGuests(query);
          setResults(found);
          setSearchError(false);
        } catch {
          setSearchError(true);
        }
      });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const visibleResults = query.trim().length >= 2 ? results : [];

  function chooseHousehold(household: SearchResultHousehold) {
    setSelected(household);
    setResults([]);
    setQuery("");
    const initial: Record<string, boolean> = {};
    for (const guest of household.guests) {
      if (guest.rsvpStatus !== "pending") {
        initial[guest.id] = guest.rsvpStatus === "attending";
      }
    }
    setResponses(initial);
  }

  function handleSubmit() {
    if (!selected) return;
    const answered = selected.guests.every((g) => g.id in responses);
    if (!answered) {
      setErrorMessage("Please respond for everyone in your party.");
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
          We&apos;ve saved your response for {selected.guests.map(fullName).join(", ")}.
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
            <div
              key={guest.id}
              className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="font-display text-xl text-ink">
                {fullName(guest)}
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
          ))}
        </div>

        {status === "error" && (
          <p className="mt-4 text-center text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <div className="mt-10 flex flex-col items-center gap-4">
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
            onClick={() => setSelected(null)}
            className="letter-wide border border-line px-4 py-2 text-xs font-medium uppercase text-ink/70 transition-colors hover:border-ink hover:text-ink"
          >
            Not your invitation? Search again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="letter-wide block text-center text-xs font-medium uppercase text-ink/75">
        Find your invitation
      </label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your first or last name"
        className="mt-4 w-full border-b border-line bg-transparent px-2 py-3 text-center font-display text-2xl text-ink outline-none focus:border-ink"
        autoComplete="off"
      />

      {isSearching && (
        <p className="mt-4 text-center text-sm text-ink/40">Searching...</p>
      )}

      {searchError && (
        <p className="mt-4 text-center text-sm text-red-700">
          We couldn&apos;t reach the guest list just now. Please try again in
          a moment.
        </p>
      )}

      {!isSearching && !searchError && query.trim().length >= 2 && visibleResults.length === 0 && (
        <p className="mt-4 text-center text-sm text-ink/50">
          We couldn&apos;t find an invitation under that name. Please try a
          different spelling, or reach out to us directly.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {visibleResults.map((household) => (
          <button
            key={household.householdId}
            type="button"
            onClick={() => chooseHousehold(household)}
            className="border border-line px-6 py-4 text-left transition-colors hover:border-ink"
          >
            <p className="text-ink">
              {household.guests.map(fullName).join(", ")}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
