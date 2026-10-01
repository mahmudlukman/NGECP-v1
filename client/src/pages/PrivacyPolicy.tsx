import React from "react";
import LegalPageLayout, {
  type LegalSection,
} from "../components/Layouts/LegalPageLayout";

const sections: LegalSection[] = [
  {
    id: "information-we-collect",
    heading: "Information We Collect",
    body: (
      <>
        <p>
          The National Generator Emission Control Program (NGECP) collects
          information necessary to register equipment, schedule inspections, and
          verify compliance. This includes:
        </p>
        <ul>
          <li>
            <strong>Account information</strong>: name, email address, phone
            number, and organization or company name.
          </li>
          <li>
            <strong>Equipment records</strong>: generator make, model, capacity,
            serial number, and installation location.
          </li>
          <li>
            <strong>Inspection data</strong>: emission readings, acoustic
            measurements, inspector notes, and photographic or QR verification
            records captured during field audits.
          </li>
          <li>
            <strong>Usage information</strong>: log-in activity and platform
            interactions, collected to secure accounts and improve the service.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    heading: "How We Use Information",
    body: (
      <>
        <p>Information collected through the platform is used to:</p>
        <ul>
          <li>
            Process generator registrations and maintain the national registry.
          </li>
          <li>Schedule, conduct, and record compliance inspections.</li>
          <li>
            Issue digital compliance certificates and non-compliance reports.
          </li>
          <li>Send automated reminders ahead of inspection due dates.</li>
          <li>
            Compile aggregate statistics for regulatory reporting and policy
            planning.
          </li>
        </ul>
        <p>
          We do not use the information you provide for advertising, and we do
          not sell personal data to third parties.
        </p>
      </>
    ),
  },
  {
    id: "sharing-and-disclosure",
    heading: "Sharing and Disclosure",
    body: (
      <>
        <p>
          Information may be shared in limited circumstances, and only as
          necessary to operate the program:
        </p>
        <ul>
          <li>
            With certified field inspectors, to carry out scheduled or requested
            inspections.
          </li>
          <li>
            With relevant federal or state regulatory bodies, where required for
            compliance oversight.
          </li>
          <li>
            With service providers who support the platform's technical
            infrastructure, under confidentiality obligations.
          </li>
          <li>
            Where disclosure is required by law, court order, or a lawful
            request from a government authority.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "data-retention",
    heading: "Data Retention",
    body: (
      <p>
        Registration and inspection records are retained for as long as the
        associated generator remains active on the registry, and for a further
        period afterward as required for regulatory audit trails. Account
        information is retained while your account remains active. You may
        request deletion of your account information at any time, subject to
        retention obligations under applicable law.
      </p>
    ),
  },
  {
    id: "your-rights",
    heading: "Your Rights",
    body: (
      <>
        <p>Subject to applicable law, you may:</p>
        <ul>
          <li>Request a copy of the personal information we hold about you.</li>
          <li>Request correction of inaccurate or incomplete information.</li>
          <li>
            Request deletion of your account information, subject to retention
            obligations.
          </li>
          <li>
            Object to certain uses of your information, or withdraw consent
            where processing is based on consent.
          </li>
        </ul>
        <p>
          To exercise any of these rights, contact us using the details at the
          bottom of this page.
        </p>
      </>
    ),
  },
  {
    id: "security",
    heading: "Data Security",
    body: (
      <p>
        We apply administrative, technical, and physical safeguards designed to
        protect information against unauthorized access, alteration, or loss,
        including encrypted data transmission, access controls for inspector and
        administrator accounts, and regular review of our security practices. No
        system is completely secure, and we encourage users to protect their
        account credentials and report any suspected unauthorized access
        immediately.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes to This Policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time to reflect changes
        in our practices or legal requirements. Material changes will be
        indicated by updating the "Last updated" date at the top of this page,
        and, where appropriate, communicated directly to registered users.
      </p>
    ),
  },
];

const PrivacyPolicy: React.FC = () => (
  <LegalPageLayout
    eyebrow="Legal"
    title="Privacy Policy"
    description="How the National Generator Emission Control Program collects, uses, and protects information submitted through this platform."
    lastUpdated="September 28, 2026"
    sections={sections}
  />
);

export default PrivacyPolicy;
