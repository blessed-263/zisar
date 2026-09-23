"use client";

import { Plus, Trash as Trash2 } from "@phosphor-icons/react";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function ArrearsEditor({
  value,
  onChange,
  error,
}: {
  value: { subject: string; mark?: string }[];
  onChange: (v: { subject: string; mark?: string }[]) => void;
  error?: string;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1.5 text-[14px] font-medium">Subjects with arrears</legend>
      {value.map((a, i) => (
        <div key={i} className="flex gap-2">
          <Input
            aria-label={`Subject ${i + 1}`}
            placeholder="Subject"
            value={a.subject}
            onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, subject: e.target.value } : x)))}
          />
          <Input
            aria-label={`Mark for subject ${i + 1}`}
            placeholder="Mark"
            className="w-28 shrink-0"
            value={a.mark ?? ""}
            onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, mark: e.target.value } : x)))}
          />
          <Button type="button" variant="ghost" size="icon" aria-label={`Remove subject ${i + 1}`} onClick={() => onChange(value.filter((_, j) => j !== i))}>
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </div>
      ))}
      {error && (
        <p role="alert" className="t-small text-danger">
          {error}
        </p>
      )}
      <Button type="button" variant="secondary" size="sm" className="self-start" onClick={() => onChange([...value, { subject: "" }])}>
        <Plus className="size-4" aria-hidden />
        Add a subject
      </Button>
    </fieldset>
  );
}
