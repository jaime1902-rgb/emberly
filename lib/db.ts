import { neon } from "@neondatabase/serverless";

let ready: Promise<void> | null = null;

/** Lazy so `next build` doesn't need DATABASE_URL. Creates the table on first use. */
export async function getSql() {
  const sql = neon(process.env.DATABASE_URL!);
  ready ??= sql`
    CREATE TABLE IF NOT EXISTS solicitudes (
      id BIGSERIAL PRIMARY KEY,
      referencia TEXT UNIQUE NOT NULL,
      tipo TEXT,
      dolor TEXT,
      volumen TEXT,
      nombre TEXT NOT NULL,
      clinica TEXT,
      telefono TEXT NOT NULL,
      ciudad TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `.then(() => undefined);
  await ready;
  return sql;
}
