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
    <section className="relative overflow-hidden border-y border-[#0B1F1A]/10 bg-white py-20 font-[Figtree,ui-sans-serif,system-ui,sans-serif] text-[#0B1F1A] sm:py-28">
      {/* Faint dot texture behind the visual column */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 -z-10 w-1/2 opacity-[0.35] [background-image:radial-gradient(#0B1F1A_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_left,black,transparent_70%)]"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          {/* Left: credential + stats */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl bg-[#0B1F1A] p-8 text-[#F3F1EA] shadow-[0_30px_60px_-20px_rgba(11,31,26,0.35)] sm:p-10">
              {/* Oversized watermark icon */}
              <Cpu
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 text-white/[0.06]"
                strokeWidth={1}
              />

              <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#7FD1AE]/30 text-[#7FD1AE]">
                <Cpu className="h-5 w-5" />
              </span>

              <h3 className="relative mt-6 font-[Newsreader,Georgia,serif] text-xl font-normal leading-snug">
                Smart monitoring infrastructure
              </h3>

              <p className="relative mt-3 text-sm leading-relaxed text-[#F3F1EA]/65">
                Replacing manual paper audits with instant data extraction, QR
                verification, and real-time inspector feedback.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#16785A]/20 bg-[#16785A]/[0.06] p-6 text-center shadow-[0_20px_40px_-24px_rgba(22,120,90,0.5)]">
                <p className="font-[Newsreader,Georgia,serif] text-3xl tabular-nums text-[#16785A]">
                  100%
                </p>
                <p className="mt-1.5 text-xs text-[#0B1F1A]/60">
                  Audit traceability
                </p>
              </div>
              <div className="rounded-2xl border border-[#0B1F1A]/10 bg-white p-6 text-center shadow-[0_20px_40px_-24px_rgba(11,31,26,0.18)]">
                <p className="font-[Newsreader,Georgia,serif] text-3xl tabular-nums">
                  24/7
                </p>
                <p className="mt-1.5 text-xs text-[#0B1F1A]/60">
                  Status verification
                </p>
              </div>
            </div>
          </div>

          {/* Right: content */}
          <div className="relative lg:col-span-7">
            {/* Large faint numeral, purely decorative */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 right-0 hidden select-none font-[Newsreader,Georgia,serif] text-[10rem] leading-none text-[#0B1F1A]/[0.04] lg:block"
            >
              01
            </span>

            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#16785A]" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#16785A]">
                Why it matters
              </span>
            </div>

            <h2 className="mt-4 max-w-xl font-[Newsreader,Georgia,serif] text-3xl font-normal leading-[1.15] tracking-tight sm:text-4xl">
              Pioneering clean air and reliable energy standards
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#0B1F1A]/70 sm:text-base">
              Uncontrolled power generator emissions contribute significantly to
              local air pollution and acoustic disturbance. Our platform bridges
              the gap between asset owners and field inspectors to maintain
              eco-friendly operations seamlessly.
            </p>

            <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-[#0B1F1A]/10 pt-8 sm:grid-cols-2">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-[#16785A]/[0.05]"
                >
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#16785A] text-white">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-sm text-[#0B1F1A]/75">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
