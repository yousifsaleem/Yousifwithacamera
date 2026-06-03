import Link from "next/link";
import { Clock } from "./Clock";
import { siteInfo } from "@/src/data/site";

export function Header() {
  return (
    <header className="pointer-events-auto fixed inset-x-0 top-0 z-[1000] py-5 text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--muted)] md:text-[13px]">
      <nav className="site-grid relative min-h-9 items-start" aria-label="Primary navigation">
        <Link
          href="/#top"
          className="col-span-4 leading-[1.2] text-[var(--ink)] transition duration-300 hover:-translate-y-0.5 hover:text-[var(--muted)] lg:absolute lg:left-[var(--page-margin)] lg:top-0"
        >
          {siteInfo.location.toUpperCase()}
        </Link>

        <div className="col-span-3 hidden text-[var(--ink)] lg:absolute lg:left-[var(--home-rect-edge-guide)] lg:top-0 lg:block lg:text-left">
          <Clock />
        </div>

        <Link
          href="/#top"
          className="absolute left-1/2 top-0 hidden -translate-x-1/2 text-center text-[var(--ink)] transition duration-300 hover:-translate-y-0.5 hover:text-[var(--muted)] lg:block"
        >
          {siteInfo.brandName.toUpperCase()}
        </Link>

        <Link
          href="/#top"
          className="col-span-3 justify-self-end text-[var(--ink)] transition duration-300 hover:-translate-y-0.5 hover:text-[var(--muted)] sm:col-span-2 lg:absolute lg:right-[var(--home-rect-edge-guide)] lg:top-0 lg:text-right"
        >
          WORK
        </Link>

        <Link
          href="/#about"
          className="col-span-3 justify-self-end text-[var(--ink)] transition duration-300 hover:-translate-y-0.5 hover:text-[var(--muted)] sm:col-span-3 lg:absolute lg:right-[var(--page-margin)] lg:top-0"
        >
          ABOUT
        </Link>
      </nav>
    </header>
  );
}
