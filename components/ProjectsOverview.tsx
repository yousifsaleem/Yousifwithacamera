"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Project } from "@/src/data/projects";
import { FallbackImage } from "./FallbackImage";

type ProjectsOverviewProps = {
  projects: Project[];
};

export function ProjectsOverview({ projects }: ProjectsOverviewProps) {
  return (
    <section id="projects" className="relative min-h-screen bg-[var(--page)]" aria-label="Projects overview">
      <div className="pb-24 pt-28 md:pt-36">
        <div className="site-grid">
          <motion.div
            className="col-span-12 mb-20 grid gap-8 lg:col-span-12 lg:grid-cols-12"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[0.82rem] font-bold uppercase tracking-[0.18em] text-[var(--muted)] lg:col-span-3">
              Projects
            </p>
            <h2 className="text-[clamp(3rem,8vw,8.5rem)] font-extrabold leading-[0.86] tracking-[-0.06em] text-[var(--ink)] text-balance lg:col-span-9">
              The work opens from the carousel.
            </h2>
          </motion.div>

          <div className="col-span-12 grid gap-24">
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                className="grid min-h-[86svh] gap-8 lg:grid-cols-12 lg:items-center"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.34 }}
                transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/work/${project.slug}`}
                  className="group order-2 text-left lg:order-1 lg:col-span-4"
                  aria-label={`Open ${project.title}`}
                >
                  <span className="text-[0.76rem] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                    {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-[clamp(2.6rem,6.2vw,6.6rem)] font-extrabold leading-[0.88] tracking-[-0.06em] text-[var(--ink)]">
                    {project.title}
                  </h3>
                  <p className="mt-5 max-w-md text-base font-semibold leading-7 text-[var(--muted)] md:text-lg">
                    {project.subheading}
                  </p>
                  <p className="mt-5 max-w-md text-[0.82rem] font-bold uppercase leading-6 tracking-[0.14em] text-[var(--muted)]">
                    {project.year} {"\u2014"} {project.tags.join(" / ")}
                  </p>
                  <span className="mt-10 inline-flex items-center gap-4 text-[0.78rem] font-bold uppercase tracking-[0.18em] text-[var(--ink)]">
                    Open project
                    <span className="h-px w-12 bg-current transition group-hover:w-20" />
                  </span>
                </Link>

                <Link
                  href={`/work/${project.slug}`}
                  className="group relative order-1 aspect-video overflow-hidden bg-[var(--fallback)] shadow-[0_28px_90px_rgba(17,18,15,0.1)] lg:order-2 lg:col-span-8"
                  aria-label={`Open ${project.title} image`}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(241,242,236,0.08),rgba(255,255,255,0.03)),radial-gradient(circle_at_70%_25%,rgba(184,186,174,0.16),transparent_38%)]" />
                  <FallbackImage
                    src={project.coverImage}
                    alt={project.alt}
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.025]"
                    fallbackLabel={`${project.title} image missing`}
                  />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
