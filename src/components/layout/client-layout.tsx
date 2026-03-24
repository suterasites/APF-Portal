"use client";

import { useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { ClientSidebar } from "./client-sidebar";
import { Header } from "./header";

const pageTitles: Record<string, string> = {
  "/home": "Home",
  "/schedule": "Schedule",
  "/progress": "My Progress",
  "/payments": "Payments",
  "/profile": "Profile",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }

  const basePath = "/" + pathname.split("/").filter(Boolean)[0];
  return pageTitles[basePath] || "APF Portal";
}

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const title = useMemo(() => getPageTitle(pathname), [pathname]);

  const handleMenuToggle = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background font-[family-name:var(--font-geist-sans)]">
      <ClientSidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={title} onMenuToggle={handleMenuToggle} />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
