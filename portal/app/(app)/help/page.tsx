"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle as CheckCircle2, Lifebuoy as LifeBuoy, ChatText as MessageSquare, Phone, Siren } from "@phosphor-icons/react";
import { useDemo, useCurrentStudent } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Sheet } from "@/components/ui/sheet";
import { Notice, PageHeader, Row } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { Guard } from "@/components/Guard";
import { SlideToConfirm } from "@/components/welfare/SlideToConfirm";

export default function HelpPage() {
  return (
    <Guard area="own-file">
      <Help />
    </Guard>
  );
}

function Help() {
  const data = useDemo((s) => s.data);
  const me = useCurrentStudent();
  const params = useSearchParams();
  const router = useRouter();
  const [emergency, setEmergency] = React.useState(params.get("now") === "1");
  const [now] = React.useState(() => Date.now());
  const alerts = data.alerts.filter((a) => a.studentId === me.id);
  const latest = alerts[0];
  const recent = latest && now - new Date(latest.at).getTime() < 24 * 3600 * 1000 ? latest : undefined;
  const requests = data.help.filter((h) => h.studentId === me.id);

  return (
    <>
      <PageHeader title="Help" description="Two welfare officers read these. Nothing here is shared with your university or the verifiers." />
      <div className="flex flex-col gap-6">
        {recent ? (
          <AlertStatus alert={recent} />
        ) : (
          <Card className="border-danger/40">
            <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-danger-soft text-danger">
                <Siren className="size-6" aria-hidden />
              </span>
              <div className="flex flex-1 flex-col">
                <span className="font-semibold">I need help now</span>
                <span className="t-small text-muted">Sends your name, city, and phone number to both welfare officers at once. They call you back.</span>
              </div>
              <Button variant="destructive" onClick={() => setEmergency(true)}>
                I need help now
              </Button>
            </CardBody>
          </Card>
        )}

        <Notice tone="neutral" icon={Phone} title="In immediate danger, call 112">
          112 reaches police, ambulance, and fire services anywhere in Russia, free from any phone.
        </Notice>

        <AskForm onCreated={(id) => router.push(`/help/${id}`)} />

        <Card className="overflow-hidden">
          <CardHeader title="Your requests" />
          {requests.length ? (
            <div className="mt-3 divide-y divide-border border-t border-border">
              {requests.map((h) => (
                <Row
                  key={h.id}
                  href={`/help/${h.id}`}
                  icon={MessageSquare}
                  title={h.subject}
                  meta={`${h.messages.length} message${h.messages.length === 1 ? "" : "s"} · last ${formatDateTime(h.messages[h.messages.length - 1].at)}`}
                  trailing={<StatusPill status={h.status} size="sm" />}
                />
              ))}
            </div>
          ) : (
            <CardBody>
              <p className="text-muted">You have not asked for help yet.</p>
            </CardBody>
          )}
        </Card>
      </div>
      <EmergencySheet
        open={emergency}
        onOpenChange={(o) => {
          setEmergency(o);
          if (!o && params.get("now")) router.replace("/help");
        }}
      />
    </>
  );
}

function AlertStatus({ alert }: { alert: { at: string; officers: string[]; receivedBy?: string; receivedAt?: string; phone: string } }) {
  return (
    <Card className="anim-fade border-success/40">
      <CardBody className="flex gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="size-6" aria-hidden />
        </span>
        <div className="flex flex-col gap-1">
          <span className="font-semibold">{alert.receivedBy ? `${alert.receivedBy} has your alert` : "Your alert was sent"}</span>
          <span className="text-[15px] leading-6">
            {alert.receivedBy
              ? `${alert.receivedBy} confirmed at ${formatDateTime(alert.receivedAt)} and will call ${alert.phone}. Keep your phone on and close by.`
              : `${alert.officers.join(" and ")} were told at ${formatDateTime(alert.at)}. One of them will call ${alert.phone}. Keep your phone on and close by.`}
          </span>
          <span className="t-small text-muted">If nobody calls within 15 minutes, and you are in danger, call 112.</span>
        </div>
      </CardBody>
    </Card>
  );
}

function EmergencySheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const sendAlert = useDemo((s) => s.sendAlert);
  const me = useCurrentStudent();
  const [phone, setPhone] = React.useState(me.contacts.phoneRu);
  const [sent, setSent] = React.useState(false);
  const [wasOpen, setWasOpen] = React.useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) setSent(false);
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={sent ? "Help is on the way" : "Send an emergency alert"}
      description={sent ? undefined : "Both welfare officers get your name, city, and this number straight away."}
      footer={
        sent ? (
          <Button variant="primary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        ) : undefined
      }
    >
      {sent ? (
        <div className="anim-fade flex flex-col items-center gap-4 py-4 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-success-soft text-success">
            <LifeBuoy className="size-8" aria-hidden />
          </span>
          <p className="text-[16px] leading-7">A welfare officer will call {phone}. Keep your phone on and stay where you are if it is safe.</p>
          <p className="t-small text-muted">If you are in danger right now, call 112.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <Field label="Number to call you on" required>
            <Input type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
          <SlideToConfirm
            label="Slide to send alert"
            disabled={phone.trim().length < 6}
            onConfirm={() => {
              sendAlert(me.id, phone.trim());
              setSent(true);
            }}
          />
          <p className="t-small text-center text-muted">With a keyboard, focus the handle and press End.</p>
        </div>
      )}
    </Sheet>
  );
}

function AskForm({ onCreated }: { onCreated: (id: string) => void }) {
  const createHelp = useDemo((s) => s.createHelp);
  const me = useCurrentStudent();
  const [subject, setSubject] = React.useState("");
  const [text, setText] = React.useState("");
  const [phone, setPhone] = React.useState(me.contacts.phoneRu);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  return (
    <Card>
      <CardHeader title="Ask for help" description="For things that are not an emergency: housing, documents, health, money, or feeling low. An officer replies here." />
      <CardBody className="flex flex-col gap-4">
        <Field label="What is it about" error={errors.subject} required>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="For example: hostel room has no heating" />
        </Field>
        <Field label="Tell us what happened" error={errors.text} required>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} />
        </Field>
        <Field label="Phone, if they need to call" optional>
          <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="sm:w-64" />
        </Field>
      </CardBody>
      <CardFooter>
        <Button
          variant="primary"
          onClick={() => {
            const err: Record<string, string> = {};
            if (!subject.trim()) err.subject = "Give it a short title.";
            if (text.trim().length < 10) err.text = "A sentence or two helps the officer reply properly.";
            setErrors(err);
            if (Object.keys(err).length) return;
            onCreated(createHelp(me.id, subject.trim(), text.trim(), phone.trim()));
          }}
        >
          Send request
        </Button>
      </CardFooter>
    </Card>
  );
}
