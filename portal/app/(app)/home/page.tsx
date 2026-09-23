"use client";

import { useDemo } from "@/lib/store";
import { StudentHome } from "@/components/home/StudentHome";
import { AppealsHome, ApplicantHome, CoordinatorHome, OfficerHome, RepHome, VerifierHome, WelfareHome } from "@/components/home/AdminHomes";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";

export default function HomePage() {
  const role = useDemo((s) => s.role);
  switch (role) {
    case "student":
      return <StudentHome />;
    case "applicant":
      return <ApplicantHome />;
    case "rep":
      return <RepHome />;
    case "verifier":
      return <VerifierHome />;
    case "appeals":
      return <AppealsHome />;
    case "welfare":
      return <WelfareHome />;
    case "coordinator":
      return <CoordinatorHome />;
    case "executive":
      return <AnalyticsDashboard />;
    case "officer":
      return <OfficerHome />;
  }
}
