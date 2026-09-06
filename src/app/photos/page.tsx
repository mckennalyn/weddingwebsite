import type { Metadata } from "next";
import Image from "next/image";
import { getPhotos } from "@/actions/photos";
import { PolaroidFrame } from "@/components/PolaroidFrame";

export const metadata: Metadata = { title: "Photos" };
export const dynamic = "force-dynamic";

const PLACEHOLDER_COUNT = 6;

function PlaceholderTile({ index }: { index: number }) {
  // Tile 0 is a real engagement photo shown in color; the rest are
  // generic stock placeholders kept in the site's grayscale look.
  const isRealPhoto = index === 0;
  return (
    <PolaroidFrame tiltIndex={index}>
      <Image
        src={`/photo-placeholder-${index + 1}.jpg`}
        alt=""
        fill
        className={`object-cover ${isRealPhoto ? "" : "grayscale contrast-125"}`}
        sizes="(min-width: 640px) 33vw, 50vw"
      />
    </PolaroidFrame>
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
        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-3">
          {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
            <PlaceholderTile key={i} index={i} />
          ))}
        </div>
      ) : (
        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-3">
          {photos.map((photo, i) => (
            <figure key={photo.id}>
              <PolaroidFrame tiltIndex={i}>
                <Image
                  src={photo.url}
                  alt={photo.caption ?? ""}
                  fill
                  className="object-cover grayscale contrast-125"
                  sizes="(min-width: 640px) 33vw, 50vw"
                />
              </PolaroidFrame>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
