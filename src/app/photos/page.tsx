import type { Metadata } from "next";
import Image from "next/image";
import { getPhotos } from "@/actions/photos";
import { PolaroidFrame } from "@/components/PolaroidFrame";

export const metadata: Metadata = { title: "Photos" };
export const dynamic = "force-dynamic";

const ENGAGEMENT_PHOTO_COUNT = 9;

function EngagementTile({ index }: { index: number }) {
  return (
    <PolaroidFrame tiltIndex={index}>
      <Image
        src={`/engagement-${index + 1}.jpg`}
        alt=""
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 320px, 33vw"
      />
    </PolaroidFrame>
  );
}

export default async function PhotosPage() {
  let photos: Awaited<ReturnType<typeof getPhotos>> = [];
  try {
    photos = await getPhotos();
  } catch {
    // Database isn't connected yet — fall through to engagement photos.
  }

  return (
    <div className="mx-auto max-w-5xl px-6 pt-10 pb-16 sm:pb-24">
      <h1 className="text-center font-display text-4xl italic text-ink sm:text-5xl">
        Photos
      </h1>

      {photos.length === 0 ? (
        <div className="mt-14 grid grid-cols-3 gap-3 sm:gap-6">
          {Array.from({ length: ENGAGEMENT_PHOTO_COUNT }).map((_, i) => (
            <EngagementTile key={i} index={i} />
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
