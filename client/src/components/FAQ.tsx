import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { faqs } from "../utils/data";
import Title from "./Title";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-20 px-6 md:px-16">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <Title
          visibleButton={false}
          title="Frequently Asked Questions"
          description="Everything you need to know about using the platform — from
          registration to compliance."
        />
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left px-6 py-4 font-medium text-slate-800 hover:bg-slate-50 transition"
            >
              <span>{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="text-primary" size={20} />
              ) : (
                <ChevronDown className="text-slate-500" size={20} />
              )}
            </button>

            {openIndex === index && (
              <div className="px-6 pb-5 text-slate-600 border-t border-slate-100 text-sm md:text-base">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
