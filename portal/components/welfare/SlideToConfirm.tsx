"use client";

import * as React from "react";
import { CaretDoubleRight as ChevronsRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Drag the handle to the end (or press End / ArrowRight with a keyboard) to confirm. Prevents a pocket tap. */
export function SlideToConfirm({ label, onConfirm, disabled }: { label: string; onConfirm: () => void; disabled?: boolean }) {
  const track = React.useRef<HTMLDivElement>(null);
  const [pct, setPct] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const done = React.useRef(false);
  const KNOB = 56;

  function finish(value: number) {
    if (done.current) return;
    if (value >= 100) {
      done.current = true;
      setPct(100);
      onConfirm();
    } else {
      setPct(0);
    }
  }

  function fromPointer(clientX: number) {
    const r = track.current?.getBoundingClientRect();
    if (!r) return 0;
    const usable = r.width - KNOB - 8;
    return Math.max(0, Math.min(100, ((clientX - r.left - KNOB / 2 - 4) / usable) * 100));
  }

  return (
    <div
      ref={track}
      className={cn(
        "relative h-16 w-full touch-none select-none overflow-hidden rounded-full bg-danger-soft",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <div className="absolute inset-y-0 left-0 rounded-full bg-danger/20" style={{ width: `calc(${KNOB + 8}px + (100% - ${KNOB + 8}px) * ${pct / 100})` }} aria-hidden />
      <span className="pointer-events-none absolute inset-0 grid place-items-center pl-12 text-[15px] font-semibold text-danger" aria-hidden>
        {label}
      </span>
      <button
        type="button"
        role="slider"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-valuetext={pct >= 100 ? "Sent" : "Slide right to send"}
        className={cn(
          "absolute top-1 grid size-14 place-items-center rounded-full bg-danger text-white shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger",
          !dragging && "transition-[left] duration-200 ease-[var(--ease)]",
        )}
        style={{ left: `calc(4px + (100% - ${KNOB + 8}px) * ${pct / 100})` }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
        }}
        onPointerMove={(e) => dragging && setPct(fromPointer(e.clientX))}
        onPointerUp={(e) => {
          setDragging(false);
          finish(fromPointer(e.clientX));
        }}
        onPointerCancel={() => {
          setDragging(false);
          setPct(0);
        }}
        onKeyDown={(e) => {
          if (e.key === "End") {
            e.preventDefault();
            finish(100);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            const v = Math.min(100, pct + 25);
            setPct(v);
            if (v >= 100) finish(100);
          } else if (e.key === "ArrowLeft" || e.key === "Home") {
            e.preventDefault();
            setPct(0);
          }
        }}
      >
        <ChevronsRight className="size-6" aria-hidden />
      </button>
    </div>
  );
}
