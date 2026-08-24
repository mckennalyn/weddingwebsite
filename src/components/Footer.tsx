import Link from "next/link";
import { couple } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line/70 py-10 text-center">
      <p className="font-script text-3xl text-gold-deep">
        {couple.partnerOneFirstName} &amp; {couple.partnerTwoFirstName}
      </p>
      <p className="letter-wide mt-3 text-xs uppercase text-ink/60">
        {couple.weddingDateDisplay} &middot; {couple.venueName}
      </p>
      {/* Intentionally unlinked from nav — direct URL only. */}
      <Link
        href="/admin"
        aria-label="Site administration"
        className="mt-8 inline-block text-[10px] text-ink/15 transition-colors hover:text-ink/40"
      >
        &middot;
      </Link>
    </footer>
  );
}
