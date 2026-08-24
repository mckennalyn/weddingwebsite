import type { Metadata } from "next";
import { isAdmin } from "@/lib/dal";
import { getAllHouseholds } from "@/actions/guests-admin";
import { getPhotos } from "@/actions/photos";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <AdminLogin />;
  }

  const [households, photos] = await Promise.all([
    getAllHouseholds(),
    getPhotos(),
  ]);

  return <AdminDashboard households={households} photos={photos} />;
}
