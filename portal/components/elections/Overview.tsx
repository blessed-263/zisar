"use client";

import { DownloadSimple as Download, FileText, Scroll as ScrollText, ShieldCheck } from "@phosphor-icons/react";
import { useDemo, toast } from "@/lib/store";
import { turnout } from "@/lib/selectors";
import { formatDate } from "@/lib/utils";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { KeyValue, Row } from "@/components/blocks";
import { StageTrack } from "./StageTrack";
import { Results } from "./Results";

const RULES = [
  "Every enrolled member with a complete identity and studies section can vote. Members on suspension cannot.",
  "A member can stand for one office in each election. A nomination needs a proposer and a seconder, who each confirm it in the portal.",
  "The election officer checks each nomination against the constitution and gives a reason for any that is declined.",
  "City representatives are elected only by members studying in that city.",
  "Voting is secret. The portal records that you voted, and separately adds your choice to the totals. The two are never linked, and nobody can see who voted for whom.",
  "The result stands if turnout reaches the quorum. A tie is settled as the constitution says, not by the portal.",
];

export function Overview() {
  const data = useDemo((s) => s.data);
  const current = data.elections.find((e) => e.status !== "archived" && e.status !== "draft");
  const past = data.elections.filter((e) => e.status === "archived" || (e.status === "published" && e !== current));
  const t = current ? turnout(data, current) : undefined;

  return (
    <div className="flex flex-col gap-6">
      {current && (
        <Card>
          <CardHeader label="Current election" title={current.title} />
          <CardBody className="flex flex-col gap-5">
            <StageTrack status={current.status} compact />
            <KeyValue
              items={[
                ["Nominations closed", formatDate(current.nominationsClose)],
                ["Voting", `${formatDate(current.votingOpens)} to ${formatDate(current.votingCloses)}`],
                ["Offices", current.offices.map((o) => o.name).join(", ")],
                ["Quorum", `${current.quorumPct}% of eligible members${t ? ` · turnout so far ${t.pct}%` : ""}`],
                ["Election officer", current.officerName],
                ["Scrutineer", current.scrutineerName],
              ]}
            />
          </CardBody>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader title="How elections work" description="Draft for committee approval. The constitution is the final word." />
          <CardBody>
            <ol className="flex flex-col gap-3">
              {RULES.map((r, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-6">
                  <span className="tabular grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft text-[12px] font-semibold text-accent">{i + 1}</span>
                  {r}
                </li>
              ))}
            </ol>
            <p className="t-small mt-4 flex items-center gap-1.5 text-muted">
              <ShieldCheck className="size-4" aria-hidden />
              Ballots never appear in the audit log.
            </p>
          </CardBody>
        </Card>

        <Card className="self-start overflow-hidden">
          <CardHeader title="Constitution and minutes" />
          <div className="mt-3 divide-y divide-border border-t border-border">
            {data.files.map((f) => (
              <Row
                key={f.id}
                icon={f.kind === "minutes" ? FileText : ScrollText}
                title={f.title}
                meta={`${f.fileName} · filed ${formatDate(f.at)}`}
                onClick={() => toast("Files are not stored in the demo")}
                trailing={<Download className="size-4 text-muted" aria-hidden />}
              />
            ))}
          </div>
        </Card>
      </div>

      {past.map((e) => (
        <Card key={e.id}>
          <CardHeader label="Past election" title={e.title} description={e.publishedAt ? `Results published ${formatDate(e.publishedAt)}` : undefined} />
          <CardBody>
            <Results election={e} />
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
