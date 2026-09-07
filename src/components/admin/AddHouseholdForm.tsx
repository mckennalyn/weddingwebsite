"use client";

import { useRef, useState, useTransition } from "react";
import { createHousehold } from "@/actions/guests-admin";

type GuestRow = { firstName: string; lastName: string };

export function AddHouseholdForm() {
  const [guestRows, setGuestRows] = useState<GuestRow[]>([
    { firstName: "", lastName: "" },
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function updateRow(index: number, field: keyof GuestRow, value: string) {
    setGuestRows((rows) =>
      rows.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }

  function addRow() {
    setGuestRows((rows) => [...rows, { firstName: "", lastName: "" }]);
  }

  function removeRow(index: number) {
    setGuestRows((rows) => rows.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createHousehold(formData);
        setSuccess(true);
        setGuestRows([{ firstName: "", lastName: "" }]);
        formRef.current?.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg space-y-6"
    >
      <div>
        <label className="letter-wide block text-sm uppercase text-ink">
          Household label
        </label>
        <input
          name="label"
          placeholder="The Smith Family"
          required
          className="mt-2 w-full border border-line px-4 py-2 text-ink outline-none placeholder:text-ink/70 focus:border-ink"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          name="addressLine1"
          placeholder="Address line 1"
          className="border border-line px-4 py-2 text-ink outline-none placeholder:text-ink/70 focus:border-ink"
        />
        <input
          name="addressLine2"
          placeholder="Address line 2"
          className="border border-line px-4 py-2 text-ink outline-none placeholder:text-ink/70 focus:border-ink"
        />
        <input
          name="city"
          placeholder="City"
          className="border border-line px-4 py-2 text-ink outline-none placeholder:text-ink/70 focus:border-ink"
        />
        <input
          name="state"
          placeholder="State"
          className="border border-line px-4 py-2 text-ink outline-none placeholder:text-ink/70 focus:border-ink"
        />
        <input
          name="postalCode"
          placeholder="Postal code"
          className="border border-line px-4 py-2 text-ink outline-none placeholder:text-ink/70 focus:border-ink"
        />
        <input
          name="country"
          placeholder="Country"
          className="border border-line px-4 py-2 text-ink outline-none placeholder:text-ink/70 focus:border-ink"
        />
      </div>

      <div>
        <p className="letter-wide text-sm uppercase text-ink">Guests</p>
        <div className="mt-3 space-y-3">
          {guestRows.map((row, i) => (
            <div key={i} className="flex gap-3">
              <input
                name="guestFirstName"
                value={row.firstName}
                onChange={(e) => updateRow(i, "firstName", e.target.value)}
                placeholder="First name"
                required
                className="flex-1 border border-line px-4 py-2 text-ink outline-none placeholder:text-ink/70 focus:border-ink"
              />
              <input
                name="guestLastName"
                value={row.lastName}
                onChange={(e) => updateRow(i, "lastName", e.target.value)}
                placeholder="Last name"
                required
                className="flex-1 border border-line px-4 py-2 text-ink outline-none placeholder:text-ink/70 focus:border-ink"
              />
              {guestRows.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="px-2 text-ink hover:text-ink"
                  aria-label="Remove guest"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addRow}
          className="letter-wide mt-3 text-sm uppercase text-ink hover:underline"
        >
          + Add another guest
        </button>
      </div>

      {error && <p className="text-base text-red-700">{error}</p>}
      {success && (
        <p className="text-base text-ink">Household added.</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="letter-wide border border-ink px-8 py-3 text-sm uppercase text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Add household"}
      </button>
    </form>
  );
}
