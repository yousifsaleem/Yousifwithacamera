import { siteInfo } from "@/src/data/site";

export function AboutSection() {
  return (
    <section id="about" className="relative py-28 md:py-40">
      <div className="site-grid">
        <p className="col-span-12 text-[0.82rem] font-bold uppercase tracking-[0.18em] text-[var(--muted)] lg:col-span-3">
          About
        </p>

        <div className="col-span-12 lg:col-span-9">
          <p className="max-w-6xl text-[clamp(2.6rem,6.7vw,7.4rem)] font-extrabold leading-[0.9] tracking-[-0.06em] text-[var(--ink)] text-balance">
            {siteInfo.aboutText}
          </p>
          <p className="mt-10 max-w-2xl text-sm font-bold uppercase leading-7 tracking-[0.14em] text-[var(--ink)]">
            {siteInfo.contactLine}
          </p>

          <div className="mt-14 grid gap-4 border-t border-[var(--line)] pt-6 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[var(--muted)] sm:grid-cols-2 lg:grid-cols-4">
            <a className="transition hover:text-[var(--ink)]" href={`mailto:${siteInfo.email}`}>
              Email placeholder
            </a>
            <a className="transition hover:text-[var(--ink)]" href={`https://wa.me/${siteInfo.whatsapp.replace(/\D/g, "")}`}>
              WhatsApp placeholder
            </a>
            <a
              className="transition hover:text-[var(--ink)]"
              href="https://www.instagram.com/yousifwithacamera/"
              target="_blank"
              rel="noreferrer"
            >
              {siteInfo.instagram}
            </a>
            <a className="transition hover:text-[var(--ink)]" href={`tel:${siteInfo.phone.replace(/\s/g, "")}`}>
              Phone placeholder
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
