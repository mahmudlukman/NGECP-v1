import React from "react";
import LegalPageLayout, {
  type LegalSection,
} from "../components/Layouts/LegalPageLayout";

const sections: LegalSection[] = [
  {
    id: "overview",
    heading: "Overview",
    body: (
      <p>
        NGECP publishes aggregate compliance statistics and inspection summaries
        to support transparency and public accountability. This page explains
        what is reported, how figures are calculated, and how the underlying
        data is safeguarded. It does not itself contain live statistics; current
        figures are available through the <a href="/">portal dashboard</a> for
        authorized users.
      </p>
    ),
  },
  {
    id: "what-we-report",
    heading: "What We Report",
    body: (
      <>
        <p>Reporting on the platform generally falls into three categories:</p>
        <ul>
          <li>
            <strong>Registry statistics</strong>: the number of registered
            generators by category, region, and status.
          </li>
          <li>
            <strong>Inspection activity</strong>: inspections conducted, pass
            and fail rates, and average time between scheduled and completed
            inspections.
          </li>
          <li>
            <strong>Compliance trends</strong>: emission and acoustic test
            results aggregated over time, used to track improvement against
            national environmental targets.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "methodology",
    heading: "Methodology",
    body: (
      <p>
        Reports are generated directly from inspection records submitted by
        certified field inspectors through the platform. Figures are
        recalculated on a rolling basis as new inspections are logged. Where a
        reading is disputed or a re-inspection is pending, the original result
        remains reflected in historical reports until the review is resolved, to
        preserve an accurate audit trail.
      </p>
    ),
  },
  {
    id: "data-anonymization",
    heading: "Aggregation and Anonymization",
    body: (
      <p>
        Publicly referenced statistics are aggregated and do not identify
        individual generator owners. Reports made available to regulatory bodies
        for oversight purposes may include equipment-level detail, consistent
        with their statutory compliance functions and subject to the safeguards
        described in our <a href="/data-protection">Data Protection</a> page.
      </p>
    ),
  },
  {
    id: "access-levels",
    heading: "Access Levels",
    body: (
      <>
        <p>Access to reporting features depends on your account role:</p>
        <ul>
          <li>
            Equipment owners can view the compliance history and reports for
            their own registered generators.
          </li>
          <li>
            Inspectors can view reports for generators within their assigned
            territory.
          </li>
          <li>
            Administrators and regulatory reviewers can access national and
            regional aggregate reporting.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "accuracy-and-limitations",
    heading: "Accuracy and Limitations",
    body: (
      <p>
        Reports reflect data as submitted at the time of inspection and are
        provided for informational and regulatory purposes. While we apply
        validation checks to inspection submissions, figures may be revised as
        corrections, re-inspections, or appeals are processed. Reports should
        not be treated as a real-time guarantee of a specific generator's
        compliance status outside of its most recent inspection date.
      </p>
    ),
  },
  {
    id: "requesting-a-report",
    heading: "Requesting a Custom Report",
    body: (
      <p>
        Regulatory bodies, researchers, and partner organizations may request
        custom aggregate reports beyond what is available on the standard
        dashboard by contacting our compliance team. Requests are reviewed to
        ensure they are consistent with our data protection obligations before
        being fulfilled.
      </p>
    ),
  },
];

const ReportsAnalysis: React.FC = () => (
  <LegalPageLayout
    eyebrow="Transparency"
    title="Reports & Analysis"
    description="How NGECP compiles, safeguards, and shares compliance statistics and inspection reporting across the national registry."
    lastUpdated="September 28, 2026"
    sections={sections}
  />
);

export default ReportsAnalysis;
