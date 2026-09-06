"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/faq", label: "FAQs" },
  { href: "/rsvp", label: "RSVP" },
  { href: "/photos", label: "Photos" },
  { href: "/registry", label: "Registry" },
];

export function Nav() {
  const pathname = usePathname();

  // The home page renders its own nav, overlaid on its photo hero.
  if (pathname === "/") return null;

  return (
    <nav className="flex flex-wrap items-center justify-center gap-8 py-11 sm:gap-13">
      {links.map((link) => {
        const active =
          pathname === link.href ||
          (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`letter-wide text-xs font-medium uppercase transition-colors ${
              active
                ? "border-b border-ink pb-1 text-ink"
                : "text-ink/70 hover:text-ink"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
