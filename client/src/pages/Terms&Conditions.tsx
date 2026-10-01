import React from "react";
import LegalPageLayout, {
  type LegalSection,
} from "../components/Layouts/LegalPageLayout";

const sections: LegalSection[] = [
  {
    id: "acceptance",
    heading: "Acceptance of Terms",
    body: (
      <p>
        By creating an account or otherwise using the National Generator
        Emission Control Program (NGECP) platform, you agree to be bound by
        these Terms &amp; Conditions. If you are using the platform on behalf of
        an organization, you confirm you have the authority to accept these
        terms on that organization's behalf. If you do not agree to these terms,
        you should not use the platform.
      </p>
    ),
  },
  {
    id: "eligibility-and-accounts",
    heading: "Eligibility and Accounts",
    body: (
      <>
        <p>
          The platform is intended for equipment owners, businesses, field
          inspectors, and authorized regulatory personnel. To use certain
          features, you must register for an account and provide accurate,
          current information.
        </p>
        <ul>
          <li>
            You are responsible for maintaining the confidentiality of your
            login credentials.
          </li>
          <li>
            You are responsible for all activity that occurs under your account.
          </li>
          <li>
            You must notify us promptly of any unauthorized use of your account.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "generator-registration",
    heading: "Generator Registration & Accuracy",
    body: (
      <p>
        Users registering equipment agree to provide accurate information about
        generator specifications, ownership, and location. Knowingly submitting
        false or misleading information may result in suspension of your
        account, invalidation of compliance certificates, and referral to the
        relevant regulatory authority.
      </p>
    ),
  },
  {
    id: "inspections-and-certificates",
    heading: "Inspections and Certificates",
    body: (
      <>
        <p>
          Compliance certificates are issued based on the results of inspections
          carried out by certified field inspectors and recorded on the
          platform. Certificates reflect the status of a generator at the time
          of inspection only, and do not guarantee continued compliance
          thereafter.
        </p>
        <p>
          Owners are responsible for maintaining equipment in a compliant
          condition between inspections and for scheduling re-inspection
          following any repair, modification, or failed test.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    heading: "Acceptable Use",
    body: (
      <>
        <p>When using the platform, you agree not to:</p>
        <ul>
          <li>
            Attempt to gain unauthorized access to any account, system, or data.
          </li>
          <li>
            Interfere with or disrupt the platform's operation or security.
          </li>
          <li>
            Submit fraudulent registration, inspection, or certification
            records.
          </li>
          <li>
            Use the platform for any purpose that violates applicable law.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    heading: "Intellectual Property",
    body: (
      <p>
        The platform, including its software, design, and content, is owned by
        or licensed to NGECP and is protected by applicable intellectual
        property laws. You may not copy, modify, distribute, or create
        derivative works from the platform except as expressly permitted.
      </p>
    ),
  },
  {
    id: "liability",
    heading: "Limitation of Liability",
    body: (
      <p>
        The platform is provided on an "as is" and "as available" basis. To the
        fullest extent permitted by law, NGECP is not liable for indirect,
        incidental, or consequential damages arising from your use of the
        platform, including but not limited to system downtime, data loss, or
        delays in inspection scheduling. Nothing in these terms limits liability
        that cannot be excluded under applicable law.
      </p>
    ),
  },
  {
    id: "suspension-and-termination",
    heading: "Suspension and Termination",
    body: (
      <p>
        We may suspend or terminate access to the platform, in whole or in part,
        where we reasonably believe these terms have been violated, or where
        required by law or regulatory directive. Suspension or termination of
        platform access does not affect any underlying legal obligation to
        maintain emission compliance.
      </p>
    ),
  },
  {
    id: "governing-law",
    heading: "Governing Law",
    body: (
      <p>
        These Terms &amp; Conditions are governed by the laws of the Federal
        Republic of Nigeria. Any disputes arising from use of the platform will
        be subject to the exclusive jurisdiction of the courts of Nigeria.
      </p>
    ),
  },
  {
    id: "changes-to-terms",
    heading: "Changes to These Terms",
    body: (
      <p>
        We may revise these terms from time to time. Continued use of the
        platform after changes take effect constitutes acceptance of the revised
        terms. We encourage you to review this page periodically.
      </p>
    ),
  },
];

const TermsConditions: React.FC = () => (
  <LegalPageLayout
    eyebrow="Legal"
    title="Terms & Conditions"
    description="The rules and conditions that govern your use of the NGECP platform, generator registration, and the inspection and certification process."
    lastUpdated="September 28, 2026"
    sections={sections}
  />
);

export default TermsConditions;
