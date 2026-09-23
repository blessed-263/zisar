import { Toaster } from "@/components/Toaster";
import { BrandStripe } from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <img src="/placeholders/auth-campus.png" alt="" className="size-full object-cover opacity-[0.38] dark:opacity-[0.28]" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/85 to-bg" />
      </div>
      <BrandStripe className="relative z-10" />
      <div className="relative z-10 flex flex-1 flex-col items-center px-4 py-10 md:py-14">{children}</div>
      <Toaster />
    </div>
  );
}
