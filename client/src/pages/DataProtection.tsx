import React from "react";
import LegalPageLayout, {
  type LegalSection,
} from "../components/Layouts/LegalPageLayout";

const sections: LegalSection[] = [
  {
    id: "our-approach",
    heading: "Our Approach to Data Protection",
    body: (
      <p>
        Data protection is treated as a core operating requirement of the
        National Generator Emission Control Program (NGECP), not an
        afterthought. This page explains the technical and organizational
        measures we apply to the registration, inspection, and compliance data
        processed through the platform, in addition to the commitments set out
        in our <a href="/privacy-policy">Privacy Policy</a>.
      </p>
    ),
  },
  {
    id: "legal-basis",
    heading: "Legal Basis for Processing",
    body: (
      <>
        <p>We process personal and equipment data on the following bases:</p>
        <ul>
          <li>
            <strong>Legal obligation</strong>: registration and inspection data
            is processed to meet statutory emission compliance requirements.
          </li>
          <li>
            <strong>Contract</strong>: account information is processed to
            provide the services you register for.
          </li>
          <li>
            <strong>Legitimate interest</strong>: platform activity is monitored
            to maintain security and prevent fraud.
          </li>
          <li>
            <strong>Consent</strong>: where you opt in to optional
            communications, such as the newsletter.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "data-classification",
    heading: "Data Classification and Access Control",
    body: (
      <>
        <p>
          Data on the platform is classified by sensitivity, and access is
          restricted according to role:
        </p>
        <ul>
          <li>
            Field inspectors can access records for generators assigned to them
            for inspection, and cannot view unrelated accounts.
          </li>
          <li>
            Administrators and regulatory reviewers access data on a
            need-to-know basis, governed by internal access policies.
          </li>
          <li>
            Equipment owners can view and manage only their own registered
            generators and inspection history.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "technical-safeguards",
    heading: "Technical Safeguards",
    body: (
      <>
        <p>The platform applies the following technical safeguards:</p>
        <ul>
          <li>
            Encryption of data in transit between your device and our servers.
          </li>
          <li>Encryption of sensitive data at rest.</li>
          <li>
            Role-based access controls and audit logging of record access and
            changes.
          </li>
          <li>
            Regular security review of infrastructure supporting the platform.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "international-transfers",
    heading: "Data Storage and Transfers",
    body: (
      <p>
        Platform data is hosted primarily within infrastructure that supports
        the program's operational and regulatory requirements. Where a service
        provider processes data outside Nigeria, we require contractual
        safeguards consistent with applicable data protection law before any
        such transfer takes place.
      </p>
    ),
  },
  {
    id: "breach-notification",
    heading: "Breach Notification",
    body: (
      <p>
        In the event of a data breach that poses a risk to your rights or
        interests, we will notify affected users and the relevant regulatory
        authority without undue delay, and in line with applicable legal
        timeframes, along with guidance on steps you can take to protect
        yourself.
      </p>
    ),
  },
  {
    id: "data-protection-officer",
    heading: "Data Protection Contact",
    body: (
      <p>
        Questions, concerns, or requests relating to data protection can be
        directed to our data protection contact using the details at the bottom
        of this page. We aim to acknowledge all data protection inquiries within
        a reasonable timeframe.
      </p>
    ),
  },
];

const DataProtection: React.FC = () => (
  <LegalPageLayout
    eyebrow="Legal"
    title="Data Protection"
    description="The technical and organizational measures NGECP applies to safeguard registration, inspection, and compliance data."
    lastUpdated="September 28, 2026"
    sections={sections}
  />
);

export default DataProtection;
