import React from "react";
import { Cpu, Check } from "lucide-react";

const AboutSection: React.FC = () => {
  const highlights = [
    "Instant emission level checks and diagnostic reports.",
    "Automated SMS/Email inspection schedules and alerts.",
    "Centralized registry for commercial and residential generators.",
    "Transparent scoring system for federal and state compliance.",
  ];

  return (
    <section className="py-20 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side: Impact Visual Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/80 space-y-6">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold shadow-xs">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Smart Monitoring Infrastructure
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Replacing traditional manual paper auditing with instant data
                extraction, QR verification, and real-time inspector feedback
                loops.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-emerald-50/60 rounded-xl border border-emerald-200/60 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                  100%
                </p>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  Audit Traceability
                </p>
              </div>
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                  24/7
                </p>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  Status Verification
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
              Why It Matters
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
              Pioneering Clean Air & Reliable Energy Standards
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Uncontrolled power generator emissions contribute significantly to
              local air pollution and acoustic disturbance. Our platform bridges
              the gap between asset owners and field inspectors to maintain
              eco-friendly operations seamlessly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
