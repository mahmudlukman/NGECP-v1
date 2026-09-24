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
    <section className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <HelpCircle className="w-3.5 h-3.5" /> FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm">
            Find answers to common questions about generator registration, field
            inspections, and emission standards.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? "border-emerald-300 bg-emerald-50/30"
                    : "border-slate-200/80 bg-slate-50/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-800">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
