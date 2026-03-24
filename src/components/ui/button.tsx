import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  default:
    "bg-[#0A0A0A] text-white hover:bg-[#1A1A1A] dark:bg-[#FAFAFA] dark:text-[#0A0A0A] dark:hover:bg-[#E5E5E5]",
  outline:
    "border border-[#E5E5E5] dark:border-[#2A2A2A] bg-transparent text-[#0A0A0A] dark:text-[#FAFAFA] hover:bg-[#F5F5F5] dark:hover:bg-[#141414]",
  ghost:
    "bg-transparent text-[#0A0A0A] dark:text-[#FAFAFA] hover:bg-[#F5F5F5] dark:hover:bg-[#141414]",
  destructive:
    "bg-[#C23B22] text-white hover:bg-[#A83220]",
};

const buttonSizes = {
  sm: "h-8 px-3 text-sm rounded-lg",
  default: "h-10 px-4 text-sm rounded-lg",
  lg: "h-12 px-6 text-base rounded-xl",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] dark:focus-visible:ring-[#FAFAFA] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0A0A0A] disabled:pointer-events-none disabled:opacity-50",
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants, buttonSizes };
