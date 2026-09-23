"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDemo } from "@/lib/store";
import { ELECTION_STAGES } from "@/lib/selectors";
import { Tabs } from "@/components/ui/tabs";
import { PageHeader } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { Overview } from "@/components/elections/Overview";
import { Committee } from "@/components/elections/Committee";
import { Portal } from "@/components/elections/Portal";

type Tab = "overview" | "committee" | "portal";

export default function ElectionsPage() {
  const params = useSearchParams();
  const router = useRouter();
  const data = useDemo((s) => s.data);
  const tab = (["overview", "committee", "portal"].includes(params.get("tab") ?? "") ? params.get("tab") : "overview") as Tab;
  const current = data.elections.find((e) => e.status !== "archived" && e.status !== "draft");
  const stage = current && ELECTION_STAGES.find((s) => s.status === current.status);

  return (
    <>
      <PageHeader
        title="Elections"
        description="How ZISAR chooses its committee, who serves now, and where members vote."
        actions={current && stage && <StatusPill status={current.status === "voting" || current.status === "nominations" ? "open" : "closed"} label={stage.label} />}
      />
      <Tabs<Tab>
        label="Elections"
        value={tab}
        onChange={(v) => router.replace(`/elections?tab=${v}`, { scroll: false })}
        className="mb-6"
        items={[
          { value: "overview", label: "Overview" },
          { value: "committee", label: "Current committee" },
          { value: "portal", label: "Election portal" },
        ]}
      />
      <div key={tab} className="anim-fade">
        {tab === "overview" && <Overview />}
        {tab === "committee" && <Committee />}
        {tab === "portal" && <Portal />}
      </div>
    </>
  );
}
