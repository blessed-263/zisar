"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Camera, Check, ShieldCheck } from "@phosphor-icons/react";
import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/card";
import { Avatar } from "@/components/blocks";
import { useDemo, useHydrated, useCurrentStudent, toast } from "@/lib/store";
import { CONSENT_TEXT, CONSENT_VERSION, DEMO_STUDENT_ID } from "@/lib/constants";
import { fullName } from "@/lib/selectors";
import { cn, fileToDataUrl } from "@/lib/utils";

const STEPS = ["Consent", "Photo", "Required details"] as const;

export default function WelcomePage() {
  const hydrated = useHydrated();
  if (!hydrated)
    return (
      <div className="w-full max-w-[520px]">
        <Skeleton className="h-[560px] rounded-[16px]" />
      </div>
    );
  return <Welcome />;
}

function Welcome() {
  const router = useRouter();
  const s = useCurrentStudent();
  const giveConsent = useDemo((x) => x.giveConsent);
  const updateStudent = useDemo((x) => x.updateStudent);
  const completeOnboarding = useDemo((x) => x.completeOnboarding);
  const [step, setStep] = React.useState(s.consent ? 1 : 0);
  const [agreed, setAgreed] = React.useState(!!s.consent);
  const [photo, setPhoto] = React.useState(s.photo);
  const [kin, setKin] = React.useState({
    kinName: s.emergency.kinName,
    kinPhone: s.emergency.kinPhone,
    kinTown: s.emergency.kinTown,
    phoneRu: s.contacts.phoneRu,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const inputRef = React.useRef<HTMLInputElement>(null);

  function finish() {
    const err: Record<string, string> = {};
    if (!kin.kinName.trim()) err.kinName = "Enter the name of someone we can call at home.";
    if (!/^\+?\d[\d\s]{7,}$/.test(kin.kinPhone.trim())) err.kinPhone = "Enter the phone number with the country code, for example +263 77 123 4567.";
    if (!kin.kinTown.trim()) err.kinTown = "Enter the town or village where they live.";
    if (!/^\+?\d[\d\s]{7,}$/.test(kin.phoneRu.trim())) err.phoneRu = "Enter your Russian number, for example +7 916 123 4567.";
    setErrors(err);
    if (Object.keys(err).length) return;
    updateStudent(DEMO_STUDENT_ID, {
      photo,
      contacts: { phoneRu: kin.phoneRu },
      emergency: { kinName: kin.kinName, kinPhone: kin.kinPhone, kinTown: kin.kinTown },
    });
    completeOnboarding(DEMO_STUDENT_ID);
    toast("Your profile is set up", { tone: "success" });
    router.push("/home");
  }

  return (
    <AuthCard
      title={`Welcome, ${s.preferredName || s.firstNames}`}
      description="Three short steps before you start. You can change any of this later."
      className="max-w-[520px]"
    >
      <ol className="flex items-center gap-2" aria-label="Setup steps">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col gap-1.5">
            <span className={cn("h-1 rounded-full", i <= step ? "bg-accent" : "bg-surface-muted")} aria-hidden />
            <span className={cn("text-[12px] font-medium", i === step ? "text-text" : "text-muted")}>
              {i < step && <Check className="mr-1 inline size-3 text-success" aria-hidden />}
              {label}
              {i === step && <span className="sr-only"> (current step)</span>}
            </span>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-accent" aria-hidden />
            <h2 className="font-semibold">How ZISAR uses your information</h2>
          </div>
          <div className="flex max-h-64 flex-col gap-3 overflow-y-auto rounded-[12px] border border-border bg-surface-muted/50 p-4 text-[14px] leading-6">
            {CONSENT_TEXT.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="t-small text-muted">Consent version {CONSENT_VERSION}. Draft for committee approval.</p>
          </div>
          <Checkbox checked={agreed} onChange={setAgreed} label="I have read this and I agree" />
          <Button
            variant="primary"
            disabled={!agreed}
            onClick={() => {
              giveConsent(DEMO_STUDENT_ID);
              setStep(1);
            }}
          >
            Agree and continue
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="relative">
            <Avatar name={fullName(s)} photo={photo} size={112} />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute right-0 bottom-0 grid size-10 place-items-center rounded-full border-2 border-surface bg-accent text-accent-contrast"
              aria-label="Choose a photo"
            >
              <Camera className="size-5" aria-hidden />
            </button>
          </div>
          <p className="max-w-sm text-muted">
            A clear face photo, like a passport photo. Committee members use it to recognise you at meetings. It is not
            shown to other students.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) setPhoto(await fileToDataUrl(f, 400));
            }}
          />
          <div className="flex w-full flex-col gap-2">
            <Button variant="primary" onClick={() => (photo ? setStep(2) : inputRef.current?.click())}>
              {photo ? "Continue" : "Choose a photo"}
            </Button>
            <Button variant="ghost" onClick={() => setStep(2)}>
              Skip for now
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form
          className="flex flex-col gap-4"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            finish();
          }}
        >
          <p className="text-[14px] text-muted">
            These are the details the welfare office needs if something goes wrong. The rest of your profile can wait.
          </p>
          <Field label="Your Russian phone number" error={errors.phoneRu}>
            <Input type="tel" autoComplete="tel" value={kin.phoneRu} onChange={(e) => setKin({ ...kin, phoneRu: e.target.value })} />
          </Field>
          <Field label="Next of kin, full name" error={errors.kinName}>
            <Input value={kin.kinName} onChange={(e) => setKin({ ...kin, kinName: e.target.value })} />
          </Field>
          <Field label="Next of kin, phone" error={errors.kinPhone}>
            <Input type="tel" value={kin.kinPhone} onChange={(e) => setKin({ ...kin, kinPhone: e.target.value })} />
          </Field>
          <Field label="Next of kin, town in Zimbabwe" error={errors.kinTown}>
            <Input value={kin.kinTown} onChange={(e) => setKin({ ...kin, kinTown: e.target.value })} />
          </Field>
          <Button type="submit" variant="primary">
            Finish setup
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
