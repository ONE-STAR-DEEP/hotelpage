import { cn } from "@/utils";
import type { Size } from "@/types";

export interface SpinnerProps {
  size?: Size;
  className?: string;
  label?: string;
}

const sizeStyles: Record<Size, string> = {
  sm: "size-4 border-2",
  md: "size-8 border-[3px]",
  lg: "size-12 border-4",
};

export function Spinner({
  size = "md",
  className,
  label = "Loading",
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <span
        className={cn(
          "animate-spin rounded-full border-primary-600 border-r-transparent",
          sizeStyles[size],
        )}
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
