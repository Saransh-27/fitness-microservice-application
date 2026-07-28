import React from "react";
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-muted/70 dark:bg-slate-800/60",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
