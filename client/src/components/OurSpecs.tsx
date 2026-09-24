import React from "react";
import { ShieldCheck, FileCheck, BellRing, Smartphone } from "lucide-react";

const OurSpecs: React.FC = () => {
  const specs = [
    {
      icon: ShieldCheck,
      title: "Emission Compliance",
      description:
        "Comprehensive testing protocols measuring CO2, sound decibels, and particulate thresholds.",
    },
    {
      icon: FileCheck,
      title: "Digital Certification",
      description:
        "Instantly generated digital reports and downloadable compliance certificates upon passing inspections.",
    },
    {
      icon: BellRing,
      title: "Automated Reminders",
      description:
        "Proactive automated notifications before inspection due dates to ensure continuous compliance.",
    },
    {
      icon: Smartphone,
      title: "Mobile Field Inspection",
      description:
        "Optimized mobile portal for inspectors to log technical generator specs directly on-site.",
    },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
            Core Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Engineered for Precision & Convenience
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Everything required to manage equipment registration, schedule field
            audits, and monitor emission benchmarks.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specs.map((spec, index) => {
            const Icon = spec.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition-all hover:shadow-xs group"
              >
                <div className="w-12 h-12 bg-slate-100 group-hover:bg-emerald-600 text-slate-700 group-hover:text-white rounded-xl flex items-center justify-center mb-5 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {spec.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {spec.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurSpecs;
