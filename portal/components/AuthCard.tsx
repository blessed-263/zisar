import { BrandStripe, Logo } from "./Logo";
import { cn } from "@/lib/utils";

export function AuthCard({
  title,
  description,
  children,
  className,
  showLogo = true,
}: {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  showLogo?: boolean;
}) {
  return (
    <div
      className={cn(
        "anim-rise w-full max-w-[420px] overflow-hidden rounded-[18px] border border-border bg-surface shadow-[var(--shadow-float)]",
        className,
      )}
    >
      <BrandStripe />
      <div className="flex flex-col gap-6 px-6 pt-8 pb-6 md:px-8">
        <div className="flex flex-col items-center gap-3 text-center">
          {showLogo && <Logo size="lg" withText={false} />}
          <p className="t-small text-muted">Zimbabwe Students Association in Russia</p>
          <h1 className="t-title">{title}</h1>
          {description && <p className="text-muted">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
