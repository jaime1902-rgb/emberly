type Solicitud = {
  referencia: string;
  tipo: string;
  dolor: string;
  volumen: string;
  nombre: string;
  clinica: string;
  telefono: string;
  ciudad: string;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Emails a new-application alert via Resend. Never throws: saving the lead matters more. */
export async function notifyNuevaSolicitud(s: Solicitud) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!key || !to) return;

  const rows: [string, string][] = [
    ["Referencia", s.referencia],
    ["Nombre", s.nombre],
    ["Clínica", s.clinica],
    ["Teléfono", s.telefono],
    ["Ciudad", s.ciudad],
    ["Tipo", s.tipo],
    ["Problema principal", s.dolor],
    ["Volumen", s.volumen],
  ];
  const html = `<h2>Nueva solicitud de plaza</h2><table cellpadding="6">${rows
    .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v || "—")}</td></tr>`)
    .join("")}</table>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? "organ-IA <onboarding@resend.dev>",
        to: [to],
        subject: `Nueva solicitud: ${s.nombre}${s.clinica ? ` (${s.clinica})` : ""}`,
        html,
      }),
    });
    if (!res.ok) console.error("resend failed", res.status, await res.text());
  } catch (err) {
    console.error("resend error", err);
  }
}
