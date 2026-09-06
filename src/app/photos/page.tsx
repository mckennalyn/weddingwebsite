import type { Metadata } from "next";
import Image from "next/image";
import { getPhotos } from "@/actions/photos";
import { couple } from "@/content/site";
import { PolaroidFrame } from "@/components/PolaroidFrame";

export const metadata: Metadata = { title: "Photos" };
export const dynamic = "force-dynamic";

function PlaceholderTile() {
  const initials = `${couple.partnerOneFirstName[0]}${couple.partnerTwoFirstName[0]}`;
  return (
    <PolaroidFrame>
      <div className="flex h-full w-full items-center justify-center bg-ink/5">
        <p className="font-script text-2xl font-normal text-ink/40">{initials}</p>
      </div>
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
          {Array.from({ length: 6 }).map((_, i) => (
            <PlaceholderTile key={i} />
          ))}
        </div>
      ) : (
        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-3">
          {photos.map((photo) => (
            <figure key={photo.id}>
              <PolaroidFrame>
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
