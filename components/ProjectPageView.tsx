"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Project } from "@/src/data/projects";
import { FallbackImage } from "./FallbackImage";

type ProjectPageViewProps = {
  project: Project;
};

export function ProjectPageView({ project }: ProjectPageViewProps) {
  const galleryImages = project.galleryImages.length > 0 ? project.galleryImages : [project.coverImage];

  return (
    <main className="min-h-screen bg-[var(--page)] pb-24 pt-32 text-[var(--ink)] md:pt-36">
      <motion.section
        className="site-grid items-end"
        initial={{ opacity: 0, y: 36, scaleY: 0.985 }}
        animate={{ opacity: 1, y: 0, scaleY: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="col-span-12 lg:col-span-5">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-4 text-[0.78rem] font-bold uppercase tracking-[0.18em] text-[var(--muted)] transition hover:text-[var(--ink)]"
          >
            <span className="h-px w-12 bg-current" />
            Back to work
          </Link>
          <h1 className="mt-10 text-[clamp(3rem,7.4vw,8rem)] font-extrabold leading-[0.86] tracking-[-0.07em] text-[var(--ink)]">
            {project.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg font-semibold leading-7 text-[var(--muted)] md:text-xl">
            {project.subheading}
          </p>
          <p className="mt-5 max-w-xl text-[0.85rem] font-bold uppercase leading-6 tracking-[0.14em] text-[var(--muted)]">
            {project.year} {"\u2014"} {project.tags.join(" / ")}
          </p>
          <p className="mt-10 max-w-xl text-base font-medium leading-8 text-[#5f625a] md:text-lg md:leading-9">
            {project.description}
          </p>
        </div>

        <div className="relative col-span-12 mt-12 aspect-video overflow-hidden bg-[var(--fallback)] shadow-[0_30px_100px_rgba(17,18,15,0.12)] lg:col-span-7 lg:mt-0">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(241,242,236,0.08),rgba(255,255,255,0.03)),radial-gradient(circle_at_70%_25%,rgba(184,186,174,0.16),transparent_38%)]" />
          <FallbackImage
            src={project.coverImage}
            alt={project.alt}
            sizes="(min-width: 1024px) 58vw, 100vw"
            priority
            className="object-cover"
            fallbackLabel={`${project.title} cover image missing`}
          />
        </div>
      </motion.section>

      <section className="site-grid mt-24 md:mt-32" aria-label={`${project.title} gallery`}>
        <div className="col-span-12 grid gap-[var(--grid-gap)] lg:grid-cols-12">
          {galleryImages.map((image, index) => (
            <motion.figure
              key={`${image}-${index}`}
              className={`relative overflow-hidden bg-[var(--fallback)] ${
                index === 0
                  ? "aspect-video lg:col-span-8"
                  : index % 3 === 0
                    ? "aspect-[4/5] lg:col-span-5"
                    : "aspect-[4/3] lg:col-span-4"
              }`}
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.28 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(241,242,236,0.08),rgba(255,255,255,0.03)),radial-gradient(circle_at_70%_25%,rgba(184,186,174,0.16),transparent_38%)]" />
              <FallbackImage
                src={image}
                alt={`${project.title} gallery image ${index + 1}`}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                fallbackLabel={`Gallery image ${index + 1} missing`}
              />
            </motion.figure>
          ))}
        </div>
      </section>
    </main>
  );
}
