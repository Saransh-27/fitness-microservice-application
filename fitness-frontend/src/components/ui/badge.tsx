import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
        secondary:
          "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
        accent:
          "border-transparent bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
        destructive:
          "border-transparent bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
        outline: "text-foreground border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  className?: string;
  children?: React.ReactNode;
}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
