"use client";

import { useRef, useState, useTransition } from "react";
import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { addPhoto, deletePhoto } from "@/actions/photos";
import type { Photo } from "@/lib/db";

export function PhotosTab({ photos }: { photos: Photo[] }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");

    try {
      for (const file of Array.from(files)) {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/photos/upload",
        });
        await addPhoto(blob.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-3 border border-dashed border-line p-10 text-center">
        <p className="text-ink">Upload engagement photos</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="photo-upload"
        />
        <label
          htmlFor="photo-upload"
          className="letter-wide cursor-pointer border border-ink px-8 py-3 text-sm uppercase text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          {uploading ? "Uploading..." : "Choose photos"}
        </label>
        {error && <p className="text-base text-red-700">{error}</p>}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative aspect-square overflow-hidden bg-paper-alt">
            <Image src={photo.url} alt={photo.caption ?? ""} fill className="object-cover" sizes="200px" />
            <button
              type="button"
              onClick={() => startTransition(() => deletePhoto(photo.id, photo.url))}
              className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center bg-ink/70 text-sm text-paper group-hover:flex"
              aria-label="Delete photo"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
