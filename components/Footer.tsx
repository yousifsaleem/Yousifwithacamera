import Link from "next/link";
import { siteInfo } from "@/src/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-7 text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted)]">
      <div className="site-grid">
        <span className="col-span-12 text-[var(--ink)] sm:col-span-3 lg:col-span-2">
          {siteInfo.photographerName}
        </span>
        <span className="col-span-12 sm:col-span-3 lg:col-span-2">{siteInfo.brandName}</span>
        <a
          className="col-span-12 transition hover:text-[var(--ink)] sm:col-span-3 lg:col-span-2"
          href="https://www.instagram.com/yousifwithacamera/"
          target="_blank"
          rel="noreferrer"
        >
          {siteInfo.instagram}
        </a>
        <span className="col-span-6 sm:col-span-3 lg:col-span-2">{siteInfo.location}</span>
        <span className="col-span-6 lg:col-span-2">{year}</span>
        <Link className="col-span-12 transition hover:text-[var(--ink)] sm:text-right lg:col-span-2" href="/#top">
          Back to top
        </Link>
      </div>
    </footer>
  );
}
