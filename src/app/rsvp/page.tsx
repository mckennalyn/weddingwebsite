import type { Metadata } from "next";
import { RsvpFlow } from "@/components/RsvpFlow";

export const metadata: Metadata = { title: "RSVP" };

export default function RsvpPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16 sm:py-24">
      <h1 className="text-center font-display text-4xl italic text-ink sm:text-5xl">
        RSVP
      </h1>
      <div className="mx-auto my-8 h-px w-16 bg-gold-soft" aria-hidden />
      <RsvpFlow />
    </div>
  );
}
