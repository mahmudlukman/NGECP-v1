import React from "react";

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color?: string; // Kept for interface compatibility
}

const InfoCard = ({ icon, label, value }: InfoCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#0B1F1A]/10 bg-white p-6 font-[Figtree,ui-sans-serif,system-ui,sans-serif] shadow-[0_20px_40px_-30px_rgba(11,31,26,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-[#16785A]/30 hover:shadow-[0_28px_56px_-24px_rgba(11,31,26,0.28)]">
      {/* Faint dot texture, fades from the top-right corner */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#0B1F1A_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_60%)]"
      />

      {/* Oversized watermark icon */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-4 -right-4 text-[#0B1F1A]/[0.045] transition-colors duration-300 group-hover:text-[#16785A]/[0.08] [&>svg]:h-24 [&>svg]:w-24"
      >
        {icon}
      </div>

      {/* Corner accent bracket */}
      <span
        aria-hidden="true"
        className="absolute -left-px -top-px h-10 w-10 rounded-tl-2xl border-l-2 border-t-2 border-[#16785A]/0 transition-colors duration-300 group-hover:border-[#16785A]/40"
      />

      <div className="relative">
        {/* Icon badge */}
        {/* <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#16785A]/20 bg-[#16785A]/[0.08] text-lg text-[#16785A] transition-colors duration-300 group-hover:bg-[#16785A] group-hover:text-white [&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </div> */}

        {/* Label */}
        <p className="mt-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0B1F1A]/45">
          <span className="h-px w-4 bg-[#16785A]/40" />
          {label}
        </p>

        {/* Value */}
        <h4 className="mt-1.5 truncate font-[Newsreader,Georgia,serif] text-3xl font-normal tabular-nums tracking-tight text-[#0B1F1A] sm:text-4xl">
          {value}
        </h4>
      </div>
    </div>
  );
};

export default InfoCard;
