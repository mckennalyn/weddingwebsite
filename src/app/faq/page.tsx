import type { Metadata } from "next";
import Image from "next/image";
import { faqs, schedule } from "@/content/site";
import { scheduleIcons } from "@/components/icons";
import { WavyFrame } from "@/components/WavyFrame";

export const metadata: Metadata = { title: "FAQs" };

export default function FaqPage() {
  return (
    <div className="pb-8">
      <div className="px-6 pt-10 pb-2 text-center">
        <h1 className="font-display text-4xl italic text-ink sm:text-5xl">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="mx-auto mt-14 max-w-4xl px-6">
        <p className="letter-wide text-center text-xs font-medium uppercase text-ink/70">
          The Day&apos;s Timeline
        </p>
        <div className="mt-9 grid grid-cols-3 gap-5 sm:grid-cols-5">
          {schedule.map((item) => {
            const Icon = scheduleIcons[item.label as keyof typeof scheduleIcons];
            return (
              <div key={item.label} className="flex flex-col items-center text-center">
                <Icon className="text-ink" />
                <p className="font-display mt-3.5 text-lg text-ink">{item.time}</p>
                <p className="letter-wide text-[10px] font-medium uppercase text-ink/70">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto my-16 h-px w-full max-w-4xl bg-line" aria-hidden />

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 px-6 sm:grid-cols-[280px_1fr] sm:gap-16">
        <div className="relative mx-auto h-85 w-70 sm:mx-0">
          <div className="absolute inset-2.5 overflow-hidden">
            <Image
              src="/faq-details.jpg"
              alt=""
              fill
              className="object-cover grayscale contrast-125"
            />
          </div>
          <WavyFrame className="text-ink" />
        </div>

        <dl>
          {faqs.map((item, i) => (
            <div
              key={item.question}
              className={`py-6 ${i < faqs.length - 1 ? "border-b border-line" : ""}`}
            >
              <dt className="font-display text-xl text-ink">{item.question}</dt>
              <dd className="mt-2 leading-relaxed text-ink/75">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
