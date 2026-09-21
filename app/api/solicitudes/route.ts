import { after } from "next/server";
import { getSql } from "@/lib/db";
import { notifyNuevaSolicitud } from "@/lib/notify";

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Solicitud no válida" }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (clean(body.web, 100)) return Response.json({ ok: true });

  const referencia = clean(body.referencia, 40);
  const nombre = clean(body.nombre, 120);
  const telefono = clean(body.telefono, 30);
  if (!referencia || nombre.length < 2 || telefono.replace(/\D/g, "").length < 9) {
    return Response.json({ error: "Datos incompletos" }, { status: 400 });
  }

  try {
    const s = {
      referencia,
      tipo: clean(body.tipo, 80),
      dolor: clean(body.dolor, 200),
      volumen: clean(body.volumen, 80),
      nombre,
      clinica: clean(body.clinica, 160),
      telefono,
      ciudad: clean(body.ciudad, 80),
    };
    const sql = await getSql();
    const inserted = await sql`
      INSERT INTO solicitudes (referencia, tipo, dolor, volumen, nombre, clinica, telefono, ciudad)
      VALUES (${s.referencia}, ${s.tipo}, ${s.dolor}, ${s.volumen}, ${s.nombre}, ${s.clinica}, ${s.telefono}, ${s.ciudad})
      ON CONFLICT (referencia) DO NOTHING
      RETURNING id
    `;
    if (inserted.length) after(() => notifyNuevaSolicitud(s));
    return Response.json({ ok: true });
  } catch (err) {
    console.error("solicitudes insert failed", err);
    return Response.json({ error: "No se pudo guardar" }, { status: 500 });
  }
}
