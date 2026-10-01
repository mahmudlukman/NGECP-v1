import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export interface LegalSection {
  id: string;
  heading: string;
  body: React.ReactNode;
}

interface LegalPageLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  eyebrow,
  title,
  description,
  lastUpdated,
  sections,
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F7F6F1] font-[Figtree,ui-sans-serif,system-ui,sans-serif] text-[#0B1F1A]">
      {/* Header */}
      <section className="relative overflow-hidden bg-[#0B1F1A] px-4 py-20 text-[#F3F1EA] sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.3] [background-image:radial-gradient(rgba(243,241,234,0.5)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(127,209,174,0.14),transparent)]"
        />

        <div className="relative mx-auto max-w-3xl">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-1.5 text-xs font-medium text-[#F3F1EA]/60 transition-colors hover:text-[#F3F1EA]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>

          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-[#7FD1AE]/50" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7FD1AE]">
              {eyebrow}
            </span>
          </div>

          <h1 className="font-[Newsreader,Georgia,serif] text-4xl font-normal leading-[1.1] tracking-tight sm:text-5xl">
            {title}
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#F3F1EA]/70 sm:text-base">
            {description}
          </p>

          <p className="mt-6 text-xs uppercase tracking-wider text-[#F3F1EA]/45">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Table of contents */}
          <nav aria-label="Table of contents" className="lg:col-span-4">
            <div className="rounded-2xl border border-[#0B1F1A]/10 bg-white p-6 shadow-[0_20px_40px_-30px_rgba(11,31,26,0.25)] lg:sticky lg:top-28">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#16785A]">
                On this page
              </p>
              <ul className="space-y-2.5 text-sm">
                {sections.map((section, idx) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex items-start gap-2.5 text-[#0B1F1A]/60 transition-colors hover:text-[#16785A]"
                    >
                      <span className="font-[Newsreader,Georgia,serif] text-[#0B1F1A]/30 tabular-nums">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span>{section.heading}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Sections */}
          <div className="lg:col-span-8">
            <div className="divide-y divide-[#0B1F1A]/10 rounded-2xl border border-[#0B1F1A]/10 bg-white shadow-[0_20px_40px_-30px_rgba(11,31,26,0.25)]">
              {sections.map((section, idx) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 p-8 sm:p-10"
                >
                  <div className="mb-4 flex items-baseline gap-3">
                    <span className="font-[Newsreader,Georgia,serif] text-lg text-[#16785A] tabular-nums">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-[Newsreader,Georgia,serif] text-xl font-normal tracking-tight sm:text-2xl">
                      {section.heading}
                    </h2>
                  </div>
                  <div className="space-y-4 text-sm leading-relaxed text-[#0B1F1A]/70 sm:text-[15px] [&_a]:text-[#16785A] [&_a]:underline [&_a]:underline-offset-2 [&_li]:pl-1 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_strong]:font-semibold [&_strong]:text-[#0B1F1A] [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                    {section.body}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div className="mt-8 rounded-2xl border border-[#16785A]/20 bg-[#16785A]/[0.05] p-6 text-sm leading-relaxed text-[#0B1F1A]/70">
              Questions about this policy? Reach our compliance team at{" "}
              <a
                href="mailto:support@emissioncontrol.gov.ng"
                className="font-medium text-[#16785A] underline underline-offset-2"
              >
                support@emissioncontrol.gov.ng
              </a>{" "}
              or visit our{" "}
              <Link
                to="/contact"
                className="font-medium text-[#16785A] underline underline-offset-2"
              >
                Contact page
              </Link>
              .
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalPageLayout;
