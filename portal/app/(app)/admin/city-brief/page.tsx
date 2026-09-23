"use client";

import * as React from "react";
import { useDemo, withUndo } from "@/lib/store";
import { REP_CITY } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/blocks";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { Guard } from "@/components/Guard";

export default function CityBriefPage() {
  return (
    <Guard area="city-brief-edit">
      <Editor />
    </Guard>
  );
}

function Editor() {
  const data = useDemo((s) => s.data);
  const updateCityBrief = useDemo((s) => s.updateCityBrief);
  const brief = data.cityBriefs.find((b) => b.city === REP_CITY)!;
  const [intro, setIntro] = React.useState(brief.intro);
  const [good, setGood] = React.useState(brief.good);
  const [bad, setBad] = React.useState(brief.bad);
  const [ugly, setUgly] = React.useState(brief.ugly);

  return (
    <>
      <PageHeader
        label={REP_CITY}
        title="The good, the bad, and the ugly"
        description="Applicants in Zimbabwe read this before they join your city. Be honest — the good sells the place; the bad and ugly stop people arriving unprepared."
      />
      <Card className="flex max-w-2xl flex-col gap-4 p-5">
        <p className="t-small text-muted">Last updated {formatDate(brief.updatedAt)} by {brief.updatedBy}</p>
        <Field label="Short intro" required>
          <Textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={2} />
        </Field>
        <Field label="The good" required hint="What works well for Zimbabwean students here.">
          <Textarea value={good} onChange={(e) => setGood(e.target.value)} rows={5} />
        </Field>
        <Field label="The bad" required hint="Friction, cost, language, bureaucracy — the daily grind.">
          <Textarea value={bad} onChange={(e) => setBad(e.target.value)} rows={5} />
        </Field>
        <Field label="The ugly" required hint="Risks and hard truths. Do not soften this for applicants.">
          <Textarea value={ugly} onChange={(e) => setUgly(e.target.value)} rows={5} />
        </Field>
        <Button
          variant="primary"
          onClick={() =>
            withUndo("City brief saved.", () => updateCityBrief(REP_CITY, { intro, good, bad, ugly }))
          }
        >
          Save brief
        </Button>
      </Card>
    </>
  );
}
