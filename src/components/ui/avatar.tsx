import * as React from "react";
import { cn } from "@/lib/utils";

const avatarSizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name?: string;
  size?: keyof typeof avatarSizes;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function Avatar({ src, name, size = "md", className, ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  const showImage = src && !imageError;
  const initials = name ? getInitials(name) : "?";

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E5E5E5] dark:bg-[#2A2A2A] font-medium text-[#0A0A0A] dark:text-[#FAFAFA]",
        avatarSizes[size],
        className
      )}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={name || "Avatar"}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span aria-label={name || "Unknown user"}>{initials}</span>
      )}
    </div>
  );
}

export { Avatar };
