"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleNotch as Loader2 } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[8px] font-medium transition-[background-color,border-color,color,transform] duration-150 ease-[var(--ease)] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:stroke-[1.75]",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-contrast hover:bg-accent-hover",
        secondary: "border border-border bg-surface text-text hover:bg-surface-muted",
        ghost: "text-text hover:bg-surface-muted",
        destructive: "bg-danger text-white hover:opacity-90 dark:text-[#0b0b0c]",
        "destructive-outline": "border border-danger/40 bg-surface text-danger hover:bg-danger-soft",
        link: "h-auto px-0 text-accent underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        sm: "h-9 px-3 text-[14px]",
        md: "h-11 px-4 text-[15px]",
        icon: "size-11",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    if (asChild) {
      return (
        <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props}>
          {children}
        </Comp>
      );
    }
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        <span className={cn("inline-flex items-center gap-2", loading && "invisible")}>{children}</span>
        {loading && (
          <span className="absolute inset-0 grid place-items-center">
            <Loader2 className="animate-spin" aria-hidden />
            <span className="sr-only">Working</span>
          </span>
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
