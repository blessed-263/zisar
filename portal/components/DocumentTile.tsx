import Link from "next/link";
import { type Icon, AddressBook as BookUser, CreditCard, Certificate as FileBadge, File as FileCheck2, FileText, Heartbeat as HeartPulse, IdentificationCard as IdCard, Buildings as Landmark, MapPin, Airplane as Plane, Scroll as ScrollText, ShieldPlus, Stamp } from "@phosphor-icons/react";
import type { DocType, DocumentVersion } from "@/lib/types";
import { docLabel } from "@/lib/constants";
import { expiryState } from "@/lib/selectors";
import { cn, formatDate, relativeDays } from "@/lib/utils";
import { StatusPill } from "./StatusPill";

export const DOC_ICONS: Record<DocType, Icon> = {
  passport: BookUser,
  "national-id": IdCard,
  "birth-certificate": ScrollText,
  visa: Stamp,
  "migration-card": Plane,
  registration: MapPin,
  "student-card": CreditCard,
  enrolment: Landmark,
  insurance: ShieldPlus,
  medical: HeartPulse,
  "green-card": FileBadge,
  "school-results": FileCheck2,
  "prior-degree": FileText,
  "degree-certificate": FileText,
};

export function DocumentTile({
  type,
  versions,
  current,
  required,
}: {
  type: DocType;
  versions: DocumentVersion[];
  current?: DocumentVersion;
  required?: boolean;
}) {
  const Icon = DOC_ICONS[type];
  const latest = versions[0];
  const exp = expiryState(current?.expires);
  const missing = !latest;
  return (
    <Link
      href={`/documents/${type}`}
      className={cn(
        "flex flex-col gap-3 rounded-[12px] border bg-surface p-4 transition-colors duration-150 hover:border-muted/40",
        missing ? "border-dashed border-border" : "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="grid size-10 place-items-center rounded-[10px] bg-accent-soft text-accent">
          <Icon className="size-5" aria-hidden />
        </span>
        {missing ? (
          required ? (
            <StatusPill status="overdue" label="Missing" size="sm" />
          ) : (
            <StatusPill status="not-started" label="Not uploaded" size="sm" />
          )
        ) : exp === "expired" ? (
          <StatusPill status="expired" size="sm" />
        ) : latest.status !== "verified" ? (
          <StatusPill status={latest.status} size="sm" />
        ) : exp === "expiring" ? (
          <StatusPill status="expiring" size="sm" />
        ) : (
          <StatusPill status="verified" size="sm" />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-medium leading-6">{docLabel(type)}</span>
        <span className="t-small text-muted">
          {missing
            ? required
              ? "Required. Upload it now."
              : "Upload when you have it"
            : current?.expires
              ? `Expires ${formatDate(current.expires)} · ${relativeDays(current.expires)}`
              : "No expiry"}
        </span>
      </div>
      {!missing && (
        <span className="t-small text-muted">
          {versions.length} {versions.length === 1 ? "version" : "versions"}
        </span>
      )}
    </Link>
  );
}
