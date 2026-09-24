import React from "react";

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color?: string; // Kept for interface compatibility
}

const InfoCard = ({ icon, label, value }: InfoCardProps) => {
  return (
    <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all duration-200 group">
      {/* Icon Wrapper */}
      <div className="w-12 h-12 flex items-center justify-center text-xl text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
        {icon}
      </div>

      {/* Label and Value */}
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide truncate">
          {label}
        </p>
        <h4 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight mt-0.5 truncate">
          {value}
        </h4>
      </div>
    </div>
  );
};

export default InfoCard;
