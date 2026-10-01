import React from "react";
import { Link } from "react-router-dom";
import { Compass, Home, ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F7F6F1] p-4 font-[Figtree,ui-sans-serif,system-ui,sans-serif] text-[#0B1F1A]">
      {/* Faint dot texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#0B1F1A_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />

      <div className="relative flex w-full max-w-md flex-col items-center overflow-hidden rounded-3xl border border-[#0B1F1A]/10 bg-white p-10 text-center shadow-[0_30px_60px_-25px_rgba(11,31,26,0.25)]">
        {/* Oversized serif numeral, watermark */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none font-[Newsreader,Georgia,serif] text-[9rem] leading-none text-[#0B1F1A]/[0.045]"
        >
          404
        </span>

        {/* Badge / Icon */}
        <span className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#16785A]/25 text-[#16785A]">
          <Compass className="h-8 w-8 stroke-[1.5]" />
        </span>

        {/* Status & Title */}
        <div className="relative mb-1 flex items-center gap-3">
          <span className="h-px w-8 bg-[#16785A]" />
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#16785A]">
            Error 404
          </span>
          <span className="h-px w-8 bg-[#16785A]" />
        </div>
        <h1 className="relative font-[Newsreader,Georgia,serif] text-3xl font-normal tracking-tight">
          Page not found
        </h1>

        <p className="relative mb-8 mt-3 text-sm leading-relaxed text-[#0B1F1A]/60">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved, renamed, or deleted.
        </p>

        {/* Primary Action */}
        <Link
          to="/"
          className="group relative flex w-full items-center justify-center gap-2 rounded-full bg-[#0B1F1A] px-4 py-3 text-sm font-semibold text-[#F3F1EA] shadow-[0_10px_25px_-12px_rgba(11,31,26,0.5)] transition-all hover:-translate-y-0.5 hover:bg-[#12332b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16785A]/40"
        >
          <Home className="h-4 w-4" />
          <span>Return Home</span>
        </Link>

        {/* Secondary Go Back Link */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="relative mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1F1A]/55 transition-colors hover:text-[#0B1F1A] focus:outline-none"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Go back to previous page</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;