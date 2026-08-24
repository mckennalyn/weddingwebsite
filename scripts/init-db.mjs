// One-time setup: creates the households/guests/photos tables.
// Run with: npm run db:init
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!connectionString) {
  console.error(
    "Missing DATABASE_URL (or POSTGRES_URL). Set it in .env.local first."
  );
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(path.join(__dirname, "schema.sql"), "utf8");

const sql = postgres(connectionString, { ssl: "require" });

try {
  await sql.unsafe(schema);
  console.log("Database schema is up to date.");
} finally {
  await sql.end();
}
