import "server-only";
import postgres from "postgres";

let client: ReturnType<typeof postgres> | null = null;

export function getDb() {
  if (!client) {
    const connectionString =
      process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error(
        "Missing DATABASE_URL environment variable. Set it in .env.local (or in Vercel's project settings) to your Postgres connection string."
      );
    }
    client = postgres(connectionString, { ssl: "require" });
  }
  return client;
}

export type RsvpStatus = "pending" | "attending" | "declined";

export type Household = {
  id: string;
  label: string;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  created_at: string;
};

export type Guest = {
  id: string;
  household_id: string;
  first_name: string;
  last_name: string;
  rsvp_status: RsvpStatus;
  responded_at: string | null;
  created_at: string;
};

export type Photo = {
  id: string;
  url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};
