"use client";

import { Guard } from "@/components/Guard";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";

export default function AnalyticsPage() {
  return (
    <Guard area="stats">
      <AnalyticsDashboard />
    </Guard>
  );
}
