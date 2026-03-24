import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            className={cn(
              "flex h-10 w-full appearance-none rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] px-3 py-2 pr-10 text-sm text-[#0A0A0A] dark:text-[#FAFAFA] transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-[#0A0A0A] dark:focus:ring-[#FAFAFA] focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-[#0A0A0A]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-[#C23B22] focus:ring-[#C23B22]",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]" />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-[#C23B22]">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
