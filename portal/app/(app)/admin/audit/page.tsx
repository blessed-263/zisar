"use client";

import * as React from "react";
import { ListChecks, Lock, MagnifyingGlass as Search } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import { ROLES, roleMeta } from "@/lib/constants";
import type { AuditEntry, Role } from "@/lib/types";
import { downloadBlob, formatDateTime } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { PageHeader } from "@/components/blocks";
import { EmptyState } from "@/components/EmptyState";
import { Guard } from "@/components/Guard";

const WELFARE = /help|alert/i;

/** Welfare entries keep who and when, but the subject stays with the welfare officers. */
function redact(e: AuditEntry): AuditEntry {
  if (!WELFARE.test(e.action)) return e;
  return { ...e, target: e.target.split(" · ")[0], detail: undefined };
}

export default function AuditPage() {
  return (
    <Guard area="audit">
      <Audit />
    </Guard>
  );
}

function Audit() {
  const audit = useDemo((s) => s.data.audit);
  const [q, setQ] = React.useState("");
  const [role, setRole] = React.useState<Role | "">("");
  const [limit, setLimit] = React.useState(50);
  const entries = React.useMemo(
    () =>
      [...audit]
        .sort((a, b) => b.at.localeCompare(a.at))
        .map(redact)
        .filter((e) => !role || e.role === role)
        .filter((e) => !q || `${e.actor} ${e.action} ${e.target} ${e.detail ?? ""}`.toLowerCase().includes(q.toLowerCase())),
    [audit, q, role],
  );

  return (
    <>
      <PageHeader
        label="Admin"
        title="Audit log"
        description="Every decision, edit, and file opened, with who did it and when. Nobody can change or delete an entry."
        actions={
          <Button variant="secondary" size="sm" onClick={() => downloadBlob("zisar-audit.json", JSON.stringify(entries, null, 2))}>
            Export
          </Button>
        }
      />
      <p className="t-small mb-4 flex items-center gap-1.5 text-muted">
        <Lock className="size-3.5" aria-hidden />
        Ballots are never logged. Welfare entries show only who acted and for whom.
      </p>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input aria-label="Search the log" placeholder="Search by person, action, or student" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select aria-label="Role" value={role} onChange={(e) => setRole(e.target.value as Role | "")} className="sm:w-56">
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r.role} value={r.role}>
              {r.label}
            </option>
          ))}
        </Select>
      </div>
      {entries.length ? (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead className="t-label border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Who</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">About</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {entries.slice(0, limit).map((e) => (
                <tr key={e.id} className="align-top">
                  <td className="tabular whitespace-nowrap px-4 py-3 text-muted">{formatDateTime(e.at)}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium">{e.actor}</span>
                    <span className="t-small block text-muted">{roleMeta(e.role).label}</span>
                  </td>
                  <td className="px-4 py-3">{e.action}</td>
                  <td className="px-4 py-3">
                    {e.target}
                    {e.detail && <span className="t-small block text-muted">{e.detail}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {entries.length > limit && (
            <div className="border-t border-border p-3 text-center">
              <Button variant="ghost" size="sm" onClick={() => setLimit(limit + 50)}>
                Show more ({entries.length - limit} left)
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <EmptyState icon={ListChecks} title="No entries match." />
      )}
    </>
  );
}
