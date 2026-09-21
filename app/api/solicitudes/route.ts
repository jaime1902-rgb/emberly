import { getSql } from "@/lib/db";

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
    const sql = await getSql();
    await sql`
      INSERT INTO solicitudes (referencia, tipo, dolor, volumen, nombre, clinica, telefono, ciudad)
      VALUES (${referencia}, ${clean(body.tipo, 80)}, ${clean(body.dolor, 200)}, ${clean(body.volumen, 80)},
              ${nombre}, ${clean(body.clinica, 160)}, ${telefono}, ${clean(body.ciudad, 80)})
      ON CONFLICT (referencia) DO NOTHING
    `;
    return Response.json({ ok: true });
  } catch (err) {
    console.error("solicitudes insert failed", err);
    return Response.json({ error: "No se pudo guardar" }, { status: 500 });
  }
}
