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
    <section className="relative overflow-hidden bg-[#F7F6F1] py-20 font-[Figtree,ui-sans-serif,system-ui,sans-serif] text-[#0B1F1A] sm:py-28">
      {/* Faint dot texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.35] [background-image:radial-gradient(#0B1F1A_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#16785A]" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#16785A]">
              Core Features
            </span>
            <span className="h-px w-10 bg-[#16785A]" />
          </div>

          <h2 className="font-[Newsreader,Georgia,serif] text-3xl font-normal tracking-tight sm:text-4xl">
            Engineered for precision &amp; convenience
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-[#0B1F1A]/65 sm:text-base">
            Everything required to manage equipment registration, schedule field
            audits, and monitor emission benchmarks.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {specs.map((spec, index) => {
            const Icon = spec.icon;
            return (
              <div
                key={spec.title}
                className="group relative overflow-hidden rounded-2xl border border-[#0B1F1A]/10 bg-white p-7 shadow-[0_20px_40px_-28px_rgba(11,31,26,0.25)] transition-all hover:-translate-y-1 hover:border-[#16785A]/30 hover:shadow-[0_24px_48px_-20px_rgba(11,31,26,0.22)]"
              >
                {/* Faint index numeral, watermark */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-1 -top-3 select-none font-[Newsreader,Georgia,serif] text-6xl text-[#0B1F1A]/[0.045]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B1F1A]/[0.04] text-[#0B1F1A] transition-colors group-hover:bg-[#16785A] group-hover:text-white">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>

                <h3 className="relative mt-6 font-[Newsreader,Georgia,serif] text-lg font-normal leading-snug">
                  {spec.title}
                </h3>

                <p className="relative mt-2.5 text-sm leading-relaxed text-[#0B1F1A]/60">
                  {spec.description}
                </p>

                {/* Accent underline, expands on hover */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-0.5 w-8 bg-[#16785A] transition-all duration-300 group-hover:w-full"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurSpecs;
