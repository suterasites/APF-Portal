"use client";

import { useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/calendar": "Calendar",
  "/clients": "Clients",
  "/services": "Services",
  "/finances": "Finances",
  "/programs": "Programs",
  "/reports": "Reports",
  "/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  // Check for exact match first
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }

  // Check for partial match (e.g. /clients/123 should show "Clients")
  const basePath = "/" + pathname.split("/").filter(Boolean)[0];
  return pageTitles[basePath] || "APF Portal";
}

interface CoachLayoutProps {
  children: React.ReactNode;
}

export function CoachLayout({ children }: CoachLayoutProps) {
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
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={title} onMenuToggle={handleMenuToggle} />

        <main className={`flex-1 ${pathname === "/calendar" ? "overflow-hidden" : "overflow-y-auto"}`}>
          {pathname === "/calendar" ? (
            children
          ) : (
            <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
