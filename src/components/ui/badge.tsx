import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default:
    "bg-[#0A0A0A] text-white dark:bg-[#FAFAFA] dark:text-[#0A0A0A]",
  secondary:
    "bg-[#F5F5F5] text-[#0A0A0A] dark:bg-[#141414] dark:text-[#FAFAFA]",
  outline:
    "border border-[#E5E5E5] dark:border-[#2A2A2A] bg-transparent text-[#0A0A0A] dark:text-[#FAFAFA]",
  success:
    "bg-[#E6F4EA] text-[#1E7E34] dark:bg-[#1A2E1A] dark:text-[#6FCF7C]",
  warning:
    "bg-[#FFF8E1] text-[#B8860B] dark:bg-[#2E2A1A] dark:text-[#E0C068]",
  destructive:
    "bg-[#FDECEB] text-[#C23B22] dark:bg-[#2E1A1A] dark:text-[#E8665A]",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
