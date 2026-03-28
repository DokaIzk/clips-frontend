import Image from "next/image";
import ApexImage from "@/app/assets/Container (1).svg";
import ReactImage from "@/app/assets/Container.svg";
import { useDashboardData } from "@/app/hooks/useDashboardData";
import { Skeleton } from "./Skeleton";
import ClipActionToolbar from "./ClipActionToolbar";
import VirtualizedClipGrid from "./VirtualizedClipGrid";

export interface RecentProject {
  id: string | number;
  image?: any;
  title: string;
  clipsGenerated: number;
  status: "processing" | "completed";
  accent: string;
}

function ProjectSkeleton() {
  return (
    <div className="flex min-h-[140px] items-center gap-4 rounded-2xl border border-white/6 bg-[var(--card-background)] p-4">
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

export default function RecentProjects() {
  const { data, loading } = useDashboardData();
  const projects = data?.recentProjects || [];

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="md:text-[20px] font-black tracking-[-0.04em] text-[#F1F5F9] text-[18px]">
            Recent Projects
          </h1>
        </div>
        {!loading && projects.length > 0 && (
          <a
            href="#"
            className="text-[14px] font-bold text-[#00FF9D] transition-all duration-200 hover:text-[var(--link-hover)] hover:underline hover:underline-offset-4"
          >
            View All
          </a>
        )}
      </div>

      <VirtualizedClipGrid
        projects={projects}
        loading={loading}
        onEdit={(id) => console.log("Edit clip:", id)}
        onDownload={(id) => console.log("Download clip:", id)}
        onPreview={(id) => console.log("Preview clip:", id)}
      />
    </section>
  );
}
