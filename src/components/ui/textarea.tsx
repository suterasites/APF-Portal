import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] px-3 py-2 text-sm text-[#0A0A0A] dark:text-[#FAFAFA] placeholder:text-[#6B6B6B] transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[#0A0A0A] dark:focus:ring-[#FAFAFA] focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-[#0A0A0A]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-y",
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
Textarea.displayName = "Textarea";

export { Textarea };
