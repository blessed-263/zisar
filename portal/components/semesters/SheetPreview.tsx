"use client";

import * as React from "react";
import { ArrowClockwise as RotateCw, MagnifyingGlassPlus as ZoomIn, MagnifyingGlassMinus as ZoomOut } from "@phosphor-icons/react";
import type { Student, Submission, University } from "@/lib/types";
import { Button } from "@/components/ui/button";

const SUBJECTS = [
  "Mathematical analysis",
  "Russian as a foreign language",
  "Physics",
  "Programming fundamentals",
  "History of Russia",
  "Physical education",
];

/** A drawn stand-in for the scanned sheet. No real document is stored in the demo. */
export function SheetPreview({
  student,
  university,
  sub,
  windowName,
  fileName,
}: {
  student: Student;
  university?: University;
  sub: Submission;
  windowName: string;
  fileName?: string;
}) {
  const [zoom, setZoom] = React.useState(1);
  const [rot, setRot] = React.useState(0);
  const arrears = new Set(sub.arrears.map((a) => a.subject.toLowerCase()));
  const rows = [...SUBJECTS.slice(0, 6 - sub.arrears.length), ...sub.arrears.map((a) => a.subject)];
  const mark = (subject: string, i: number) => {
    if (arrears.has(subject.toLowerCase())) return sub.arrears.find((a) => a.subject === subject)?.mark || "неуд.";
    if (sub.outcome === "unsatisfactory" && i < 3) return "неуд.";
    return ["отлично", "хорошо", "зачтено", "отлично", "хорошо", "зачтено"][i % 6];
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[12px] border border-border bg-surface-muted">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2">
        <span className="t-small truncate font-mono text-muted">{fileName ?? "result-sheet.pdf"}</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(1)))}>
            <ZoomOut className="size-4" aria-hidden />
          </Button>
          <span className="tabular t-small w-10 text-center text-muted">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon-sm" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(2, +(z + 0.2).toFixed(1)))}>
            <ZoomIn className="size-4" aria-hidden />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Rotate" onClick={() => setRot((r) => (r + 90) % 360)}>
            <RotateCw className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
      <div className="flex flex-1 items-start justify-center overflow-auto p-4 md:p-6">
        <div
          className="w-full max-w-[520px] origin-top bg-white p-6 text-[12px] leading-5 text-[#1f2937] shadow-md transition-transform duration-200"
          style={{ transform: `scale(${zoom}) rotate(${rot}deg)` }}
          role="img"
          aria-label={`Mock result sheet for ${student.firstNames} ${student.surname}, ${windowName}`}
        >
          <p className="text-center text-[10px] tracking-wide text-[#6b7280] uppercase">Министерство науки и высшего образования РФ</p>
          <p className="mt-1 text-center font-semibold">{university?.nameRu ?? university?.name}</p>
          <p className="mt-3 text-center text-[14px] font-bold">Справка об успеваемости</p>
          <p className="text-center text-[11px] text-[#6b7280]">Academic record · {windowName}</p>
          <div className="mt-4 grid grid-cols-[110px_1fr] gap-y-0.5">
            <span className="text-[#6b7280]">Студент</span>
            <span className="font-medium">
              {student.surname.toUpperCase()} {student.firstNames}
            </span>
            <span className="text-[#6b7280]">Номер</span>
            <span>{student.studies.studentNumber}</span>
            <span className="text-[#6b7280]">Программа</span>
            <span>{student.studies.programme}</span>
          </div>
          <table className="mt-4 w-full border-collapse">
            <thead>
              <tr className="border-y border-[#d1d5db] text-left">
                <th className="py-1 font-semibold">Дисциплина</th>
                <th className="py-1 text-right font-semibold">Оценка</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const m = mark(r, i);
                return (
                  <tr key={r + i} className="border-b border-[#e5e7eb]">
                    <td className="py-1">{r}</td>
                    <td className={`py-1 text-right ${m.startsWith("неуд") ? "font-semibold text-[#b91c1c]" : ""}`}>{m}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-6 flex items-end justify-between">
            <span className="text-[#6b7280]">Декан ____________</span>
            <span className="grid size-16 place-items-center rounded-full border-2 border-[#2563eb]/50 text-center text-[8px] leading-3 text-[#2563eb]/70">
              ПЕЧАТЬ
              <br />
              деканат
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
