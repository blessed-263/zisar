"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Lifebuoy as LifeBuoy, SignOut as LogOut, Monitor, Moon, Sun } from "@phosphor-icons/react";
import { useDemo, useHydrated, useCurrentStudent, useActor } from "@/lib/store";
import { NAV, SETTINGS_ITEM, type NavItem } from "@/lib/nav";
import { ROLES, roleMeta } from "@/lib/constants";
import { badgeCounts } from "@/lib/badges";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Logo, BrandStripe } from "../Logo";
import { Avatar } from "../blocks";
import { OfflineBanner } from "../OfflineBanner";
import { Toaster } from "../Toaster";
import { Skeleton } from "../ui/card";

function isActive(pathname: string, href: string) {
  if (href === "/home") return pathname === "/home";
  return pathname === href || pathname.startsWith(href + "/");
}

function useBadges() {
  const data = useDemo((s) => s.data);
  return React.useMemo(() => badgeCounts(data), [data]);
}

function Badge({ n, className }: { n: number; className?: string }) {
  if (!n) return null;
  return (
    <span
      className={cn(
        "tabular grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-accent-contrast",
        className,
      )}
    >
      {n > 99 ? "99+" : n}
      <span className="sr-only"> new</span>
    </span>
  );
}

export function RoleSwitcher({ compact }: { compact?: boolean }) {
  const role = useDemo((s) => s.role);
  const setRole = useDemo((s) => s.setRole);
  const router = useRouter();
  return (
    <label
      className={cn(
        "relative flex h-9 items-center gap-2 rounded-[8px] border border-dashed border-muted/60 bg-surface pr-2 pl-2.5 text-[13px]",
        compact && "h-8",
      )}
      data-print="hide"
    >
      <span className="font-mono text-[11px] font-semibold tracking-wide text-muted uppercase">Demo</span>
      <select
        value={role}
        onChange={(e) => {
          const next = e.target.value as Role;
          setRole(next);
          router.push(next === "executive" ? "/admin/analytics" : "/home");
        }}
        aria-label="Switch demo role"
        className="max-w-[9.5rem] appearance-none bg-transparent pr-4 font-medium text-text outline-none"
      >
        {ROLES.map((r) => (
          <option key={r.role} value={r.role}>
            {r.label}
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-2 size-3 text-muted" viewBox="0 0 12 12" aria-hidden>
        <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </label>
  );
}

export function ThemeToggle() {
  const theme = useDemo((s) => s.theme);
  const setTheme = useDemo((s) => s.setTheme);
  const next = theme === "system" ? "light" : theme === "light" ? "dark" : "system";
  const Icon = theme === "system" ? Monitor : theme === "light" ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${theme}. Switch to ${next}.`}
      title={`Theme: ${theme}`}
      className="grid size-9 place-items-center rounded-[8px] text-muted transition-colors duration-150 hover:bg-surface-muted hover:text-text"
    >
      <Icon className="size-[18px]" aria-hidden />
    </button>
  );
}

function SideLink({ item, count }: { item: NavItem; count: number }) {
  const pathname = usePathname();
  const active = isActive(pathname, item.href);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      title={item.label}
      className={cn(
        "group relative flex h-10 items-center gap-3 rounded-[8px] px-3 text-[14px] font-medium transition-colors duration-150 md:justify-center lg:justify-start",
        active ? "bg-accent-soft text-text" : "text-muted hover:bg-surface-muted hover:text-text",
      )}
    >
      {active && <span className="absolute top-2 bottom-2 left-0 w-[3px] rounded-full bg-accent" aria-hidden />}
      <Icon className={cn("size-[18px] shrink-0", active && "text-accent")} weight={active ? "regular" : undefined} aria-hidden />
      <span className="truncate md:sr-only lg:not-sr-only">{item.label}</span>
      {count > 0 && (
        <>
          <Badge n={count} className="ml-auto md:hidden lg:grid" />
          <span className="absolute top-2 right-2 hidden size-2 rounded-full bg-accent md:block lg:hidden" aria-hidden />
        </>
      )}
    </Link>
  );
}

function Sidebar() {
  const role = useDemo((s) => s.role);
  const badges = useBadges();
  const nav = NAV[role];
  return (
    <aside
      data-print="hide"
      className="sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-border bg-surface/90 backdrop-blur md:flex md:w-16 lg:w-60"
    >
      <BrandStripe />
      <div className="flex h-16 items-center px-3 lg:px-4">
        <Link href="/home" className="rounded-[8px]" aria-label="ZISAR portal home">
          <span className="lg:hidden">
            <Logo size={36} withText={false} />
          </span>
          <span className="hidden lg:block">
            <Logo size="sm" subtitle="Student portal" />
          </span>
        </Link>
      </div>
      <nav aria-label="Main" className="flex flex-1 flex-col gap-5 overflow-y-auto px-2 py-2 lg:px-3">
        {nav.groups.map((g) => (
          <div key={g.label} className="flex flex-col gap-0.5">
            <span className="t-label mb-1 px-3 md:sr-only lg:not-sr-only">{g.label}</span>
            {g.items.map((it) => (
              <SideLink key={it.href} item={it} count={it.badge ? badges[it.badge] : 0} />
            ))}
          </div>
        ))}
      </nav>
      <div className="border-t border-border px-2 py-2 lg:px-3">
        <SideLink item={SETTINGS_ITEM} count={0} />
      </div>
    </aside>
  );
}

function UserMenu() {
  const role = useDemo((s) => s.role);
  const signOut = useDemo((s) => s.signOut);
  const student = useCurrentStudent();
  const actor = useActor();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-10 items-center gap-2 rounded-[10px] pr-2 pl-1 hover:bg-surface-muted"
      >
        <Avatar name={actor} photo={role === "student" ? student?.photo : undefined} size={32} />
        <span className="hidden flex-col text-left leading-tight xl:flex">
          <span className="text-[13px] font-medium">{actor}</span>
          <span className="text-[12px] text-muted">{roleMeta(role).label}</span>
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className="anim-scale absolute top-12 right-0 z-50 w-60 overflow-hidden rounded-[12px] border border-border bg-surface py-1 shadow-[var(--shadow-float)]"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="font-medium">{actor}</p>
            <p className="t-small text-muted">{roleMeta(role).label}</p>
          </div>
          {role === "student" && (
            <Link role="menuitem" href="/profile" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-[14px] hover:bg-surface-muted">
              My profile
            </Link>
          )}
          <Link role="menuitem" href="/settings" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-[14px] hover:bg-surface-muted">
            Settings
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              signOut();
              router.push("/sign-in");
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] hover:bg-surface-muted"
          >
            <LogOut className="size-4 text-muted" aria-hidden />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function TopBar() {
  const role = useDemo((s) => s.role);
  const badges = useBadges();
  return (
    <header
      data-print="hide"
      className="sticky top-0 z-30 border-b border-border bg-surface/85 backdrop-blur supports-[backdrop-filter]:bg-surface/75"
    >
      <div className="md:hidden">
        <BrandStripe />
      </div>
      <div className="flex h-14 items-center gap-2 px-4 md:h-16 md:px-6">
        <Link href="/home" className="rounded-[8px] md:hidden" aria-label="ZISAR portal home">
          <Logo size="sm" />
        </Link>
        <div className="flex-1" />
        <div className="hidden sm:block">
          <RoleSwitcher />
        </div>
        <ThemeToggle />
        {role === "student" && (
          <Link
            href="/notices"
            aria-label={`Notices${badges.notices ? `, ${badges.notices} new` : ""}`}
            className="relative grid size-9 place-items-center rounded-[8px] text-muted hover:bg-surface-muted hover:text-text"
          >
            <Bell className="size-[18px]" aria-hidden />
            {badges.notices > 0 && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent ring-2 ring-surface" aria-hidden />}
          </Link>
        )}
        <UserMenu />
      </div>
      <div className="flex justify-center border-t border-border px-4 py-1.5 sm:hidden">
        <RoleSwitcher compact />
      </div>
    </header>
  );
}

function BottomTabs() {
  const role = useDemo((s) => s.role);
  const pathname = usePathname();
  const badges = useBadges();
  return (
    <nav
      aria-label="Tabs"
      data-print="hide"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-5">
        {NAV[role].tabs.map((t) => {
          const active = isActive(pathname, t.href);
          const Icon = t.icon;
          const n = t.badge ? badges[t.badge] : 0;
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium",
                  active ? "text-accent" : "text-muted",
                )}
              >
                <span className="relative">
                  <Icon className="size-[22px]" weight={active ? "regular" : undefined} aria-hidden />
                  {n > 0 && <Badge n={n} className="absolute -top-1.5 -right-3 h-4 min-w-4 px-1 text-[10px]" />}
                </span>
                <span className="max-w-full truncate px-1">{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function HelpButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/help")) return null;
  return (
    <Link
      href="/help?now=1"
      data-print="hide"
      className="fixed right-4 bottom-[calc(80px+env(safe-area-inset-bottom))] z-30 flex h-12 items-center gap-2 rounded-full bg-danger px-4 text-[14px] font-semibold text-white shadow-[var(--shadow-float)] transition-transform duration-150 hover:scale-[1.02] md:right-6 md:bottom-6 dark:text-[#0b0b0c]"
    >
      <LifeBuoy className="size-5" aria-hidden />
      I need help now
    </Link>
  );
}

function ShellSkeleton() {
  return (
    <div className="flex min-h-dvh" aria-busy="true" aria-label="Loading">
      <div className="hidden w-16 border-r border-border bg-surface md:block lg:w-60" />
      <div className="flex flex-1 flex-col">
        <div className="h-16 border-b border-border bg-surface" />
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8 md:px-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const signedIn = useDemo((s) => s.signedIn);
  const role = useDemo((s) => s.role);
  const student = useCurrentStudent();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!hydrated) return;
    if (!signedIn) {
      const next = pathname && pathname !== "/" ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/sign-in${next}`);
    } else if (role === "student" && student && !student.onboarded) router.replace("/welcome");
  }, [hydrated, signedIn, role, student, router, pathname]);

  if (!hydrated || !signedIn) return <ShellSkeleton />;

  return (
    <div className="flex min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:rounded-[8px] focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <OfflineBanner />
        <TopBar />
        <main id="main" key={pathname} className="anim-fade mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-32 md:px-8 md:pt-8 md:pb-16">
          <React.Suspense fallback={<Skeleton className="h-64" />}>{children}</React.Suspense>
        </main>
      </div>
      {role === "student" && <HelpButton />}
      <BottomTabs />
      <Toaster />
    </div>
  );
}
