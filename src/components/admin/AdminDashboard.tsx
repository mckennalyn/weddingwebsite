"use client";

import { useState } from "react";
import { logoutAdmin } from "@/actions/admin-auth";
import type { HouseholdWithGuests } from "@/actions/guests-admin";
import type { Photo } from "@/lib/db";
import { GuestsTab } from "./GuestsTab";
import { AddHouseholdForm } from "./AddHouseholdForm";
import { PhotosTab } from "./PhotosTab";

type Tab = "guests" | "add" | "photos";

export function AdminDashboard({
  households,
  photos,
}: {
  households: HouseholdWithGuests[];
  photos: Photo[];
}) {
  const [tab, setTab] = useState<Tab>("guests");

  const tabs: { id: Tab; label: string }[] = [
    { id: "guests", label: "Guest List" },
    { id: "add", label: "Add Household" },
    { id: "photos", label: "Photos" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl italic text-ink">Administration</h1>
        <form action={logoutAdmin}>
          <button type="submit" className="letter-wide text-xs uppercase text-ink hover:text-ink">
            Log out
          </button>
        </form>
      </div>

      <div className="mt-8 flex gap-6 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`letter-wide -mb-px border-b-2 px-1 pb-3 text-xs uppercase transition-colors ${
              tab === t.id ? "border-gold text-gold-deep" : "border-transparent text-ink hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {tab === "guests" && <GuestsTab households={households} />}
        {tab === "add" && <AddHouseholdForm />}
        {tab === "photos" && <PhotosTab photos={photos} />}
      </div>
    </div>
  );
}
