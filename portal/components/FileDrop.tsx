"use client";

import * as React from "react";
import { FileText, ArrowsClockwise as RefreshCw, CloudArrowUp as UploadCloud } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface PickedFile {
  name: string;
  size: number;
  type: string;
  preview?: string;
  file: File;
}

/** Accepts a PDF or a photo. Nothing leaves the browser in the demo. */
export function FileDrop({
  value,
  onChange,
  accept = "application/pdf,image/*",
  label = "Drop a PDF or a photo here",
  hint = "PDF, JPG, or PNG. A clear phone photo is fine.",
  imageOnly,
  error,
}: {
  value?: PickedFile | null;
  onChange: (f: PickedFile | null) => void;
  accept?: string;
  label?: string;
  hint?: string;
  imageOnly?: boolean;
  error?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [drag, setDrag] = React.useState(false);
  const id = React.useId();

  function pick(files: FileList | null) {
    const f = files?.[0];
    if (!f) return;
    const preview = f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined;
    onChange({ name: f.name, size: f.size, type: f.type, preview, file: f });
  }

  if (value) {
    return (
      <div className="flex items-center gap-3 rounded-[12px] border border-border bg-surface-muted/60 p-3">
        {value.preview ? (
           
          <img src={value.preview} alt="" className="size-14 shrink-0 rounded-[8px] object-cover" />
        ) : (
          <span className="grid size-14 shrink-0 place-items-center rounded-[8px] bg-surface text-accent">
            <FileText className="size-6" aria-hidden />
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium">{value.name}</span>
          <span className="t-small text-muted">{Math.max(1, Math.round(value.size / 1024))} KB</span>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-border bg-surface px-3 text-[14px] font-medium hover:bg-surface-muted"
        >
          <RefreshCw className="size-4" aria-hidden />
          Replace
        </button>
        <input ref={inputRef} type="file" accept={imageOnly ? "image/*" : accept} className="sr-only" onChange={(e) => pick(e.target.files)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          pick(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-2 rounded-[12px] border-2 border-dashed px-4 py-8 text-center transition-colors duration-150",
          drag ? "border-accent bg-accent-soft" : "border-border bg-surface-muted/40 hover:border-muted/50",
          error && "border-danger/60",
        )}
      >
        <UploadCloud className="size-8 text-accent" aria-hidden />
        <span className="font-medium">{label}</span>
        <span className="t-small text-muted">
          {hint} <span className="text-accent underline underline-offset-2">Choose a file</span>
        </span>
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept={imageOnly ? "image/*" : accept}
          className="sr-only"
          onChange={(e) => pick(e.target.files)}
        />
      </label>
      {error && (
        <p role="alert" className="t-small text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
