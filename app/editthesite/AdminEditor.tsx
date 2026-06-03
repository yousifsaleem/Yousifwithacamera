"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/src/data/projects";
import type { SiteInfo } from "@/src/data/site";

type AdminEditorProps = {
  initialProjects: Project[];
  initialSiteInfo: SiteInfo;
};

type ExportShape = {
  siteInfo: SiteInfo;
  projects: Project[];
};

type PreviewMap = Record<string, string>;

const storageKey = "ys-site-editor-draft";

const inputClass =
  "w-full border border-[#11120f]/15 bg-transparent px-3 py-2 text-sm font-semibold text-[#11120f] outline-none transition focus:border-[#11120f]";

const labelClass = "grid gap-2 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#8f9188]";

function publicImagePathFromFile(file: File) {
  const safeName = file.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");

  return `/images/${safeName}`;
}

function textToTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizeProject(project: Partial<Project> & { image?: string }, fallback: Project): Project {
  return {
    ...fallback,
    ...project,
    slug: project.slug ?? fallback.slug ?? project.id ?? fallback.id,
    coverImage: project.coverImage ?? project.image ?? fallback.coverImage,
    galleryImages: Array.isArray(project.galleryImages)
      ? project.galleryImages
      : [project.image ?? project.coverImage ?? fallback.coverImage],
    tags: Array.isArray(project.tags) ? project.tags : fallback.tags
  };
}

export function AdminEditor({ initialProjects, initialSiteInfo }: AdminEditorProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(initialSiteInfo);
  const [previews, setPreviews] = useState<PreviewMap>({});
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const previewsRef = useRef<PreviewMap>({});

  const exportData = useMemo<ExportShape>(() => ({ siteInfo, projects }), [projects, siteInfo]);
  const exportedJson = useMemo(() => JSON.stringify(exportData, null, 2), [exportData]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedDraft = window.localStorage.getItem(storageKey);

      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft) as Partial<ExportShape>;

          if (parsed.siteInfo) {
            setSiteInfo((current) => ({ ...current, ...parsed.siteInfo }));
          }

          if (Array.isArray(parsed.projects)) {
            setProjects(
              parsed.projects.map((project, index) =>
                normalizeProject(project as Partial<Project> & { image?: string }, initialProjects[index] ?? initialProjects[0])
              )
            );
          }
        } catch {
          window.localStorage.removeItem(storageKey);
        }
      }

      setDraftLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [initialProjects]);

  useEffect(() => {
    if (!draftLoaded) return;
    window.localStorage.setItem(storageKey, exportedJson);
  }, [draftLoaded, exportedJson]);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(() => {
    return () => {
      Object.values(previewsRef.current).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  function updateSiteField<Key extends keyof SiteInfo>(key: Key, value: SiteInfo[Key]) {
    setSiteInfo((current) => ({ ...current, [key]: value }));
  }

  function updateProject<Key extends keyof Project>(index: number, key: Key, value: Project[Key]) {
    setProjects((current) =>
      current.map((project, projectIndex) =>
        projectIndex === index ? { ...project, [key]: value } : project
      )
    );
  }

  function updateGalleryImage(projectIndex: number, imageIndex: number, value: string) {
    setProjects((current) =>
      current.map((project, index) => {
        if (index !== projectIndex) return project;

        const galleryImages = [...project.galleryImages];
        galleryImages[imageIndex] = value;

        return { ...project, galleryImages };
      })
    );
  }

  function addGalleryImage(projectIndex: number) {
    setProjects((current) =>
      current.map((project, index) =>
        index === projectIndex
          ? { ...project, galleryImages: [...project.galleryImages, "/images/new-image.jpg"] }
          : project
      )
    );
  }

  function removeGalleryImage(projectIndex: number, imageIndex: number) {
    setProjects((current) =>
      current.map((project, index) =>
        index === projectIndex
          ? { ...project, galleryImages: project.galleryImages.filter((_, galleryIndex) => galleryIndex !== imageIndex) }
          : project
      )
    );
  }

  function setFilePreview(key: string, file: File) {
    const nextPreview = URL.createObjectURL(file);
    setPreviews((current) => {
      if (current[key]) {
        URL.revokeObjectURL(current[key]);
      }

      return { ...current, [key]: nextPreview };
    });
  }

  function handleCoverFile(projectIndex: number, file: File | null) {
    if (!file) return;

    const path = publicImagePathFromFile(file);
    setFilePreview(`${projectIndex}:cover`, file);
    updateProject(projectIndex, "coverImage", path);
  }

  function handleGalleryFile(projectIndex: number, imageIndex: number, file: File | null) {
    if (!file) return;

    const path = publicImagePathFromFile(file);
    setFilePreview(`${projectIndex}:gallery:${imageIndex}`, file);
    updateGalleryImage(projectIndex, imageIndex, path);
  }

  async function copyJson() {
    await navigator.clipboard.writeText(exportedJson);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function downloadJson() {
    const blob = new Blob([exportedJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ys-photography-export.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function resetDraft() {
    window.localStorage.removeItem(storageKey);
    setProjects(initialProjects);
    setSiteInfo(initialSiteInfo);
    setPreviews({});
  }

  return (
    <main className="min-h-screen bg-[#f1f2ec] px-4 py-24 font-sans text-[#11120f] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.32fr_1fr]">
          <aside>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f9188]">Protected editor</p>
            <h1 className="mt-4 text-6xl font-extrabold leading-[0.9] tracking-[-0.06em] md:text-8xl">
              Add photos clearly.
            </h1>
            <div className="mt-7 border border-[#11120f]/10 p-5">
              <h2 className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#11120f]">
                Best way right now
              </h2>
              <ol className="mt-5 grid gap-4 text-sm font-medium leading-7 text-[#666961]">
                <li>
                  <span className="font-extrabold text-[#11120f]">01.</span> Rename the photo with lowercase words and
                  hyphens, for example <code>graduation-cover.jpg</code>.
                </li>
                <li>
                  <span className="font-extrabold text-[#11120f]">02.</span> Put the file in <code>public/images</code>.
                </li>
                <li>
                  <span className="font-extrabold text-[#11120f]">03.</span> Use the path{" "}
                  <code>/images/graduation-cover.jpg</code> in the cover or gallery image field.
                </li>
                <li>
                  <span className="font-extrabold text-[#11120f]">04.</span> Save the code and refresh. On Vercel, deploy
                  the updated files.
                </li>
              </ol>
            </div>
            <div className="mt-5 grid gap-4 text-sm font-medium leading-7 text-[#666961]">
              <p>
                The file picker below is for previewing and preparing the path. It cannot permanently upload into the
                website folder from the browser.
              </p>
              <p>
                This editor saves a temporary draft in your browser and exports JSON. For real dashboard uploads later,
                connect Vercel Blob, Cloudinary, Supabase Storage, Firebase Storage, or a CMS such as Sanity.
              </p>
            </div>
          </aside>

          <div className="grid gap-10">
            <section className="border border-[#11120f]/10 p-5 md:p-7">
              <h2 className="text-4xl font-extrabold tracking-[-0.04em]">Global site info</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {Object.entries(siteInfo).map(([key, value]) => (
                  <label
                    key={key}
                    className={`${labelClass} ${key.includes("Text") || key.includes("Line") ? "md:col-span-2" : ""}`}
                  >
                    {key}
                    {key.includes("Text") || key.includes("Line") ? (
                      <textarea
                        className={`${inputClass} min-h-32 normal-case tracking-normal`}
                        value={String(value)}
                        onChange={(event) => updateSiteField(key as keyof SiteInfo, event.target.value)}
                      />
                    ) : (
                      <input
                        className={`${inputClass} normal-case tracking-normal`}
                        value={String(value)}
                        onChange={(event) => updateSiteField(key as keyof SiteInfo, event.target.value)}
                      />
                    )}
                  </label>
                ))}
              </div>
            </section>

            {projects.map((project, projectIndex) => (
              <section key={project.id} className="border border-[#11120f]/10 p-5 md:p-7">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <h2 className="text-4xl font-extrabold tracking-[-0.04em]">{project.title}</h2>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f9188]">
                    {String(projectIndex + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-7 grid gap-6 md:grid-cols-2">
                  <label className={labelClass}>
                    id
                    <input className={inputClass} value={project.id} onChange={(event) => updateProject(projectIndex, "id", event.target.value)} />
                  </label>
                  <label className={labelClass}>
                    slug
                    <input className={inputClass} value={project.slug} onChange={(event) => updateProject(projectIndex, "slug", event.target.value)} />
                  </label>
                  <label className={labelClass}>
                    category
                    <input className={inputClass} value={project.category} onChange={(event) => updateProject(projectIndex, "category", event.target.value)} />
                  </label>
                  <label className={labelClass}>
                    title
                    <input className={inputClass} value={project.title} onChange={(event) => updateProject(projectIndex, "title", event.target.value)} />
                  </label>
                  <label className={labelClass}>
                    subheading
                    <input className={inputClass} value={project.subheading} onChange={(event) => updateProject(projectIndex, "subheading", event.target.value)} />
                  </label>
                  <label className={labelClass}>
                    year
                    <input className={inputClass} value={project.year} onChange={(event) => updateProject(projectIndex, "year", event.target.value)} />
                  </label>
                  <label className={labelClass}>
                    tags, comma separated
                    <input
                      className={inputClass}
                      value={project.tags.join(", ")}
                      onChange={(event) => updateProject(projectIndex, "tags", textToTags(event.target.value))}
                    />
                  </label>
                  <label className={labelClass}>
                    alt text
                    <input className={inputClass} value={project.alt} onChange={(event) => updateProject(projectIndex, "alt", event.target.value)} />
                  </label>

                  <div className="grid gap-4 md:col-span-2 md:grid-cols-[0.36fr_1fr]">
                    <div className="relative aspect-video overflow-hidden bg-[#151612]">
                      {/* Preview-only upload. Permanent uploads need Vercel Blob, Cloudinary, or another storage provider. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previews[`${projectIndex}:cover`] ?? project.coverImage}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.opacity = "0";
                        }}
                      />
                    </div>

                    <div className="grid gap-4">
                      <label className={labelClass}>
                        cover image path
                        <input
                          className={inputClass}
                          value={project.coverImage}
                          onChange={(event) => updateProject(projectIndex, "coverImage", event.target.value)}
                        />
                      </label>
                      <label className={labelClass}>
                        choose cover preview
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          className="block w-full text-sm font-semibold text-[#11120f] file:mr-4 file:border-0 file:bg-[#11120f] file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-[0.16em] file:text-[#f1f2ec]"
                          onChange={(event) => handleCoverFile(projectIndex, event.target.files?.[0] ?? null)}
                        />
                        <span className="normal-case tracking-normal text-[#666961]">
                          Preview only. To keep it, copy the selected file into <code>public/images</code> and keep this
                          path: <code>{project.coverImage}</code>
                        </span>
                      </label>
                    </div>
                  </div>

                  <label className={`${labelClass} md:col-span-2`}>
                    description
                    <textarea
                      className={`${inputClass} min-h-32 normal-case tracking-normal`}
                      value={project.description}
                      onChange={(event) => updateProject(projectIndex, "description", event.target.value)}
                    />
                  </label>

                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#8f9188]">
                        Gallery images
                      </h3>
                      <button
                        type="button"
                        onClick={() => addGalleryImage(projectIndex)}
                        className="text-xs font-bold uppercase tracking-[0.18em] text-[#11120f]"
                      >
                        Add image
                      </button>
                    </div>

                    <div className="mt-5 grid gap-5">
                      {project.galleryImages.map((image, imageIndex) => (
                        <div key={`${project.id}-${imageIndex}`} className="grid gap-4 border border-[#11120f]/10 p-4 md:grid-cols-[0.22fr_1fr]">
                          <div className="relative aspect-video overflow-hidden bg-[#151612]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={previews[`${projectIndex}:gallery:${imageIndex}`] ?? image}
                              alt=""
                              className="h-full w-full object-cover"
                              onError={(event) => {
                                event.currentTarget.style.opacity = "0";
                              }}
                            />
                          </div>

                          <div className="grid gap-4">
                            <label className={labelClass}>
                              gallery image path {imageIndex + 1}
                              <input className={inputClass} value={image} onChange={(event) => updateGalleryImage(projectIndex, imageIndex, event.target.value)} />
                            </label>
                            <label className={labelClass}>
                              choose gallery preview {imageIndex + 1}
                              <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                className="block w-full text-sm font-semibold text-[#11120f] file:mr-4 file:border-0 file:bg-[#11120f] file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-[0.16em] file:text-[#f1f2ec]"
                                onChange={(event) => handleGalleryFile(projectIndex, imageIndex, event.target.files?.[0] ?? null)}
                              />
                              <span className="normal-case tracking-normal text-[#666961]">
                                Preview only. Put the file in <code>public/images</code> and keep this path:{" "}
                                <code>{image}</code>
                              </span>
                            </label>
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(projectIndex, imageIndex)}
                              className="justify-self-start text-xs font-bold uppercase tracking-[0.18em] text-[#8f9188] transition hover:text-[#11120f]"
                            >
                              Remove image
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}

            <section className="border border-[#11120f]/10 p-5 md:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-4xl font-extrabold tracking-[-0.04em]">Export data</h2>
                <div className="flex flex-wrap gap-5">
                  <button type="button" onClick={copyJson} className="text-xs font-bold uppercase tracking-[0.18em] text-[#11120f]">
                    {copied ? "Copied" : "Copy JSON"}
                  </button>
                  <button type="button" onClick={downloadJson} className="text-xs font-bold uppercase tracking-[0.18em] text-[#11120f]">
                    Download JSON
                  </button>
                  <button type="button" onClick={resetDraft} className="text-xs font-bold uppercase tracking-[0.18em] text-[#8f9188]">
                    Reset draft
                  </button>
                </div>
              </div>
              <textarea className={`${inputClass} mt-6 min-h-96 font-mono text-xs font-medium`} value={exportedJson} readOnly />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
