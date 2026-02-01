"use client";

import { useState } from "react";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ToastProvider } from "@/components/ui/toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <ToastProvider>
        <div className="flex h-screen">
          <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header onToggleSidebar={() => setSidebarOpen(true)} />
            <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background p-4 lg:p-8">
              <div className="mx-auto max-w-7xl animate-fade-in-up">
                {children}
              </div>
            </main>
          </div>
        </div>
      </ToastProvider>
    </SessionProvider>
  );
}
