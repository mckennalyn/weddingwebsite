import Link from "next/link";
import { couple } from "@/content/site";

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-20 pb-16 text-center sm:pt-28">
        <p className="letter-wide text-xs uppercase text-gold-deep">
          We&apos;re getting married
        </p>

        <h1 className="mt-6 font-script text-6xl leading-none text-ink sm:text-7xl">
          {couple.partnerOneFirstName}
          <span className="mx-3 font-display italic text-gold">&amp;</span>
          {couple.partnerTwoFirstName}
        </h1>

        <div className="my-8 h-px w-24 bg-gold-soft" aria-hidden />

        <p className="font-display text-2xl text-ink sm:text-3xl">
          {couple.weddingDateDisplay}
        </p>
        <p className="mt-2 text-ink/70">
          {couple.ceremonyTime} &middot; {couple.venueName}
        </p>
        <p className="text-ink/70">{couple.venueAddress}</p>

        <Link
          href="/rsvp"
          className="letter-wide mt-10 inline-block border border-gold px-8 py-3 text-xs uppercase text-gold-deep transition-colors hover:bg-gold hover:text-paper"
        >
          RSVP
        </Link>

        <p className="letter-wide mt-14 text-xs uppercase text-ink/40">
          {couple.hashtag}
        </p>
      </section>
    </div>
  );
}
