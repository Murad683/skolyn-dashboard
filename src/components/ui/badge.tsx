import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        success: "border-transparent bg-green-500/15 text-green-600",
        warning: "border-transparent bg-amber-500/15 text-amber-600",
        urgent: "border-transparent bg-red-500/15 text-red-600",
        info: "border-transparent bg-sky-500/15 text-sky-600",
        neutral: "border-border bg-muted text-muted-foreground",
        new: "border-transparent bg-blue-500/15 text-blue-600",
        analyzed: "border-transparent bg-teal-500/15 text-teal-600",
        review: "border-transparent bg-amber-500/15 text-amber-600",
        finalized: "border-transparent bg-green-500/15 text-green-600",
        good: "border-transparent bg-green-500/15 text-green-600",
        moderate: "border-transparent bg-amber-500/15 text-amber-600",
        poor: "border-transparent bg-red-500/15 text-red-600",
        low: "border-transparent bg-green-500/15 text-green-600",
        medium: "border-transparent bg-amber-500/15 text-amber-600",
        high: "border-transparent bg-red-500/15 text-red-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
