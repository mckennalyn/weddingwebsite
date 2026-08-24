"use server";

import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { getDb, type Photo } from "@/lib/db";
import { requireAdmin } from "@/lib/dal";

export async function getPhotos(): Promise<Photo[]> {
  const sql = getDb();
  return sql<Photo[]>`
    select * from photos order by sort_order asc, created_at asc
  `;
}

export async function addPhoto(url: string, caption?: string) {
  await requireAdmin();
  const sql = getDb();
  await sql`
    insert into photos (url, caption)
    values (${url}, ${caption?.trim() || null})
  `;
  revalidatePath("/photos");
  revalidatePath("/admin");
}

export async function deletePhoto(photoId: string, url: string) {
  await requireAdmin();
  const sql = getDb();
  await sql`delete from photos where id = ${photoId}`;
  try {
    await del(url);
  } catch {
    // Blob may already be gone; the DB row is the source of truth for the gallery.
  }
  revalidatePath("/photos");
  revalidatePath("/admin");
}
