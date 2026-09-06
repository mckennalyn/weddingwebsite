import type { Metadata } from "next";
import { registry } from "@/content/site";
import { GiftIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Registry" };

export default function RegistryPage() {
  return (
    <div className="pb-8">
      <div className="mt-3 flex flex-col items-center bg-ink px-6 py-19 text-center">
        <GiftIcon className="text-paper" />
        <h1 className="mt-5 font-display text-5xl italic font-normal text-paper">
          Registry
        </h1>
        <p className="mt-4 max-w-md leading-relaxed text-paper/80">
          Your presence at our wedding is truly the greatest gift, and we are
          especially grateful to those traveling to celebrate with us. Please
          know that we do not expect a gift in addition to your time and
          effort to be here.
        </p>
        <p className="mt-4 max-w-md leading-relaxed text-paper/80">
          For those who would like to give, we have put together registries
          for our honeymoon and future home.
        </p>
      </div>

      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-7 px-6 pt-17 pb-8 sm:grid-cols-2">
        {registry.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="border border-line p-10 text-center transition-colors hover:border-ink"
          >
            <p className="font-display text-2xl text-ink">{item.name}</p>
            {item.description && (
              <p className="letter-wide mt-2 mb-5 text-[10px] font-medium uppercase text-ink/70">
                {item.description}
              </p>
            )}
            <span className="letter-wide text-xs uppercase text-ink">
              Visit &rarr;
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
