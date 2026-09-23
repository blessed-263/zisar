"use client";

import * as React from "react";
import { Monitor, Moon, ArrowCounterClockwise as RotateCcw, Sun } from "@phosphor-icons/react";
import { useDemo, useCurrentStudent, toast, withUndo } from "@/lib/store";
import { DEMO_STUDENT_ID } from "@/lib/constants";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Switch } from "@/components/ui/field";
import { Segmented } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/ui/sheet";
import { PageHeader } from "@/components/blocks";

export default function SettingsPage() {
  const role = useDemo((s) => s.role);
  const theme = useDemo((s) => s.theme);
  const setTheme = useDemo((s) => s.setTheme);
  const resetDemo = useDemo((s) => s.resetDemo);
  const updateStudent = useDemo((s) => s.updateStudent);
  const s = useCurrentStudent();
  const [pw, setPw] = React.useState({ current: "", next: "", again: "" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [confirmReset, setConfirmReset] = React.useState(false);

  return (
    <>
      <PageHeader title="Settings" />
      <div className="flex max-w-2xl flex-col gap-6">
        {role === "student" && (
          <Card>
            <CardHeader title="Notifications" />
            <CardBody className="flex flex-col divide-y divide-border py-2">
              <Switch
                checked={s.emailAnnouncements}
                onChange={(v) => withUndo("Notification setting saved", () => updateStudent(DEMO_STUDENT_ID, { emailAnnouncements: v }))}
                label="Also send announcements by email"
                description="Posters and association news still appear in the portal either way."
              />
              <Switch checked disabled onChange={() => {}} label="Decisions on results and documents" description="Always emailed. You cannot turn this off, because deadlines depend on it." />
            </CardBody>
          </Card>
        )}

        <Card>
          <CardHeader title="Appearance" />
          <CardBody>
            <Segmented
              label="Theme"
              value={theme}
              onChange={(v) => setTheme(v as typeof theme)}
              items={[
                { value: "system", label: "System", icon: Monitor },
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
              ]}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Change password" />
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const err: Record<string, string> = {};
              if (!pw.current) err.current = "Enter your current password.";
              if (pw.next.length < 8) err.next = "Use at least 8 characters.";
              if (pw.again !== pw.next) err.again = "The two new passwords do not match.";
              setErrors(err);
              if (Object.keys(err).length) return;
              setPw({ current: "", next: "", again: "" });
              toast("Password changed", { tone: "success" });
            }}
          >
            <CardBody className="grid gap-4">
              <Field label="Current password" error={errors.current}>
                <Input type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
              </Field>
              <Field label="New password" error={errors.next} hint="At least 8 characters.">
                <Input type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
              </Field>
              <Field label="New password again" error={errors.again}>
                <Input type="password" autoComplete="new-password" value={pw.again} onChange={(e) => setPw({ ...pw, again: e.target.value })} />
              </Field>
            </CardBody>
            <CardFooter>
              <Button type="submit" variant="primary">
                Change password
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="border-dashed border-muted/60">
          <CardHeader label="Demo" title="Reset demo" description="Puts every student, submission, vote, and notice back to the starting sample data. Only this browser is affected." />
          <CardFooter className="mt-4">
            <Button variant="destructive-outline" onClick={() => setConfirmReset(true)}>
              <RotateCcw className="size-4" aria-hidden />
              Reset demo
            </Button>
          </CardFooter>
        </Card>
      </div>
      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Reset the demo?"
        description="Everything you changed in this browser goes back to the sample data."
        confirmLabel="Reset demo"
        destructive
        onConfirm={() => {
          resetDemo();
          toast("Demo reset to the sample data", { tone: "success" });
        }}
      />
    </>
  );
}
