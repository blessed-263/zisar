"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { useDemo, useHydrated } from "@/lib/store";
import {
  LANDING_ABOUT,
  LANDING_COMMITTEE_PREVIEW,
  LANDING_PROGRAMS,
  LANDING_PROFILES,
} from "@/lib/landing";
import { BrandStripe, Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";

function useScrolled(threshold = 48) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={cn("landing-reveal", seen && "is-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const NAV = [
  { href: "#about", label: "About" },
  { href: "#programs", label: "Programs" },
  { href: "#blog", label: "Blog" },
  { href: "#people", label: "People" },
] as const;

export default function LandingPage() {
  const hydrated = useHydrated();
  const signedIn = useDemo((s) => s.signedIn);
  const posts = useDemo((s) => s.data.posts);
  const router = useRouter();
  const scrolled = useScrolled();

  React.useEffect(() => {
    if (hydrated && signedIn) router.replace("/home");
  }, [hydrated, signedIn, router]);

  const blogPreview = React.useMemo(
    () => [...(posts ?? [])].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 3),
    [posts],
  );

  return (
    <div className="min-h-dvh bg-bg text-text">
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-30 transition-[background,box-shadow,backdrop-filter] duration-300",
          scrolled
            ? "bg-[#0c101c]/92 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <BrandStripe />
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="rounded-[8px]" aria-label="ZISAR home">
            <Logo size={34} withText={false} />
          </Link>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Page">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[13px] font-medium tracking-wide text-white/75 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button asChild variant="ghost" size="sm" className="text-white/90 hover:bg-white/10 hover:text-white">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="border-white/30 bg-white/95 text-[#141820] hover:bg-white"
            >
              <Link href="/sign-up">Create account</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero — one composition: brand, line, CTA, full-bleed image */}
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
              <img
                src="/brand/zisar-logo.png"
                alt=""
                className="size-16 object-contain drop-shadow-md md:size-20"
              />
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

      {/* About */}
      <section id="about" className="scroll-mt-24 border-b border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:gap-14 md:px-8 md:py-24 md:items-center">
          <Reveal>
            <div className="landing-photo overflow-hidden rounded-[4px]">
              <img
                src={LANDING_ABOUT.image}
                alt={LANDING_ABOUT.imageAlt}
                className="aspect-[4/5] w-full object-cover md:aspect-[5/6]"
              />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="flex flex-col gap-5">
              <p className="t-label text-accent">{LANDING_ABOUT.title}</p>
              <h2 className="font-display text-[32px] leading-9 font-medium tracking-[-0.03em] md:text-[40px] md:leading-11">
                {LANDING_ABOUT.lead}
              </h2>
              {LANDING_ABOUT.body.map((p) => (
                <p key={p} className="text-[16px] leading-7 text-muted">
                  {p}
                </p>
              ))}
              <dl className="mt-4 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-3">
                {LANDING_ABOUT.facts.map((f) => (
                  <div key={f.label}>
                    <dt className="t-small text-muted">{f.label}</dt>
                    <dd className="mt-1 text-[15px] font-medium leading-5">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Committee */}
      <section className="border-b border-border bg-bg" aria-labelledby="committee-heading">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <p className="t-label text-accent">The committee</p>
                <h2
                  id="committee-heading"
                  className="mt-2 font-display text-[28px] leading-8 font-medium tracking-[-0.03em] md:text-[34px] md:leading-10"
                >
                  Elected to serve the membership
                </h2>
                <p className="mt-3 text-[15px] leading-6 text-muted">
                  Executive officers and city representatives. Sample names on this prototype; the live portal shows the sitting committee.
                </p>
              </div>
              <Link
                href="/sign-in?next=/elections"
                className="inline-flex items-center gap-1 text-[14px] font-medium text-accent hover:underline"
              >
                See elections
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {LANDING_COMMITTEE_PREVIEW.map((seat, i) => (
              <Reveal key={seat.office} delay={i * 60}>
                <figure className="flex flex-col gap-3">
                  <div className="landing-photo overflow-hidden rounded-[4px] bg-surface-muted">
                    <img src={seat.photo} alt="" className="aspect-[3/4] w-full object-cover object-top" />
                  </div>
                  <figcaption>
                    <p className="text-[15px] font-medium">{seat.office}</p>
                    <p className="mt-1 t-small text-muted">{seat.note}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="scroll-mt-24 border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <Reveal>
            <div className="mb-12 max-w-xl">
              <p className="t-label text-accent">What we run</p>
              <h2 className="mt-2 font-display text-[28px] leading-8 font-medium tracking-[-0.03em] md:text-[34px] md:leading-10">
                Programs that keep students standing
              </h2>
              <p className="mt-3 text-[15px] leading-6 text-muted">
                Not slogans — the work the association does every term, through the portal and on the ground.
              </p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-16 md:gap-24">
            {LANDING_PROGRAMS.map((program, i) => {
              const flip = i % 2 === 1;
              return (
                <Reveal key={program.id} delay={40}>
                  <article
                    className={cn(
                      "grid items-center gap-8 md:grid-cols-2 md:gap-12",
                      flip && "md:[&>*:first-child]:order-2",
                    )}
                  >
                    <div className="landing-photo overflow-hidden rounded-[4px]">
                      <img
                        src={program.image}
                        alt={program.alt}
                        className="aspect-[16/11] w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <span className="font-mono text-[12px] tracking-wider text-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-[24px] leading-7 font-medium tracking-[-0.02em] md:text-[28px] md:leading-8">
                        {program.title}
                      </h3>
                      <p className="text-[16px] leading-7 text-muted">{program.summary}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="scroll-mt-24 border-b border-border bg-bg">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <Reveal>
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <p className="t-label text-accent">From the association</p>
                <h2 className="mt-2 font-display text-[28px] leading-8 font-medium tracking-[-0.03em] md:text-[34px] md:leading-10">
                  Latest on the blog
                </h2>
                <p className="mt-3 text-[15px] leading-6 text-muted">
                  Decisions, winter advice, and how verification actually works. Sign in to read the full posts.
                </p>
              </div>
              <Link
                href="/sign-in?next=/blog"
                className="inline-flex items-center gap-1 text-[14px] font-medium text-accent hover:underline"
              >
                Open the blog
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>

          {blogPreview.length === 0 ? (
            <p className="text-muted">Posts will appear here once the association publishes.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {blogPreview.map((post, i) => (
                <Reveal key={post.id} delay={i * 70}>
                  <Link
                    href={`/sign-in?next=${encodeURIComponent(`/blog/${post.id}`)}`}
                    className="group flex flex-col gap-4"
                  >
                    <div className="landing-photo overflow-hidden rounded-[4px] bg-surface-muted">
                      {post.cover ? (
                        <img
                          src={post.cover}
                          alt={post.alt ?? ""}
                          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="aspect-[16/10] bg-accent-soft" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-accent">{post.tag}</span>
                        <span className="t-small text-muted">{formatDate(post.at)}</span>
                      </div>
                      <h3 className="font-display text-[20px] leading-6 font-medium tracking-[-0.02em] group-hover:text-accent">
                        {post.title}
                      </h3>
                      <p className="t-small line-clamp-3 text-muted">{post.excerpt}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Standout profiles */}
      <section id="people" className="scroll-mt-24 border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <Reveal>
            <div className="mb-12 max-w-xl">
              <p className="t-label text-accent">Among us</p>
              <h2 className="mt-2 font-display text-[28px] leading-8 font-medium tracking-[-0.03em] md:text-[34px] md:leading-10">
                Standout profiles
              </h2>
              <p className="mt-3 text-[15px] leading-6 text-muted">
                Members who carry the work — mentoring, culture, and the quiet admin that keeps everyone else moving.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {LANDING_PROFILES.map((profile, i) => (
              <Reveal key={profile.id} delay={i * 60}>
                <article className="flex flex-col gap-4">
                  <div className="landing-photo overflow-hidden rounded-[4px]">
                    <img
                      src={profile.photo}
                      alt=""
                      className="aspect-[3/4] w-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <p className="t-small font-medium text-accent">{profile.highlight}</p>
                    <h3 className="mt-1 text-[17px] font-medium">{profile.name}</h3>
                    <p className="mt-0.5 t-small text-muted">{profile.role}</p>
                    <p className="mt-2 text-[14px] leading-6 text-muted">{profile.blurb}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-[#0c101c] text-white">
        <div className="absolute inset-0 opacity-40" aria-hidden>
          <img
            src="/placeholders/poster-sports.png"
            alt=""
            className="size-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#0c101c]/80" />
        </div>
        <Reveal>
          <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-20 md:px-8 md:py-28">
            <h2 className="max-w-lg font-display text-[32px] leading-9 font-medium tracking-[-0.03em] md:text-[40px] md:leading-11">
              Already studying in Russia? Your file belongs here.
            </h2>
            <p className="max-w-md text-[16px] leading-7 text-white/75">
              Sign in for semester sheets, documents, city news, and the association blog. Applicants can explore cities before they arrive.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="primary" className="h-12 bg-[#e8b006] px-5 text-[#141820] hover:bg-[#f0c040]">
                <Link href="/sign-in">
                  Enter the portal
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="h-12 border-white/25 bg-transparent text-white hover:bg-white/10"
              >
                <Link href="/sign-up">Create an account</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center gap-3">
            <Logo size={28} withText={false} />
            <div>
              <p className="text-[14px] font-medium">ZISAR</p>
              <p className="t-small text-muted">Zimbabwe Students Association in Russia</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="t-small text-muted hover:text-text">
                {item.label}
              </a>
            ))}
            <Link href="/sign-in?next=/blog" className="t-small font-medium text-accent hover:underline">
              Association blog
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
