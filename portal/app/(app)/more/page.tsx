"use client";

import { SignOut as LogOut } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/store";
import { NAV, SETTINGS_ITEM } from "@/lib/nav";
import { badgeCounts } from "@/lib/badges";
import { PageHeader, Row } from "@/components/blocks";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/shell/AppShell";

export default function MorePage() {
  const role = useDemo((s) => s.role);
  const data = useDemo((s) => s.data);
  const signOut = useDemo((s) => s.signOut);
  const router = useRouter();
  const badges = badgeCounts(data);
  return (
    <>
      <PageHeader title="More" />
      <div className="flex flex-col gap-6">
        {NAV[role].groups.map((g) => (
          <section key={g.label} className="flex flex-col gap-2">
            <h2 className="t-label px-1">{g.label}</h2>
            <Card className="divide-y divide-border overflow-hidden p-0">
              {g.items.map((it) => {
                const n = it.badge ? badges[it.badge] : 0;
                return (
                  <Row
                    key={it.href}
                    href={it.href}
                    icon={it.icon}
                    title={it.label}
                    trailing={
                      n > 0 ? (
                        <span className="tabular rounded-full bg-accent px-2 text-[12px] font-semibold text-accent-contrast">{n}</span>
                      ) : undefined
                    }
                  />
                );
              })}
            </Card>
          </section>
        ))}
        <Card className="divide-y divide-border overflow-hidden p-0">
          <Row href={SETTINGS_ITEM.href} icon={SETTINGS_ITEM.icon} title={SETTINGS_ITEM.label} />
          <div className="flex min-h-14 items-center justify-between px-4 md:px-5">
            <span className="font-medium">Theme</span>
            <ThemeToggle />
          </div>
          <Row
            icon={LogOut}
            title="Sign out"
            onClick={() => {
              signOut();
              router.push("/sign-in");
            }}
          />
        </Card>
      </div>
    </>
  );
}
