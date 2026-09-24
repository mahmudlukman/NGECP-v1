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
    <div className="min-h-screen bg-slate-50 text-slate-700">
      {/* Hero Section */}
      <section className="relative bg-emerald-700 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
            <Globe className="w-3.5 h-3.5" /> Environmental Compliance Platform
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Driving Sustainable Power & Safer Emissions
          </h1>
          <p className="text-emerald-50 text-base sm:text-lg max-w-2xl mx-auto font-normal">
            We build modern digital infrastructure to track, inspect, and
            streamline emission standards for power generators—ensuring clean
            energy compliance across organizations.
          </p>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center p-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Our Mission
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To digitize and accelerate environmental compliance checks,
              enabling businesses and individual generator owners to meet strict
              emission standards with complete transparency and ease.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Our Vision
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To create a cleaner atmosphere by establishing an automated
              national framework for tracking generator health, reducing toxic
              emissions, and advancing sustainable power practices.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
            What Drives Our Work
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Built on accountability, technology, and environmental
            responsibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((value, idx) => {
            const IconComponent = value.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all"
              >
                <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-emerald-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Have Questions or Need an Inspection?
          </h2>
          <p className="text-emerald-100 text-sm max-w-lg mx-auto">
            Get in touch with our certified field team to schedule an emission
            test or register your equipment.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate("/contact")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 font-semibold text-sm rounded-lg hover:bg-emerald-50 transition-colors shadow-xs"
            >
              Contact Support <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
