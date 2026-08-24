import type { Metadata } from "next";
import { registry } from "@/content/site";

export const metadata: Metadata = { title: "Registry" };

export default function RegistryPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center sm:py-24">
      <h1 className="font-display text-4xl italic text-ink sm:text-5xl">
        Registry
      </h1>
      <div className="mx-auto my-8 h-px w-16 bg-gold-soft" aria-hidden />
      <p className="text-ink/70">
        Your presence is the greatest gift of all. For those who&apos;ve
        asked, we&apos;ve put together a few registries below.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {registry.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="group border border-line p-8 transition-colors hover:border-gold"
          >
            <p className="font-display text-2xl text-ink group-hover:text-gold-deep">
              {item.name}
            </p>
            {item.description && (
              <p className="mt-2 text-sm text-ink/60">{item.description}</p>
            )}
            <p className="letter-wide mt-4 text-xs uppercase text-gold-deep">
              Visit &rarr;
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
