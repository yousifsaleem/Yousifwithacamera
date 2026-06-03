import type { Project } from "@/src/data/projects";

type ProjectMetaProps = {
  project: Project;
  isHidden?: boolean;
};

export function ProjectMeta({ project, isHidden = false }: ProjectMetaProps) {
  const visibleTags = project.tags.slice(0, 2);

  return (
    <div
      className={`max-w-2xl transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isHidden ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <h1 className="text-[12px] font-bold uppercase leading-5 tracking-[0.1em] text-[var(--ink)] md:text-[13px]">
        {project.title}
      </h1>
      <p className="mt-2 max-w-lg text-[12px] font-bold uppercase leading-5 tracking-[0.1em] text-[var(--muted)] md:text-[13px]">
        {project.subheading}
      </p>
      <p className="mt-2 max-w-lg text-[11px] font-bold uppercase leading-5 tracking-[0.12em] text-[var(--muted)] md:text-[12px]">
        {project.year} {"\u2014"} {visibleTags.join(" / ")}
      </p>
    </div>
  );
}
