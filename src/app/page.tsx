import Link from "next/link";
import Image from "next/image";
import { couple } from "@/content/site";
import { getPhotos } from "@/actions/photos";

export const dynamic = "force-dynamic";

const links = [
  { href: "/", label: "Home" },
  { href: "/faq", label: "FAQs" },
  { href: "/rsvp", label: "RSVP" },
  { href: "/photos", label: "Photos" },
  { href: "/registry", label: "Registry" },
];

export default async function HomePage() {
  let heroSrc = "/hero-placeholder.jpg";
  try {
    const photos = await getPhotos();
    if (photos[0]) heroSrc = photos[0].url;
  } catch {
    // Database isn't connected yet — fall back to the bundled placeholder.
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-ink">
      <Image
        src={heroSrc}
        alt=""
        fill
        priority
        className="object-cover object-[center_30%] grayscale contrast-[1.08]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/75" />

      <nav className="relative z-10 flex flex-wrap items-center justify-center gap-8 pt-11 sm:gap-13">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`letter-wide text-xs font-medium uppercase transition-colors ${
              link.href === "/"
                ? "border-b border-paper pb-1 text-paper"
                : "text-paper/70 hover:text-paper"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-6 text-center">
        <p className="letter-wide text-xs font-medium uppercase text-paper/90">
          The Wedding Of
        </p>
        <h1 className="mt-5 font-display text-6xl leading-[0.92] font-normal text-paper italic sm:text-8xl">
          <div>{couple.partnerOneFirstName}</div>
          <div className="my-4 text-2xl font-medium text-paper/90 sm:text-4xl">&amp;</div>
          <div>{couple.partnerTwoFirstName}</div>
        </h1>
        <div className="my-8 h-px w-15 bg-paper/40" aria-hidden />
        <p className="font-display text-xl text-paper sm:text-2xl">
          {couple.weddingDateDisplay}
        </p>
        <p className="letter-wide mt-2 mb-10 text-xs font-medium uppercase text-paper/90">
          {couple.venueName} &middot; {couple.venueAddress}
        </p>
        <Link
          href="/rsvp"
          className="letter-wide bg-paper px-13 py-4.5 text-xs uppercase text-ink"
        >
          RSVP
        </Link>
      </div>
    </div>
  );
}
