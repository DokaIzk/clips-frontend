"use client";

import { FixedSizeGrid as Grid } from "react-window";
import { useCallback, useRef, useEffect, useState } from "react";
import { RecentProject } from "./recentProject";
import { Skeleton } from "./Skeleton";

interface VirtualizedClipGridProps {
  projects: RecentProject[];
  loading?: boolean;
  onEdit?: (id: string | number) => void;
  onDownload?: (id: string | number) => void;
  onPreview?: (id: string | number) => void;
}

interface CellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    projects: RecentProject[];
    columnCount: number;
    onEdit?: (id: string | number) => void;
    onDownload?: (id: string | number) => void;
    onPreview?: (id: string | number) => void;
  };
}

function ClipCardSkeleton() {
  return (
    <div className="flex min-h-[140px] items-center gap-4 rounded-2xl border border-white/6 bg-[var(--card-background)] p-4 m-2">
      <Skeleton className="h-24 w-24 shrink-0 rounded-xl" />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-6 w-24 rounded-md" />
      </div>
    </div>
  );
}

function LazyImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative ${className || ""}`}>
      {!isLoaded && <Skeleton className="absolute inset-0 rounded-xl" />}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`object-cover rounded-xl transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}

function Cell({ columnIndex, rowIndex, style, data }: CellProps) {
  const { projects, columnCount, onEdit, onDownload, onPreview } = data;
  const index = rowIndex * columnCount + columnIndex;

  if (index >= projects.length) {
    return <div style={style} />;
  }

  const project = projects[index];

  return (
    <div style={style} className="p-2">
      <article className="group flex min-h-[140px] items-center gap-4 rounded-2xl border border-white/6 bg-[var(--card-background)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-0.5">
        <div
          aria-hidden="true"
          className="relative h-24 w-24 shrink-0 rounded-xl border border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          style={{ background: project.accent }}
        >
          {project.image && (
            <LazyImage
              src={project.image}
              alt={project.title}
              className="h-full w-full"
            />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold tracking-[-0.03em] text-white">
              {project.title}
            </h2>
            <p className="mt-1 text-[12px] font-medium text-[var(--muted-text)]">
              {project.clipsGenerated} clips generated
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center rounded-md px-3 py-1 text-xs font-extrabold tracking-[0.02em] ${
              project.status === "processing"
                ? "status-processing"
                : "status-completed"
            }`}
          >
            {project.status === "processing" ? "PROCESSING" : "COMPLETED"}
          </span>

          {/* Clip Action Toolbar */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onEdit?.(project.id)}
              className="rounded-md bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDownload?.(project.id)}
              className="rounded-md bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              Download
            </button>
            <button
              onClick={() => onPreview?.(project.id)}
              className="rounded-md bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              Preview
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function VirtualizedClipGrid({
  projects,
  loading = false,
  onEdit,
  onDownload,
  onPreview,
}: VirtualizedClipGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 600 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: Math.max(600, Math.min(800, window.innerHeight * 0.7)),
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const getColumnCount = useCallback(() => {
    if (containerSize.width >= 1024) return 2;
    return 1;
  }, [containerSize.width]);

  const columnCount = getColumnCount();
  const rowCount = Math.ceil(projects.length / columnCount);
  const columnWidth = containerSize.width / columnCount;
  const rowHeight = 180;

  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <ClipCardSkeleton />
        <ClipCardSkeleton />
        <ClipCardSkeleton />
        <ClipCardSkeleton />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="lg:col-span-2 flex flex-col items-center justify-center py-12 px-4 rounded-2xl border border-dashed border-white/10 bg-white/5 text-center">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">No projects yet</h3>
        <p className="text-zinc-400 mt-1 max-w-xs mx-auto">
          Start by creating your first project and transform your content with
          AI.
        </p>
        <button className="mt-6 px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:bg-zinc-200 transition-colors">
          Create New Project
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      <Grid
        columnCount={columnCount}
        columnWidth={columnWidth}
        height={containerSize.height}
        rowCount={rowCount}
        rowHeight={rowHeight}
        width={containerSize.width}
        itemData={{
          projects,
          columnCount,
          onEdit,
          onDownload,
          onPreview,
        }}
        overscanRowCount={2}
        overscanColumnCount={1}
      >
        {Cell}
      </Grid>
    </div>
  );
}
