import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do I register a generator on the platform?",
      answer:
        "You can register your generator by logging into your account, navigating to 'Generators', and clicking 'Add New Generator'. Simply fill in the brand, capacity, location, and owner details.",
    },
    {
      question: "How frequently are compliance inspections required?",
      answer:
        "Inspections are scheduled based on the generator's capacity and usage category. Typically, commercial units require annual evaluations, while smaller residential units are inspected bi-annually.",
    },
    {
      question: "What happens if my generator fails an emission test?",
      answer:
        "If a unit fails, a non-compliance report will detail the specific issues (e.g., high smoke density or decibels). You will be given a grace period to service the generator and request a re-inspection.",
    },
    {
      question: "Can inspectors issue certificates directly on-site?",
      answer:
        "Yes, once an inspector completes and approves an inspection report on their field portal, an official compliance certificate is instantly generated for the owner.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative overflow-hidden border-t border-[#0B1F1A]/10 bg-white py-20 font-[Figtree,ui-sans-serif,system-ui,sans-serif] text-[#0B1F1A] sm:py-28">
      {/* Faint dot texture, fading toward the bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.3] [background-image:radial-gradient(#0B1F1A_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)]"
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#16785A]" />
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#16785A]">
              <HelpCircle className="h-3.5 w-3.5" />
              FAQ
            </span>
            <span className="h-px w-10 bg-[#16785A]" />
          </div>

          <h2 className="font-[Newsreader,Georgia,serif] text-3xl font-normal tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#0B1F1A]/65">
            Find answers to common questions about generator registration, field
            inspections, and emission standards.
          </p>
        </div>

        <div className="divide-y divide-[#0B1F1A]/10 rounded-3xl border border-[#0B1F1A]/10 bg-white shadow-[0_20px_50px_-30px_rgba(11,31,26,0.25)]">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="relative">
                {/* Left accent bar when open */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 h-full w-0.5 bg-[#16785A] transition-opacity ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-[#16785A]/[0.03] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#16785A] sm:px-8"
                >
                  <span className="flex items-baseline gap-4">
                    <span
                      className={`font-[Newsreader,Georgia,serif] text-sm tabular-nums transition-colors ${
                        isOpen ? "text-[#16785A]" : "text-[#0B1F1A]/35"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold text-[#0B1F1A] sm:text-base">
                      {faq.question}
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-[#0B1F1A]/40 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#16785A]" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 pl-[3.75rem] text-sm leading-relaxed text-[#0B1F1A]/65 sm:px-8 sm:pl-[4.25rem]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
