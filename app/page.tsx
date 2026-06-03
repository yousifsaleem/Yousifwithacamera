import { AboutSection } from "@/components/AboutSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LayoutGuides } from "@/components/LayoutGuides";
import { Loader } from "@/components/Loader";
import { ScrollCarousel } from "@/components/ScrollCarousel";

export default function Home() {
  return (
    <>
      <Loader />
      <Header />
      <LayoutGuides />
      <main id="top">
        <ScrollCarousel />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
