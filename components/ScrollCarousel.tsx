"use client";

import gsap from "gsap";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { projects } from "@/src/data/projects";
import { CarouselItem } from "./CarouselItem";
import { Pagination } from "./Pagination";
import { ProjectMeta } from "./ProjectMeta";
import { ProjectsOverview } from "./ProjectsOverview";

type Metrics = {
  wide: number;
  panel: number;
  height: number;
  gap: number;
  contentWidth: number;
  margin: number;
  sideCount: number;
};

const initialMetrics: Metrics = {
  wide: 820,
  panel: 78,
  height: 461,
  gap: 16,
  contentWidth: 1360,
  margin: 40,
  sideCount: 3
};
const wheelThreshold = 84;

function clamp(min: number, preferred: number, max: number) {
  return Math.max(min, Math.min(preferred, max));
}

function getMetrics(): Metrics {
  if (typeof window === "undefined") {
    return initialMetrics;
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const margin = clamp(30, vw * 0.015, 40);
  const contentWidth = vw - margin * 2;
  const sideCount = vw < 640 ? 1 : vw < 1024 ? 2 : 3;
  const gap = vw < 640 ? clamp(6, vw * 0.018, 10) : clamp(12, vw * 0.0105, 22);
  let panel =
    vw < 640
      ? clamp(24, vw * 0.075, 44)
      : vw < 1024
        ? clamp(48, vw * 0.06, 72)
        : clamp(54, vw * 0.045, 88);

  let wide = contentWidth - sideCount * 2 * panel - sideCount * 2 * gap;
  let height = wide * 9 / 16;
  const hardMinHeight = vw < 640 ? 150 : vw < 1024 ? 260 : 320;
  const hardMaxHeight = vw < 640 ? 250 : vw < 1024 ? 450 : 640;
  const viewportMaxHeight = vw < 640 ? vh * 0.38 : vw < 1024 ? vh * 0.52 : vh * 0.6;
  const maxHeight = Math.max(140, Math.min(hardMaxHeight, viewportMaxHeight));
  const minHeight = Math.min(hardMinHeight, maxHeight);

  if (height < minHeight) {
    const desiredWide = minHeight * 16 / 9;
    const deficit = desiredWide - wide;
    panel = Math.max(vw < 640 ? 20 : 44, panel - deficit / (sideCount * 2));
    wide = contentWidth - sideCount * 2 * panel - sideCount * 2 * gap;
    height = wide * 9 / 16;
  }

  if (height > maxHeight) {
    const desiredWide = maxHeight * 16 / 9;
    const excess = wide - desiredWide;
    panel = panel + excess / (sideCount * 2);
    wide = contentWidth - sideCount * 2 * panel - sideCount * 2 * gap;
    height = wide * 9 / 16;
  }

  return { wide, panel, height, gap, contentWidth, margin, sideCount };
}

function circularDistance(index: number, progress: number, total: number) {
  let distance = index - progress;
  const half = total / 2;

  while (distance > half) distance -= total;
  while (distance < -half) distance += total;

  return distance;
}

export function ScrollCarousel() {
  const total = projects.length;
  const stageRef = useRef<HTMLDivElement | null>(null);
  const progressValue = useRef({ value: 0 });
  const isAnimatingRef = useRef(false);
  const activeIndexRef = useRef(0);
  const wheelDeltaRef = useRef(0);
  const wheelResetRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const overviewDestinationRef = useRef<"overview" | "about">("overview");

  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [metaIndex, setMetaIndex] = useState(0);
  const [metaHidden, setMetaHidden] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [hasEnteredOverview, setHasEnteredOverview] = useState(false);
  const [isPullingOverview, setIsPullingOverview] = useState(false);

  const isReducedMotion = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const handleResize = () => {
      const nextMetrics = getMetrics();
      const adjacentRectOuterEdge = nextMetrics.margin + nextMetrics.panel * 2 + nextMetrics.gap * 2;

      document.documentElement.style.setProperty("--home-rect-edge-guide", `${adjacentRectOuterEdge}px`);
      setMetrics(nextMetrics);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (hasEnteredOverview) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [hasEnteredOverview]);

  const scrollToSection = useCallback(
    (id: "projects" | "about") => {
      document.getElementById(id)?.scrollIntoView({
        behavior: isReducedMotion() ? "auto" : "smooth"
      });
    },
    [isReducedMotion]
  );

  const triggerOverview = useCallback(
    (destination: "overview" | "about" = "overview") => {
      if (isAnimatingRef.current) return;

      if (hasEnteredOverview) {
        scrollToSection(destination === "about" ? "about" : "projects");
        return;
      }

      isAnimatingRef.current = true;
      overviewDestinationRef.current = destination;
      setIsPullingOverview(true);
      setMetaHidden(true);

      const duration = isReducedMotion() ? 0.18 : 1.12;
      const timeline = gsap.timeline({
        defaults: { ease: "expo.inOut" },
        onComplete: () => {
          if (stageRef.current) {
            gsap.set(stageRef.current, { clearProps: "transform,filter" });
          }

          setHasEnteredOverview(true);
          setIsPullingOverview(false);
          setMetaHidden(false);
          isAnimatingRef.current = false;
          document.body.style.overflow = "";

          window.setTimeout(() => {
            scrollToSection(overviewDestinationRef.current === "about" ? "about" : "projects");
          }, 40);
        }
      });

      if (stageRef.current) {
        timeline.to(
          stageRef.current,
          {
            y: -68,
            scaleY: 0.955,
            filter: isReducedMotion() ? "none" : "blur(10px)",
            duration
          },
          0
        );
      }
    },
    [hasEnteredOverview, isReducedMotion, scrollToSection]
  );

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a");
      const href = anchor?.getAttribute("href");
      if (!anchor || (href !== "#about" && href !== "/#about")) return;

      event.preventDefault();
      triggerOverview("about");
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, [triggerOverview]);

  const snapTo = useCallback(
    (targetIndex: number) => {
      if (isAnimatingRef.current) return;

      const nextIndex = Math.max(0, Math.min(targetIndex, total - 1));
      const currentIndex = activeIndexRef.current;

      if (nextIndex === currentIndex) return;

      isAnimatingRef.current = true;
      setMetaHidden(true);

      const duration = isReducedMotion() ? 0.2 : 1.34;
      const targetProgress = nextIndex;

      gsap.to(progressValue.current, {
        value: targetProgress,
        duration,
        ease: "expo.inOut",
        onUpdate: () => {
          setProgress(progressValue.current.value);
        },
        onComplete: () => {
          progressValue.current.value = targetProgress;
          setProgress(targetProgress);
          setActiveIndex(nextIndex);
          activeIndexRef.current = nextIndex;
          isAnimatingRef.current = false;
        }
      });

      window.setTimeout(
        () => {
          setMetaIndex(nextIndex);
          setMetaHidden(false);
        },
        isReducedMotion() ? 60 : Math.round(duration * 680)
      );
    },
    [isReducedMotion, total]
  );

  const handleAdvance = useCallback(() => {
    const currentIndex = activeIndexRef.current;

    if (currentIndex >= total - 1) {
      triggerOverview();
      return;
    }

    snapTo(currentIndex + 1);
  }, [snapTo, total, triggerOverview]);

  const handleReverse = useCallback(() => {
    const currentIndex = activeIndexRef.current;

    if (currentIndex <= 0) return;
    snapTo(currentIndex - 1);
  }, [snapTo]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const isAtCarouselTop = window.scrollY <= 6;
      const shouldReleaseToOverview =
        hasEnteredOverview && isAtCarouselTop && activeIndexRef.current >= total - 1 && event.deltaY > 0;

      if (!isAtCarouselTop || shouldReleaseToOverview) {
        return;
      }

      event.preventDefault();
      if (isAnimatingRef.current) return;

      wheelDeltaRef.current += event.deltaY;

      if (wheelResetRef.current) {
        window.clearTimeout(wheelResetRef.current);
      }

      wheelResetRef.current = window.setTimeout(() => {
        wheelDeltaRef.current = 0;
      }, 150);

      if (Math.abs(wheelDeltaRef.current) < wheelThreshold) return;

      const direction = wheelDeltaRef.current > 0 ? 1 : -1;
      wheelDeltaRef.current = 0;

      if (direction > 0) {
        handleAdvance();
      } else {
        handleReverse();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const isAtCarouselTop = window.scrollY <= 6;
      if (hasEnteredOverview && !isAtCarouselTop) return;

      if ((event.key === "ArrowDown" || event.key === "ArrowRight") && activeIndexRef.current >= total - 1) {
        if (hasEnteredOverview) return;
        event.preventDefault();
        handleAdvance();
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        handleAdvance();
      }

      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        handleReverse();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (hasEnteredOverview && window.scrollY > 6) return;
      const touch = event.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!touchStartRef.current || isAnimatingRef.current) return;

      const touch = event.changedTouches[0];
      const deltaY = touchStartRef.current.y - touch.clientY;
      const deltaX = touchStartRef.current.x - touch.clientX;
      const dominantDelta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;

      touchStartRef.current = null;

      if (Math.abs(dominantDelta) < 48) return;

      if (dominantDelta > 0) {
        handleAdvance();
      } else {
        handleReverse();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      if (wheelResetRef.current) {
        window.clearTimeout(wheelResetRef.current);
      }
    };
  }, [handleAdvance, handleReverse, hasEnteredOverview, total]);

  const itemLayout = useMemo(() => {
    const visible = projects
      .map((project, index) => {
        const distance = circularDistance(index, progress, total);
        const activeWeight = Math.max(0, 1 - Math.abs(distance));
        const width = metrics.panel + (metrics.wide - metrics.panel) * activeWeight;

        return {
          project,
          index,
          distance,
          activeWeight,
          width
        };
      })
      .filter((item) => Math.abs(item.distance) <= metrics.sideCount + 0.55)
      .sort((a, b) => a.distance - b.distance);

    const positioned = visible.reduce<{
      items: Array<(typeof visible)[number] & { left: number }>;
      cursor: number;
    }>(
      (acc, item) => {
        const left = acc.cursor;
        return {
          items: [...acc.items, { ...item, left }],
          cursor: acc.cursor + item.width + metrics.gap
        };
      },
      { items: [], cursor: 0 }
    ).items;

    const fadeStart = metrics.sideCount + 0.05;
    const fadeEnd = metrics.sideCount + 0.55;

    return positioned.map((item) => {
      const absDistance = Math.abs(item.distance);
      const edgeOpacity =
        absDistance <= fadeStart ? 1 : clamp(0, (fadeEnd - absDistance) / (fadeEnd - fadeStart), 1);

      return {
        ...item,
        x: item.left,
        opacity: edgeOpacity,
        zIndex: Math.round(100 - absDistance * 10)
      };
    });
  }, [metrics, progress, total]);

  const metaProject = projects[metaIndex];

  return (
    <div id="work">
      <section className="relative h-[100svh] min-h-[100svh] overflow-hidden">
        <motion.div
          ref={stageRef}
          className="relative flex h-full -translate-y-[clamp(20px,3vh,42px)] flex-col justify-center overflow-hidden pb-[calc(clamp(164px,18vh,230px)+env(safe-area-inset-bottom))] pt-[var(--header-height)]"
          animate={isPullingOverview ? { clipPath: "inset(0% 0% 100% 0%)" } : { clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: isReducedMotion() ? 0.18 : 1.12, ease: [0.83, 0, 0.17, 1] }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              height: metrics.height,
              width: metrics.contentWidth,
              marginLeft: metrics.margin,
              marginRight: metrics.margin
            }}
            aria-label="Snap-controlled portfolio carousel"
          >
            {itemLayout.map((item) => (
              <CarouselItem
                key={item.project.id}
                project={item.project}
                width={item.width}
                height={metrics.height}
                x={item.x}
                opacity={item.opacity}
                isActive={item.index === activeIndex}
                zIndex={item.zIndex}
              />
            ))}
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 z-[900]"
            style={{ bottom: "calc(clamp(86px, 9vh, 132px) + env(safe-area-inset-bottom))" }}
          >
            <div className="site-grid items-end">
              <div className="col-span-12 sm:col-span-8 lg:col-span-7">
                <ProjectMeta project={metaProject} isHidden={metaHidden} />
              </div>
              <div className="col-span-12 mt-6 sm:col-span-4 sm:mt-0 lg:col-span-5">
                <Pagination current={metaIndex + 1} total={total} isHidden={metaHidden} />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <ProjectsOverview projects={projects} />
    </div>
  );
}
