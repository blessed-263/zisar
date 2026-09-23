"use client";

import * as React from "react";
import { Airplane as Plane, AirplaneLanding as PlaneLanding } from "@phosphor-icons/react";
import { useDemo, useCurrentStudent, withUndo } from "@/lib/store";
import type { TravelNotice } from "@/lib/types";
import { formatDate, relativeDays } from "@/lib/utils";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, RadioCards } from "@/components/ui/field";
import { Notice, PageHeader } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { Guard } from "@/components/Guard";

const REASONS: TravelNotice["reason"][] = ["Holiday", "Family emergency", "End of studies", "Other"];

export default function TravelPage() {
  return (
    <Guard area="own-file">
      <Travel />
    </Guard>
  );
}

function Travel() {
  const data = useDemo((s) => s.data);
  const closeTravel = useDemo((s) => s.closeTravel);
  const me = useCurrentStudent();
  const mine = data.travel.filter((t) => t.studentId === me.id).sort((a, b) => b.leave.localeCompare(a.leave));
  const open = mine.filter((t) => t.status === "open");
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <PageHeader
        title="Travel"
        description="Tell the association when you leave Russia and when you are back, so someone knows where you are if anything goes wrong."
      />
      <div className="flex flex-col gap-6">
        {open.map((t) => {
          const overdue = t.returnDate.slice(0, 10) < today;
          return (
            <Card key={t.id} className={overdue ? "border-warning/50" : undefined}>
              <CardHeader
                label={t.reason}
                title={`${formatDate(t.leave)} to ${formatDate(t.returnDate)}`}
                action={<StatusPill status={overdue ? "overdue" : "open"} />}
              />
              <CardBody className="flex flex-col gap-3">
                {overdue ? (
                  <Notice tone="warning" title={`You were due back ${relativeDays(t.returnDate)}`}>
                    If you are back, say so. If your plans changed, the welfare officers would like to hear from you.
                  </Notice>
                ) : (
                  <p className="text-muted">Return {relativeDays(t.returnDate)}.</p>
                )}
                {t.reRegister && <p className="t-small text-muted">Reminder: register your address within 7 working days of coming back.</p>}
              </CardBody>
              <CardFooter>
                <Button variant="primary" onClick={() => withUndo("Welcome back. The travel notice is closed.", () => closeTravel(t.id))}>
                  <PlaneLanding className="size-4" aria-hidden />
                  I am back
                </Button>
              </CardFooter>
            </Card>
          );
        })}

        <NewTravel />

        {mine.some((t) => t.status === "closed") && (
          <section>
            <h2 className="t-label mb-3">Past trips</h2>
            <ul className="flex flex-col gap-1 text-muted">
              {mine
                .filter((t) => t.status === "closed")
                .map((t) => (
                  <li key={t.id}>
                    {t.reason} · {formatDate(t.leave)} to {formatDate(t.returnDate)} · back {formatDate(t.closedAt)}
                  </li>
                ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}

function NewTravel() {
  const createTravel = useDemo((s) => s.createTravel);
  const me = useCurrentStudent();
  const [f, setF] = React.useState({ leave: "", returnDate: "", reason: "Holiday" as TravelNotice["reason"], reRegister: true });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  return (
    <Card>
      <CardHeader title="I am travelling" description="Only the welfare officers see your dates." />
      <CardBody className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Leaving" error={errors.leave} required>
            <Input type="date" value={f.leave} onChange={(e) => setF({ ...f, leave: e.target.value })} />
          </Field>
          <Field label="Coming back" error={errors.returnDate} required>
            <Input type="date" value={f.returnDate} onChange={(e) => setF({ ...f, returnDate: e.target.value })} />
          </Field>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[14px] font-medium">Reason</span>
          <RadioCards<TravelNotice["reason"]> name="reason" value={f.reason} onChange={(reason) => setF({ ...f, reason })} columns={2} options={REASONS.map((r) => ({ value: r, label: r }))} />
        </div>
        <Checkbox checked={f.reRegister} onChange={(v) => setF({ ...f, reRegister: v })} label="Remind me to register my address when I am back" />
      </CardBody>
      <CardFooter>
        <Button
          variant="primary"
          onClick={() => {
            const err: Record<string, string> = {};
            if (!f.leave) err.leave = "Choose the day you leave.";
            if (!f.returnDate) err.returnDate = "Choose the day you expect to be back.";
            else if (f.leave && f.returnDate <= f.leave) err.returnDate = "You come back after you leave.";
            setErrors(err);
            if (Object.keys(err).length) return;
            withUndo("Travel notice saved. Safe travels.", () => createTravel({ studentId: me.id, ...f }));
            setF({ leave: "", returnDate: "", reason: "Holiday", reRegister: true });
          }}
        >
          <Plane className="size-4" aria-hidden />
          Save travel notice
        </Button>
      </CardFooter>
    </Card>
  );
}
