"use client";

import * as React from "react";
import { Lock } from "@phosphor-icons/react";
import type { Student } from "@/lib/types";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { isoDateOnly } from "@/lib/utils";

export interface FieldSpec {
  path: string;
  label: string;
  type?: "text" | "date" | "tel" | "email" | "number" | "select" | "textarea";
  options?: { value: string; label: string }[];
  required?: boolean;
  optional?: boolean;
  hint?: string;
  readOnly?: string;
  wide?: boolean;
}

function get(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), obj);
}

function buildPatch(path: string, value: unknown) {
  const keys = path.split(".");
  const out: Record<string, unknown> = {};
  let cur = out;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) cur[k] = value;
    else {
      cur[k] = {};
      cur = cur[k] as Record<string, unknown>;
    }
  });
  return out;
}

function deepMerge(a: Record<string, unknown>, b: Record<string, unknown>) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) {
    out[k] = v && typeof v === "object" && !Array.isArray(v) && out[k] && typeof out[k] === "object" ? deepMerge(out[k] as Record<string, unknown>, v as Record<string, unknown>) : v;
  }
  return out;
}

export function SectionForm({
  student,
  fields,
  onSave,
  note,
}: {
  student: Student;
  fields: FieldSpec[];
  onSave: (patch: Record<string, unknown>) => void;
  note?: React.ReactNode;
}) {
  const initial = React.useMemo(() => {
    const v: Record<string, string> = {};
    for (const f of fields) {
      const raw = get(student, f.path);
      v[f.path] = f.type === "date" ? isoDateOnly(raw as string) : raw === undefined || raw === null ? "" : String(raw);
    }
    return v;
  }, [student, fields]);
  const [values, setValues] = React.useState(initial);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);
  const [prevInitial, setPrevInitial] = React.useState(initial);
  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setValues(initial);
  }
  const dirty = fields.some((f) => values[f.path] !== initial[f.path]);

  function save(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    for (const f of fields) {
      if (f.readOnly) continue;
      const v = values[f.path]?.trim();
      if (f.required && !v) err[f.path] = `Enter ${f.label.toLowerCase()}.`;
      else if (v && f.type === "email" && !v.includes("@")) err[f.path] = "Enter a full email address, like name@example.com.";
      else if (v && f.type === "tel" && !/^\+?\d[\d\s-]{6,}$/.test(v)) err[f.path] = "Enter the number with the country code, like +7 916 123 4567.";
    }
    setErrors(err);
    if (Object.keys(err).length) return;
    let patch: Record<string, unknown> = {};
    for (const f of fields) {
      if (f.readOnly || values[f.path] === initial[f.path]) continue;
      let v: unknown = values[f.path];
      if (f.type === "number") v = Number(v);
      if (f.path === "studies.stage") v = v === "preparatory" ? "preparatory" : Number(v);
      patch = deepMerge(patch, buildPatch(f.path, v));
    }
    setSaving(true);
    setTimeout(() => {
      onSave(patch);
      setSaving(false);
    }, 250);
  }

  return (
    <form onSubmit={save} noValidate className="flex flex-col gap-5">
      {note}
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => {
          const common = {
            value: values[f.path] ?? "",
            disabled: !!f.readOnly,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
              setValues((v) => ({ ...v, [f.path]: e.target.value })),
          };
          const control =
            f.type === "select" ? (
              <Select {...common}>
                {!f.required && <option value="">Not set</option>}
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            ) : f.type === "textarea" ? (
              <Textarea {...common} />
            ) : (
              <Input type={f.type === "number" ? "number" : f.type ?? "text"} {...common} />
            );
          return (
            <div key={f.path} className={f.wide || f.type === "textarea" ? "sm:col-span-2" : undefined}>
              <Field label={f.label} required={f.required} optional={f.optional} hint={f.readOnly ?? f.hint} error={errors[f.path]}>
                {control}
              </Field>
              {f.readOnly && (
                <span className="sr-only">
                  <Lock aria-hidden /> Read only
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" disabled={!dirty} loading={saving}>
          Save changes
        </Button>
        {dirty && (
          <Button type="button" variant="ghost" onClick={() => setValues(initial)}>
            Discard
          </Button>
        )}
      </div>
    </form>
  );
}
