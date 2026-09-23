import { cn } from "@/lib/utils";

const SIZES = { sm: 28, md: 40, lg: 96 } as const;

/** The official ZISAR seal. Never recoloured, cropped, or stretched. */
export function Logo({
  size = "md",
  withText = true,
  subtitle,
  className,
}: {
  size?: keyof typeof SIZES | number;
  withText?: boolean;
  subtitle?: string;
  className?: string;
}) {
  const px = typeof size === "number" ? size : SIZES[size];
  const showText = withText && px >= 28;
  return (
    <span className={cn("inline-flex items-center gap-2.5", px >= 96 && "flex-col gap-3 text-center", className)}>
      { }
      <img
        src="/brand/zisar-logo.png"
        alt={showText ? "" : "ZISAR"}
        width={px}
        height={Math.round(px * (464 / 450))}
        className="shrink-0 object-contain"
        style={{ width: px, height: Math.round(px * (464 / 450)) }}
      />
      {showText && (
        <span className="flex flex-col leading-none">
          <span
            className={cn("font-semibold tracking-[-0.01em] text-text", px >= 96 ? "text-[28px]" : px >= 40 ? "text-[18px]" : "text-[16px]")}
          >
            ZISAR
          </span>
          {subtitle && <span className="t-small mt-1 text-muted">{subtitle}</span>}
        </span>
      )}
    </span>
  );
}

export function BrandStripe({ className }: { className?: string }) {
  return <div className={cn("brand-stripe w-full", className)} aria-hidden />;
}
