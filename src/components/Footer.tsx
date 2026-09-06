import Link from "next/link";
import { couple } from "@/content/site";
import { HeartIcon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="flex flex-col items-center px-6 py-14 text-center">
      <HeartIcon className="mb-4 text-ink" />
      <p className="font-script text-2xl font-normal text-ink">
        {couple.partnerOneFirstName} &amp; {couple.partnerTwoFirstName}
      </p>
      {/* Intentionally unlinked from nav — direct URL only. */}
      <Link
        href="/admin"
        aria-label="Site administration"
        className="mt-6 inline-block text-[10px] text-ink/15 transition-colors hover:text-ink/40"
      >
        &middot;
      </Link>
    </footer>
  );
}
