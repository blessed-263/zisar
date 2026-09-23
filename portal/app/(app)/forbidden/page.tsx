"use client";

import { useSearchParams } from "next/navigation";
import { RULES, type Area } from "@/lib/permissions";
import { Forbidden } from "@/components/Guard";

export default function ForbiddenPage() {
  const area = useSearchParams().get("area") as Area | null;
  return <Forbidden rule={(area && RULES[area]?.rule) || "This page is not part of your role."} />;
}
