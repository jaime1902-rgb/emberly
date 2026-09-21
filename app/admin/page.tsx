import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isAdmin, passwordMatches, sessionToken } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";

export const metadata: Metadata = {
  title: "Solicitudes — organ-IA",
  robots: { index: false, follow: false },
};

async function login(formData: FormData) {
  "use server";
  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) redirect("/admin?error=1");
  (await cookies()).set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

async function logout() {
  "use server";
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin");
}

type Row = {
  id: string;
  referencia: string;
  tipo: string;
  dolor: string;
  volumen: string;
  nombre: string;
  clinica: string;
  telefono: string;
  ciudad: string;
  created_at: string;
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!(await isAdmin())) {
    const { error } = await searchParams;
    return (
      <main className="flex min-h-svh items-center justify-center px-4">
        <form action={login} className="flex w-full max-w-xs flex-col gap-4">
          <h1 className="font-display text-2xl font-semibold">Solicitudes organ-IA</h1>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            autoFocus
            required
            className="border-b-2 border-foreground/20 bg-transparent py-2 outline-none focus:border-electric"
          />
          {error && <p className="text-sm text-red-700">Contraseña incorrecta.</p>}
          <button className="bg-navy px-4 py-2 text-sm font-semibold text-white">Entrar</button>
        </form>
      </main>
    );
  }

  const sql = await getSql();
  const rows = (await sql`SELECT * FROM solicitudes ORDER BY created_at DESC`) as Row[];
  const fmt = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Madrid",
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">
          Solicitudes <span className="text-text-dim">({rows.length})</span>
        </h1>
        <div className="flex items-center gap-3 text-sm">
          <a href="/admin/export" className="border border-foreground/20 px-3 py-1.5 hover:border-electric">
            Descargar CSV
          </a>
          <form action={logout}>
            <button className="text-text-dim underline">Salir</button>
          </form>
        </div>
      </div>
      {rows.length === 0 ? (
        <p className="text-text-muted">Aún no hay solicitudes.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-foreground/20 text-xs uppercase tracking-wider text-text-dim">
                {["Fecha", "Ref.", "Nombre", "Clínica", "Teléfono", "Ciudad", "Tipo", "Problema", "Volumen"].map(
                  (h) => (
                    <th key={h} className="px-2 py-2 font-semibold">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-foreground/10 align-top">
                  <td className="px-2 py-2 whitespace-nowrap">{fmt.format(new Date(r.created_at))}</td>
                  <td className="px-2 py-2 whitespace-nowrap">{r.referencia}</td>
                  <td className="px-2 py-2 font-medium">{r.nombre}</td>
                  <td className="px-2 py-2">{r.clinica}</td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <a href={`https://wa.me/${r.telefono.replace(/\D/g, "")}`} className="underline">
                      {r.telefono}
                    </a>
                  </td>
                  <td className="px-2 py-2">{r.ciudad}</td>
                  <td className="px-2 py-2">{r.tipo}</td>
                  <td className="px-2 py-2">{r.dolor}</td>
                  <td className="px-2 py-2">{r.volumen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
