"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { couple } from "@/content/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/faq", label: "FAQs" },
  { href: "/rsvp", label: "RSVP" },
  { href: "/photos", label: "Photos" },
  { href: "/registry", label: "Registry" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-xl tracking-wide text-ink"
          onClick={() => setOpen(false)}
        >
          {couple.partnerOneFirstName}
          <span className="mx-2 text-gold">&amp;</span>
          {couple.partnerTwoFirstName}
        </Link>

        <nav className="hidden gap-8 md:flex">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`letter-wide text-xs uppercase transition-colors ${
                  active
                    ? "text-gold-deep"
                    : "text-ink/70 hover:text-gold-deep"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="letter-wide text-xs uppercase text-ink/70 md:hidden"
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-line/70 px-6 py-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="letter-wide py-2 text-xs uppercase text-ink/70"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
