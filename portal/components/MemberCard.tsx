import { Envelope as Mail, UserMinus as UserX } from "@phosphor-icons/react";
import type { CommitteeSeat, University } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

export function MemberCard({
  seat,
  university,
  large,
  action,
}: {
  seat: CommitteeSeat;
  university?: University;
  large?: boolean;
  action?: React.ReactNode;
}) {
  const vacant = !seat.name;
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-[14px] border bg-surface shadow-[var(--shadow-card)] transition-[border-color,box-shadow,transform] duration-250 ease-[var(--ease)]",
        vacant ? "border-dashed border-muted/50" : "border-border hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)]",
      )}
    >
      <div className={cn("photo-frame relative aspect-[4/5] bg-surface-muted", large && "sm:aspect-[4/4]")}>
        {vacant ? (
          <div className="grid size-full place-items-center text-muted">
            <UserX className="size-10" aria-hidden />
          </div>
        ) : (
          <img
            src={seat.photo ?? "/placeholders/person-m1.png"}
            alt=""
            className="size-full object-cover transition-transform duration-500 ease-[var(--ease)] group-hover:scale-[1.03]"
          />
        )}
        {seat.isSample && !vacant && (
          <span className="absolute right-2 bottom-2 rounded-full bg-surface/95 px-2 py-0.5 text-[11px] font-medium text-muted shadow-sm backdrop-blur">
            Sample, to be entered by executive
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <span className="t-label flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-gold" aria-hidden />
          {seat.office}
        </span>
        <h3 className={cn("font-display font-medium tracking-[-0.02em]", large ? "text-[20px] leading-7" : "text-[16px] leading-6")}>
          {vacant ? "Vacant" : seat.name}
        </h3>
        {!vacant && (
          <p className="t-small text-muted">
            {university?.name ?? seat.city}
            {seat.city && university ? ` · ${seat.city}` : ""}
          </p>
        )}
        {!vacant && seat.termStart && (
          <p className="t-small text-muted">
            Term {formatDate(seat.termStart)} to {formatDate(seat.termEnd)}
          </p>
        )}
        {large && <p className="t-small mt-1">{seat.note}</p>}
        <a
          href={`mailto:${seat.contact}`}
          className="t-small mt-auto flex items-center gap-1.5 pt-2 text-accent hover:underline"
        >
          <Mail className="size-3.5" aria-hidden />
          {seat.contact}
        </a>
        {action}
      </div>
    </article>
  );
}
