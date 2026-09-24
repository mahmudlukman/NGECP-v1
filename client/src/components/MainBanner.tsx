import React from "react";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Award,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MainBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-slate-50 to-slate-50 pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Decorative Subtle Background Blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-100/40 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Text & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Next-Gen Emission & Compliance Management</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 tracking-tight leading-[1.15]">
              Automated Tracking for{" "}
              <span className="text-emerald-600">Cleaner Power</span> &
              Compliance
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Empowering organizations, inspectors, and equipment owners to
              track generator health, automate field audits, and reduce harmful
              emissions across nationwide networks.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
              >
                <span>Launch Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/about")}
                className="w-full sm:w-auto px-7 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-semibold text-sm rounded-xl transition-all shadow-2xs flex items-center justify-center"
              >
                Learn More
              </button>
            </div>

            {/* Quick Feature Badges */}
            <div className="pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Real-time Audits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Verified Reports</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Automated Alerts</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">
                      System Compliance
                    </h3>
                    <p className="text-xs text-slate-500">Active Monitoring</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  98.4%
                </span>
              </div>

              <div className="space-y-4 py-6">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">
                    Registered Units
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    12,480
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">
                    Active Field Inspectors
                  </span>
                  <span className="text-sm font-bold text-slate-800">340</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">
                    Emission Tests Passed
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    94.2%
                  </span>
                </div>
              </div>

              <div className="p-4 bg-emerald-600 text-white rounded-xl flex items-center gap-3">
                <Award className="w-6 h-6 text-emerald-200 flex-shrink-0" />
                <p className="text-xs font-medium leading-tight">
                  Certified compliant with federal atmospheric and acoustic
                  guidelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainBanner;
