"use client";

import { useState } from "react";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <div className="flex h-screen">
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header onToggleSidebar={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
