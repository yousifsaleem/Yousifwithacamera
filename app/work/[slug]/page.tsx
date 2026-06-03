import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageReveal } from "@/components/PageReveal";
import { ProjectPageView } from "@/components/ProjectPageView";
import { projects } from "@/src/data/projects";

type WorkProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: WorkProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return {
      title: "Project not found"
    };
  }

  return {
    title: `${project.title} | YS Photography`,
    description: project.description,
    openGraph: {
      title: `${project.title} | YS Photography`,
      description: project.description,
      images: [
        {
          url: project.coverImage,
          width: 1200,
          height: 675,
          alt: project.alt
        }
      ]
    }
  };
}

export default async function WorkProjectPage({ params }: WorkProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <PageReveal />
      <Header />
      <ProjectPageView project={project} />
      <Footer />
    </>
  );
}
