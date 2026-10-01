import type { FC } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface TitleProps {
  title: string;
  description: string;
  visibleButton?: boolean;
  href?: string;
  buttonText?: string;
  badge?: string;
  align?: "center" | "left";
}

const Title: FC<TitleProps> = ({
  title,
  description,
  visibleButton = true,
  href = "#",
  buttonText = "View details",
  badge,
  align = "center",
}) => {
  const isCentered = align === "center";

  return (
    <div
      className={`mx-auto flex max-w-2xl flex-col font-[Figtree,ui-sans-serif,system-ui,sans-serif] ${
        isCentered ? "items-center text-center" : "items-start text-left"
      }`}
    >
      {/* Optional Badge */}
      {badge && (
        <div
          className={`mb-5 flex items-center gap-3 ${
            isCentered ? "" : "self-start"
          }`}
        >
          <span className="h-px w-10 bg-[#16785A]" />
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#16785A]">
            {badge}
          </span>
          {isCentered && <span className="h-px w-10 bg-[#16785A]" />}
        </div>
      )}

      {/* Main Heading */}
      <h2 className="font-[Newsreader,Georgia,serif] text-2xl font-normal tracking-tight text-[#0B1F1A] sm:text-3xl">
        {title}
      </h2>

      {/* Description Body */}
      <p className="mt-3 text-sm leading-relaxed text-[#0B1F1A]/65 sm:text-base">
        {description}
      </p>

      {/* Optional View More Action Link */}
      {visibleButton && href && (
        <Link
          to={href}
          className="group mt-5 inline-flex items-center gap-1.5 rounded-md border-b border-[#16785A]/30 py-1 text-sm font-semibold text-[#16785A] transition-all hover:gap-2.5 hover:border-[#16785A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16785A]/25"
        >
          <span>{buttonText}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </Link>
      )}
    </div>
  );
};

export default Title;