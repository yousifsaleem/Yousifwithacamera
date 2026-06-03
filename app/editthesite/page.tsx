import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { projects } from "@/src/data/projects";
import { siteInfo } from "@/src/data/site";
import { AdminEditor } from "./AdminEditor";

async function unlockEditor(formData: FormData) {
  "use server";

  const configuredPassword = process.env.SITE_ADMIN_PASSWORD;
  const submittedPassword = String(formData.get("password") ?? "");

  if (!configuredPassword || submittedPassword !== configuredPassword) {
    redirect("/editthesite?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set("ys_site_admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/editthesite",
    maxAge: 60 * 60 * 4
  });

  redirect("/editthesite");
}

export default async function EditTheSitePage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const configuredPassword = process.env.SITE_ADMIN_PASSWORD;
  const cookieStore = await cookies();
  const isUnlocked = Boolean(configuredPassword) && cookieStore.get("ys_site_admin")?.value === "1";
  const params = searchParams ? await searchParams : {};

  if (!configuredPassword) {
    return (
      <main className="min-h-screen bg-[#f1f2ec] px-6 py-24 font-sans text-[#11120f]">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f9188]">Editor locked</p>
          <h1 className="mt-4 text-6xl font-extrabold leading-[0.9] tracking-[-0.06em]">
            Set an admin password first.
          </h1>
          <p className="mt-6 leading-7 text-[#6f7169]">
            Add <code>SITE_ADMIN_PASSWORD</code> to your local environment or Vercel project settings before using this starter editor.
          </p>
        </div>
      </main>
    );
  }

  if (!isUnlocked) {
    return (
      <main className="min-h-screen bg-[#f1f2ec] px-6 py-24 font-sans text-[#11120f]">
        <form action={unlockEditor} className="mx-auto max-w-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f9188]">Protected editor</p>
          <h1 className="mt-4 text-6xl font-extrabold leading-[0.9] tracking-[-0.06em]">Edit the site.</h1>
          <label className="mt-10 grid gap-3 text-xs font-bold uppercase tracking-[0.16em] text-[#8f9188]">
            Password
            <input
              name="password"
              type="password"
              className="border border-[#11120f]/15 bg-transparent px-4 py-3 text-base normal-case tracking-normal text-[#11120f] outline-none focus:border-[#11120f]"
              required
            />
          </label>
          {params.error ? (
            <p className="mt-4 text-sm text-red-700">Incorrect password.</p>
          ) : null}
          <button
            type="submit"
            className="mt-7 inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.18em] text-[#11120f]"
          >
            Unlock
            <span className="h-px w-12 bg-current" />
          </button>
          <p className="mt-8 text-sm leading-6 text-[#6f7169]">
            This is a basic starter gate for local editing. Upgrade it before using it as a real public admin area.
          </p>
        </form>
      </main>
    );
  }

  return <AdminEditor initialProjects={projects} initialSiteInfo={siteInfo} />;
}
