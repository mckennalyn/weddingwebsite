import type { Metadata } from "next";
import { faqs } from "@/content/site";

export const metadata: Metadata = { title: "FAQs" };

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <h1 className="text-center font-display text-4xl italic text-ink sm:text-5xl">
        Frequently Asked Questions
      </h1>
      <div className="mx-auto my-8 h-px w-16 bg-gold-soft" aria-hidden />

      <dl className="mt-12 divide-y divide-line">
        {faqs.map((item) => (
          <div key={item.question} className="py-6">
            <dt className="font-display text-xl text-gold-deep">
              {item.question}
            </dt>
            <dd className="mt-2 leading-relaxed text-ink/80">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
