"use client";

import Link from "next/link";
import type { Project } from "@/src/data/projects";
import { FallbackImage } from "./FallbackImage";

type CarouselItemProps = {
  project: Project;
  width: number;
  height: number;
  x: number;
  opacity: number;
  isActive: boolean;
  zIndex: number;
};

export function CarouselItem({
  project,
  width,
  height,
  x,
  opacity,
  isActive,
  zIndex
}: CarouselItemProps) {
  return (
    <article
      className="group absolute top-1/2 overflow-hidden bg-[var(--fallback)] shadow-[0_30px_100px_rgba(17,18,15,0.12)] will-change-transform"
      style={{
        width,
        height,
        left: 0,
        zIndex,
        opacity,
        transform: `translate3d(${x}px, -50%, 0)`,
        transition: "opacity 1200ms cubic-bezier(0.22, 1, 0.36, 1)"
      }}
      aria-hidden={!isActive}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(241,242,236,0.08),rgba(255,255,255,0.03)),radial-gradient(circle_at_70%_25%,rgba(184,186,174,0.16),transparent_38%)]" />
      <FallbackImage
        src={project.coverImage}
        alt={project.alt}
        sizes={isActive ? "(min-width: 1024px) 68vw, 86vw" : "14vw"}
        className={`object-cover transition duration-700 ${
          isActive
            ? "grayscale-0 contrast-100 group-hover:scale-[1.018]"
            : "brightness-[0.48] contrast-[1.08] saturate-[0.7]"
        }`}
        priority={isActive}
        fallbackLabel={`${project.title} image missing`}
      />
      <div className={isActive ? "absolute inset-0 bg-black/0" : "absolute inset-0 bg-[var(--fallback)]/10"} />
      {isActive ? (
        <Link
          href={`/work/${project.slug}`}
          className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-8px] focus-visible:outline-[var(--page)]"
          aria-label={`Open ${project.title} project`}
        >
          <span className="sr-only">Open {project.title}</span>
        </Link>
      ) : null}
    </article>
  );
}
