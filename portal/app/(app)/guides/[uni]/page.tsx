"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { BookOpen, PencilSimple as Pencil } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { COORDINATOR_UNIVERSITY } from "@/lib/constants";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/blocks";
import { EmptyState } from "@/components/EmptyState";

export default function GuidePage() {
  const { uni } = useParams<{ uni: string }>();
  const data = useDemo((s) => s.data);
  const role = useDemo((s) => s.role);
  const u = data.universities.find((x) => x.id === uni);
  const g = data.guides.find((x) => x.universityId === uni);
  if (!u) return <EmptyState icon={BookOpen} title="This university was not found." />;
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/guides", label: "University guides" }]}
        label={u.city}
        title={u.name}
        description={`${u.nameRu}${g ? ` · updated ${formatDate(g.updatedAt)} by ${g.updatedBy}` : ""}`}
        actions={
          role === "coordinator" && uni === COORDINATOR_UNIVERSITY ? (
            <Button asChild variant="secondary" size="sm">
              <Link href="/admin/coordinator/guide">
                <Pencil className="size-4" aria-hidden />
                Edit guide
              </Link>
            </Button>
          ) : undefined
        }
      />
      {g && g.sections.length ? (
        <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
          <nav aria-label="Sections" className="hidden lg:block">
            <ol className="sticky top-20 flex flex-col gap-1 text-[14px]">
              {g.sections.map((s, i) => (
                <li key={i}>
                  <a href={`#s-${i}`} className="block rounded-[8px] px-3 py-1.5 text-muted hover:bg-surface-muted hover:text-text">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="flex max-w-[68ch] flex-col gap-4">
            {g.sections.map((s, i) => (
              <Card key={i} id={`s-${i}`} className="scroll-mt-20">
                <CardBody>
                  <h2 className="t-title mb-2 text-[18px]">{s.title}</h2>
                  <p className="whitespace-pre-line text-[15px] leading-7">{s.body}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState icon={BookOpen} title="The coordinator has not written this guide yet." />
      )}
    </>
  );
}
