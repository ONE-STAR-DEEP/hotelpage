import { cn } from "@/utils";

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-xl bg-slate-200/80",
        className,
      )}
    />
  );
}
