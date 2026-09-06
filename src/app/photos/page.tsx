import type { Metadata } from "next";
import Image from "next/image";
import { getPhotos } from "@/actions/photos";
import { couple } from "@/content/site";
import { WavyFrame } from "@/components/WavyFrame";

export const metadata: Metadata = { title: "Photos" };
export const dynamic = "force-dynamic";

function PlaceholderTile({ index }: { index: number }) {
  const initials = `${couple.partnerOneFirstName[0]}${couple.partnerTwoFirstName[0]}`;
  return (
    <div className="relative flex aspect-4/5 items-center justify-center bg-paper-alt">
      <p className="font-script text-4xl font-normal text-ink/40">{initials}</p>
      <WavyFrame className="text-ink" seed={index + 1} />
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
    <div className="mx-auto max-w-5xl px-6 pt-10 pb-16 sm:pb-24">
      <h1 className="text-center font-display text-4xl italic text-ink sm:text-5xl">
        Photos
      </h1>

      {photos.length === 0 ? (
        <div>
          <p className="mt-8 text-center text-sm text-ink/50">
            Our engagement photos are on their way &mdash; here&apos;s a
            placeholder for now.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PlaceholderTile key={i} index={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-3">
          {photos.map((photo, i) => (
            <figure key={photo.id} className="relative aspect-4/5">
              <div className="absolute inset-2.5 overflow-hidden">
                <Image
                  src={photo.url}
                  alt={photo.caption ?? ""}
                  fill
                  className="object-cover grayscale contrast-125"
                  sizes="(min-width: 640px) 33vw, 50vw"
                />
              </div>
              <WavyFrame className="text-ink" seed={i + 1} />
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
