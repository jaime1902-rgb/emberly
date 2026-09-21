import { isAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";

// Prefix leading =,+,-,@ so spreadsheets don't execute submitted text as formulas.
const cell = (v: unknown) => {
  let s = v instanceof Date ? v.toISOString() : String(v ?? "");
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET() {
  if (!(await isAdmin())) return new Response("No autorizado", { status: 401 });
  const sql = await getSql();
  const rows = await sql`SELECT * FROM solicitudes ORDER BY created_at DESC`;
  const cols = ["created_at", "referencia", "nombre", "clinica", "telefono", "ciudad", "tipo", "dolor", "volumen"];
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\n");
  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="solicitudes.csv"',
    },
  });
}
