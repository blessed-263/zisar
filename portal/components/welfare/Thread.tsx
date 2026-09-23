"use client";

import * as React from "react";
import { PaperPlaneTilt as Send } from "@phosphor-icons/react";
import type { HelpRequest } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";

export function Thread({ request, mine, onReply, closed }: { request: HelpRequest; mine: "student" | "officer"; onReply: (text: string) => void; closed?: boolean }) {
  const [text, setText] = React.useState("");
  return (
    <div className="flex flex-col gap-4">
      <ol className="flex flex-col gap-3" aria-label="Messages">
        {request.messages.map((m, i) => {
          const own = (mine === "student") === m.fromStudent;
          return (
            <li key={i} className={cn("flex max-w-[85%] flex-col gap-1", own ? "self-end items-end" : "self-start")}>
              <div className={cn("rounded-[14px] px-4 py-2.5 text-[15px] leading-6", own ? "rounded-br-[4px] bg-accent text-accent-contrast" : "rounded-bl-[4px] bg-surface-muted")}>
                {m.text}
              </div>
              <span className="t-small text-muted">
                {m.by} · {formatDateTime(m.at)}
              </span>
            </li>
          );
        })}
      </ol>
      {closed ? (
        <p className="t-small text-center text-muted">This request is closed.</p>
      ) : (
        <form
          className="flex flex-col gap-2 border-t border-border pt-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            onReply(text.trim());
            setText("");
          }}
        >
          <label htmlFor="reply" className="sr-only">
            Reply
          </label>
          <Textarea id="reply" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a reply" rows={3} />
          <Button type="submit" variant="primary" className="self-end" disabled={!text.trim()}>
            <Send className="size-4" aria-hidden />
            Send
          </Button>
        </form>
      )}
    </div>
  );
}
