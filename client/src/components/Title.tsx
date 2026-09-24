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
      className={`flex flex-col ${
        isCentered ? "items-center text-center" : "items-start text-left"
      } max-w-2xl mx-auto`}
    >
      {/* Optional Badge */}
      {badge && (
        <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200 uppercase">
          {badge}
        </span>
      )}

      {/* Main Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>

      {/* Description Body */}
      <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
        {description}
      </p>

      {/* Optional View More Action Link */}
      {visibleButton && href && (
        <Link
          to={href}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:gap-2.5 transition-all group focus:outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-md py-1"
        >
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
};

export default Title;