import type { Metadata } from "next";
import Image from "next/image";
import { getPhotos } from "@/actions/photos";
import { couple } from "@/content/site";

export const metadata: Metadata = { title: "Photos" };
export const dynamic = "force-dynamic";

function PlaceholderTile({ index }: { index: number }) {
  const initials = `${couple.partnerOneFirstName[0]}${couple.partnerTwoFirstName[0]}`;
  return (
    <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-paper-alt">
      <div
        className="absolute inset-4 border border-gold-soft/60"
        style={{ transform: `rotate(${(index % 2 === 0 ? 1 : -1) * 0.6}deg)` }}
        aria-hidden
      />
      <p className="font-script text-4xl text-gold-soft">{initials}</p>
    </div>
  );
}

export default async function PhotosPage() {
  let photos: Awaited<ReturnType<typeof getPhotos>> = [];
  try {
    photos = await getPhotos();
  } catch {
    // Database isn't connected yet — fall through to placeholder tiles.
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <h1 className="text-center font-display text-4xl italic text-ink sm:text-5xl">
        Photos
      </h1>
      <div className="mx-auto my-8 h-px w-16 bg-gold-soft" aria-hidden />

      {photos.length === 0 ? (
        <div>
          <p className="text-center text-sm text-ink/50">
            Our engagement photos are on their way &mdash; here&apos;s a
            placeholder for now.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PlaceholderTile key={i} index={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo) => (
            <figure
              key={photo.id}
              className="relative aspect-[4/5] overflow-hidden bg-paper-alt"
            >
              <Image
                src={photo.url}
                alt={photo.caption ?? ""}
                fill
                className="object-cover"
                sizes="(min-width: 640px) 33vw, 50vw"
              />
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
