"use client";

import * as React from "react";
import { Handshake as HeartHandshake } from "@phosphor-icons/react";
import { useDemo, withUndo } from "@/lib/store";
import { cityOf, fullName, stageLabel, uniOf } from "@/lib/selectors";
import { COORDINATOR_CITY } from "@/lib/constants";
import type { Student } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { Avatar, PageHeader } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { Guard } from "@/components/Guard";

export default function MentorsPage() {
  return (
    <Guard area="coordinator">
      <Mentors />
    </Guard>
  );
}

function Mentors() {
  const data = useDemo((s) => s.data);
  const offer = useDemo((s) => s.offerMentor);
  const inCity = data.students.filter((s) => cityOf(data, s) === COORDINATOR_CITY);
  const isNew = (s: Student) => s.studies.stage === "preparatory" || s.studies.stage === 1;
  const newcomers = inCity.filter(isNew);
  const seniors = inCity.filter((s) => !isNew(s) && s.studies.academicStatus === "enrolled");
  const pairs = data.mentors.filter((m) => inCity.some((s) => s.id === m.newcomerId));
  const [pick, setPick] = React.useState<Record<string, string>>({});

  return (
    <>
      <PageHeader
        label="Coordinator"
        title="Mentors"
        description="Pair each newcomer with a senior from the same university who agrees to be their first call. The senior is asked first and can say no."
      />
      <div className="flex flex-col gap-6">
        <Card className="overflow-hidden">
          <CardHeader title="Newcomers" />
          {newcomers.length ? (
            <div className="mt-3 divide-y divide-border border-t border-border">
              {newcomers.map((n) => {
                const pair = pairs.find((p) => p.newcomerId === n.id && p.status !== "declined");
                const options = [...seniors].sort((a, b) => Number(b.studies.universityId === n.studies.universityId) - Number(a.studies.universityId === n.studies.universityId));
                return (
                  <div key={n.id} className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center">
                    <div className="flex flex-1 items-center gap-3">
                      <Avatar name={fullName(n)} photo={n.photo} size={40} />
                      <div className="flex flex-col">
                        <span className="font-medium">{fullName(n)}</span>
                        <span className="t-small text-muted">
                          {uniOf(data, n)?.name} · {stageLabel(n)}
                        </span>
                      </div>
                    </div>
                    {pair ? (
                      <span className="flex items-center gap-2 text-[14px]">
                        {fullName(data.students.find((s) => s.id === pair.mentorId))}
                        <StatusPill status={pair.status === "accepted" ? "accepted" : "pending"} label={pair.status === "accepted" ? "Paired" : "Asked"} size="sm" />
                      </span>
                    ) : (
                      <div className="flex gap-2">
                        <Select aria-label={`Mentor for ${fullName(n)}`} value={pick[n.id] ?? ""} onChange={(e) => setPick({ ...pick, [n.id]: e.target.value })} className="w-56">
                          <option value="">Choose a senior</option>
                          {options.map((s) => (
                            <option key={s.id} value={s.id}>
                              {fullName(s)}
                              {s.studies.universityId === n.studies.universityId ? " · same university" : ""}
                            </option>
                          ))}
                        </Select>
                        <Button
                          variant="primary"
                          disabled={!pick[n.id]}
                          onClick={() => withUndo("Mentor asked. They answer from their home page.", () => offer(n.id, pick[n.id]))}
                        >
                          Ask
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={HeartHandshake} title="No newcomers in the city this year." />
          )}
        </Card>

        {pairs.length > 0 && (
          <section>
            <h2 className="t-label mb-3">History</h2>
            <ul className="flex flex-col gap-1 text-[14px] text-muted">
              {pairs.map((p) => (
                <li key={p.id}>
                  {formatDate(p.at)} · {fullName(data.students.find((s) => s.id === p.mentorId))} for {fullName(data.students.find((s) => s.id === p.newcomerId))} ·{" "}
                  {p.status === "offered" ? "waiting for an answer" : p.status}
                  {p.contact ? ` · ${p.contact}` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
