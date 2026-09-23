"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react";
import { useDemo, useHydrated } from "@/lib/store";
import { BrandStripe, Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const hydrated = useHydrated();
  const signedIn = useDemo((s) => s.signedIn);
  const router = useRouter();

  React.useEffect(() => {
    if (hydrated && signedIn) router.replace("/home");
  }, [hydrated, signedIn, router]);

  return (
    <div className="min-h-dvh bg-bg text-text">
      <header className="absolute inset-x-0 top-0 z-20">
        <BrandStripe />
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 md:px-8">
          <Link href="/" className="rounded-[8px]" aria-label="ZISAR home">
            <Logo size={36} withText={false} />
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/sign-in"
              className="hidden px-2 text-[14px] font-medium text-white/85 hover:text-white sm:inline"
            >
              Applicant access
            </Link>
            <Button asChild variant="ghost" size="sm" className="text-white/90 hover:bg-white/10 hover:text-white">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild variant="secondary" size="sm" className="border-white/30 bg-white/95 text-[#141820] hover:bg-white">
              <Link href="/sign-up">Create account</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="relative flex min-h-dvh items-end overflow-hidden md:items-center">
        <div className="absolute inset-0" aria-hidden>
          <img
            src="/placeholders/landing-hero.png"
            alt=""
            className="landing-hero-img size-full object-cover object-[center_40%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c101c] via-[#0c101c]/75 to-[#0c101c]/35 md:bg-gradient-to-r md:from-[#0c101c]/92 md:via-[#0c101c]/55 md:to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-5 pb-16 pt-28 md:px-8 md:pb-24 md:pt-32">
          <div className="landing-rise flex max-w-lg flex-col gap-6 text-white">
            <div className="flex items-center gap-4">
              <img src="/brand/zisar-logo.png" alt="" className="size-16 object-contain drop-shadow-md md:size-20" />
              <span className="font-display text-[48px] leading-none font-medium tracking-[-0.04em] md:text-[64px]">
                ZISAR
              </span>
            </div>

            <p className="max-w-sm text-[17px] leading-7 text-white/80 md:text-[18px]">
              The student portal for Zimbabweans in Russia.
            </p>

            <div>
              <Button asChild variant="primary" className="h-12 bg-[#e8b006] px-5 text-[#141820] hover:bg-[#f0c040]">
                <Link href="/sign-in">
                  Enter the portal
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center gap-3">
            <Logo size={28} withText={false} />
            <span className="t-small text-muted">Zimbabwe Students Association in Russia</span>
          </div>
          <Link href="/blog" className="t-small font-medium text-accent hover:underline">
            Association blog
          </Link>
        </div>
      </footer>
    </div>
  );
}
