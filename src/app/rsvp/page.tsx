import type { Metadata } from "next";
import { RsvpFlow } from "@/components/RsvpFlow";
import { RingsIcon } from "@/components/icons";
import { couple } from "@/content/site";

export const metadata: Metadata = { title: "RSVP" };

export default function RsvpPage() {
  return (
    <div className="pb-8">
      <div className="mt-3 flex flex-col items-center bg-ink px-6 py-19 text-center">
        <RingsIcon className="text-paper" />
        <h1 className="mt-5 font-display text-5xl italic font-normal text-paper">
          RSVP
        </h1>
        <p className="mt-4 max-w-md leading-relaxed text-paper/80">
          We&apos;d love for you to celebrate with us. Find your invitation
          below and let us know if you can make it.
        </p>
        <p className="letter-wide mt-5 text-xs uppercase text-paper/75">
          Please reply by {couple.rsvpByDisplay}
        </p>
      </div>

      <div className="mx-auto max-w-lg px-6 pt-17 pb-8">
        <RsvpFlow />
      </div>
    </div>
  );
}
