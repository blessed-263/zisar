"use client";

import { Guard } from "@/components/Guard";
import { EnquiryThread } from "@/components/regions/EnquiryThread";

export default function RepEnquiryPage() {
  return (
    <Guard area="enquiries-rep">
      <EnquiryThread forRep />
    </Guard>
  );
}
