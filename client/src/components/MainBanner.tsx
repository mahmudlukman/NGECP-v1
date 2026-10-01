import React, { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, CheckCircle, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Fonts: add to index.html <head> (falls back to Georgia / system sans if missing):
 * <link rel="preconnect" href="https://fonts.googleapis.com" />
 * <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
 * <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap" rel="stylesheet" />
 */

const SCORE = 98.4;
const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const stats = [
  { label: "Registered units", value: "12,480" },
  { label: "Active field inspectors", value: "340" },
  { label: "Emission tests passed", value: "94.2%" },
];

const features = ["Real-time audits", "Verified reports", "Automated alerts"];

const MainBanner: React.FC = () => {
  const navigate = useNavigate();
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const offset = drawn ? CIRCUMFERENCE * (1 - SCORE / 100) : CIRCUMFERENCE;

  return (
    <section className="relative overflow-hidden font-[Figtree,ui-sans-serif,system-ui,sans-serif] text-[#0B1F1A]">
      {/* Fine dot texture, fades toward the right */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.35] [background-image:radial-gradient(#0B1F1A_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_right,black,transparent_70%)]"
      />
      {/* Soft warm glow anchoring the panel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/3 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(22,120,90,0.10),transparent)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          {/* Left: message and actions */}
          <div className="lg:col-span-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#16785A]" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#16785A]">
                Official Compliance Platform
              </span>
            </div>

            <h1 className="max-w-2xl font-[Newsreader,Georgia,serif] text-4xl font-normal leading-[1.08] tracking-tight sm:text-5xl lg:text-[4.25rem]">
              Automated tracking for cleaner power and compliance
            </h1>

            <p className="mt-7 max-w-xl text-base leading-relaxed text-[#0B1F1A]/70 sm:text-lg">
              Track generator health, automate field audits, and reduce harmful
              emissions across nationwide networks, for organizations,
              inspectors, and equipment owners.
            </p>

            <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#0B1F1A] px-7 py-3.5 text-sm font-semibold text-[#F3F1EA] shadow-[0_10px_30px_-12px_rgba(11,31,26,0.55)] transition-all hover:-translate-y-0.5 hover:bg-[#12332b] hover:shadow-[0_16px_36px_-12px_rgba(11,31,26,0.6)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16785A]"
              >
                Launch portal
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/about")}
                className="border-b border-[#0B1F1A]/30 pb-0.5 text-sm font-medium text-[#0B1F1A]/85 transition-colors hover:border-[#0B1F1A] hover:text-[#0B1F1A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16785A]"
              >
                Learn more
              </button>
            </div>

            <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#0B1F1A]/10 pt-6 text-sm text-[#0B1F1A]/60">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#16785A]" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: compliance panel */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-3xl border border-[#0B1F1A]/10 bg-white p-8 shadow-[0_30px_60px_-20px_rgba(11,31,26,0.18)] sm:p-10 lg:max-w-none">
              {/* Corner accent */}
              <span
                aria-hidden="true"
                className="absolute -top-px -left-px h-14 w-14 rounded-tl-3xl border-t-2 border-l-2 border-[#16785A]/40"
              />

              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#16785A]/25 text-[#16785A]">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold">System compliance</h2>
                  <p className="flex items-center gap-1.5 text-xs text-[#0B1F1A]/55">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#16785A]/60 motion-reduce:hidden" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#16785A]" />
                    </span>
                    Active monitoring
                  </p>
                </div>
              </div>

              {/* Gauge */}
              <div className="relative mx-auto my-9 h-44 w-44">
                <svg
                  viewBox="0 0 128 128"
                  className="h-full w-full -rotate-90"
                  role="img"
                  aria-label={`Compliance score ${SCORE} percent`}
                >
                  <circle
                    cx="64"
                    cy="64"
                    r={RADIUS}
                    fill="none"
                    stroke="rgba(11,31,26,0.1)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r={RADIUS}
                    fill="none"
                    stroke="#16785A"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={offset}
                    className="transition-[stroke-dashoffset] duration-[1600ms] ease-out motion-reduce:transition-none"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-[Newsreader,Georgia,serif] text-4xl tabular-nums">
                    {SCORE}%
                  </span>
                  <span className="mt-1 text-xs text-[#0B1F1A]/55">
                    compliant
                  </span>
                </div>
              </div>

              <dl className="divide-y divide-[#0B1F1A]/10 border-y border-[#0B1F1A]/10">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-baseline justify-between py-4"
                  >
                    <dt className="text-sm text-[#0B1F1A]/65">{s.label}</dt>
                    <dd className="font-[Newsreader,Georgia,serif] text-xl tabular-nums">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 flex items-start gap-3 text-xs leading-relaxed text-[#0B1F1A]/60">
                <Award className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#16785A]" />
                Certified compliant with federal atmospheric and acoustic
                guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainBanner;