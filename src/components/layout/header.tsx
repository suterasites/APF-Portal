"use client";

import { Menu, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  onMenuToggle: () => void;
}

export function Header({ title, onMenuToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-background/95 backdrop-blur-sm px-4 lg:px-6">
      {/* Mobile: hamburger menu */}
      <button
        onClick={onMenuToggle}
        className="rounded-lg p-2 text-text-secondary hover:bg-surface hover:text-text-primary lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Title - centered on mobile, left-aligned on desktop */}
      <h1
        className={cn(
          "text-lg font-semibold text-text-primary",
          "flex-1 text-center lg:flex-none lg:text-left",
          "lg:ml-0 mr-0 lg:mr-auto"
        )}
      >
        {title}
      </h1>

      {/* Desktop: right side actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          className="relative rounded-lg p-2 text-text-secondary hover:bg-surface hover:text-text-primary"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {/* Notification dot */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-text-primary" />
        </button>

        {/* User avatar - hidden on mobile since it is in the sidebar */}
        <button
          className="hidden items-center gap-2 rounded-lg p-1.5 hover:bg-surface lg:flex"
          aria-label="User menu"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-text-primary text-background text-xs font-semibold">
            JS
          </div>
        </button>
      </div>
    </header>
  );
}
