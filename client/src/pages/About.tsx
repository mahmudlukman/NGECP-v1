import React from "react";
import {
  ShieldCheck,
  Cpu,
  BarChart3,
  Users,
  Globe,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const About: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Registered Generators", value: "10,000+" },
    { label: "Active Inspectors", value: "250+" },
    { label: "Inspections Conducted", value: "45,000+" },
    { label: "Compliance Rate Improvement", value: "38%" },
  ];

  const coreValues = [
    {
      icon: ShieldCheck,
      title: "Environmental Safety",
      description:
        "Dedicated to reducing carbon footprint and monitoring toxic emission levels across residential and commercial sectors.",
    },
    {
      icon: Cpu,
      title: "Digital Transparency",
      description:
        "Leveraging modern software and data parsing to eliminate paper trails and ensure compliance verification.",
    },
    {
      icon: BarChart3,
      title: "Data-Driven Insights",
      description:
        "Providing actionable insights for regulatory bodies and equipment owners to optimize fuel usage and compliance.",
    },
    {
      icon: Users,
      title: "Public Health Focus",
      description:
        "Mitigating harmful acoustic and atmospheric pollutants to foster healthier communities nationwide.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F1] font-[Figtree,ui-sans-serif,system-ui,sans-serif] text-[#0B1F1A]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0B1F1A] px-4 py-24 text-[#F3F1EA] sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.3] [background-image:radial-gradient(rgba(243,241,234,0.5)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(127,209,174,0.14),transparent)]"
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#7FD1AE]/50" />
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#7FD1AE]">
              <Globe className="h-3.5 w-3.5" />
              Environmental Compliance Platform
            </span>
            <span className="h-px w-10 bg-[#7FD1AE]/50" />
          </div>

          <h1 className="font-[Newsreader,Georgia,serif] text-4xl font-normal leading-[1.12] tracking-tight sm:text-5xl">
            Driving sustainable power &amp; safer emissions
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#F3F1EA]/70 sm:text-lg">
            We build modern digital infrastructure to track, inspect, and
            streamline emission standards for power generators, ensuring clean
            energy compliance across organizations.
          </p>
        </div>
      </section>

      {/* Stats Counter, overlapping the hero */}
      <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-[#0B1F1A]/10 bg-white p-6 shadow-[0_30px_60px_-25px_rgba(11,31,26,0.3)] sm:p-8 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`p-2 text-center ${
                idx > 0 ? "border-l border-[#0B1F1A]/10" : ""
              }`}
            >
              <p className="font-[Newsreader,Georgia,serif] text-2xl tabular-nums text-[#16785A] sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-xs font-medium text-[#0B1F1A]/55 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#0B1F1A]/10 bg-white p-8 shadow-[0_20px_40px_-28px_rgba(11,31,26,0.2)]">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#16785A]/25 text-[#16785A]">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h2 className="mt-5 font-[Newsreader,Georgia,serif] text-xl font-normal">
              Our Mission
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-[#0B1F1A]/65">
              To digitize and accelerate environmental compliance checks,
              enabling businesses and individual generator owners to meet strict
              emission standards with complete transparency and ease.
            </p>
          </div>

          <div className="rounded-2xl border border-[#0B1F1A]/10 bg-white p-8 shadow-[0_20px_40px_-28px_rgba(11,31,26,0.2)]">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#16785A]/25 text-[#16785A]">
              <BarChart3 className="h-5 w-5" />
            </span>
            <h2 className="mt-5 font-[Newsreader,Georgia,serif] text-xl font-normal">
              Our Vision
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-[#0B1F1A]/65">
              To create a cleaner atmosphere by establishing an automated
              national framework for tracking generator health, reducing toxic
              emissions, and advancing sustainable power practices.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative overflow-hidden pb-24">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.35] [background-image:radial-gradient(#0B1F1A_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        />
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-[#16785A]" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#16785A]">
                Our Values
              </span>
              <span className="h-px w-10 bg-[#16785A]" />
            </div>
            <h2 className="font-[Newsreader,Georgia,serif] text-3xl font-normal tracking-tight">
              What drives our work
            </h2>
            <p className="mt-3 text-sm text-[#0B1F1A]/60">
              Built on accountability, technology, and environmental
              responsibility.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, idx) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={value.title}
                  className="group relative overflow-hidden rounded-2xl border border-[#0B1F1A]/10 bg-white p-6 shadow-[0_20px_40px_-28px_rgba(11,31,26,0.25)] transition-all hover:-translate-y-1 hover:border-[#16785A]/30"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-1 -top-3 select-none font-[Newsreader,Georgia,serif] text-6xl text-[#0B1F1A]/[0.045]"
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B1F1A]/[0.04] text-[#0B1F1A] transition-colors group-hover:bg-[#16785A] group-hover:text-white">
                    <IconComponent className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="relative mt-5 font-[Newsreader,Georgia,serif] text-base font-normal">
                    {value.title}
                  </h3>
                  <p className="relative mt-2 text-xs leading-relaxed text-[#0B1F1A]/60">
                    {value.description}
                  </p>

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

      {/* Call to Action */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-[#0B1F1A] px-6 py-14 text-center text-[#F3F1EA] shadow-[0_30px_70px_-25px_rgba(11,31,26,0.45)] sm:px-12">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.3] [background-image:radial-gradient(rgba(243,241,234,0.5)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
          />
          <div className="relative mx-auto max-w-lg">
            <h2 className="font-[Newsreader,Georgia,serif] text-2xl font-normal tracking-tight sm:text-3xl">
              Have questions or need an inspection?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#F3F1EA]/65">
              Get in touch with our certified field team to schedule an emission
              test or register your equipment.
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => navigate("/contact")}
                className="group inline-flex items-center gap-2 rounded-full bg-[#F3F1EA] px-6 py-3.5 text-sm font-semibold text-[#0B1F1A] shadow-[0_10px_25px_-10px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-0.5 hover:bg-white"
              >
                Contact Support
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
