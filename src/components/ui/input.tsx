import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            "flex h-10 w-full rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] px-3 py-2 text-sm text-[#0A0A0A] dark:text-[#FAFAFA] placeholder:text-[#6B6B6B] transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[#0A0A0A] dark:focus:ring-[#FAFAFA] focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-[#0A0A0A]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            error && "border-[#C23B22] focus:ring-[#C23B22]",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-[#C23B22]">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
