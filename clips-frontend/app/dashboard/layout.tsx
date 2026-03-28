import type { ReactNode } from "react";
import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pl-64">{children}</main>
      </div>

    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      <Sidebar />
      <main className="flex-1 lg:pl-64">{children}</main>

    </div>
  );
}
