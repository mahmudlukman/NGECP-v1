import { type FC, type ReactNode, useState, useId } from "react";

interface TooltipProps {
  text: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

const Tooltip: FC<TooltipProps> = ({ text, children, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

  const positionClasses: Record<string, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses: Record<string, string> = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-[#0B1F1A] border-x-transparent border-b-transparent",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-b-[#0B1F1A] border-x-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-[#0B1F1A] border-y-transparent border-r-transparent",
    right:
      "right-full top-1/2 -translate-y-1/2 border-r-[#0B1F1A] border-y-transparent border-l-transparent",
  };

  return (
    <div
      className="relative inline-flex items-center font-[Figtree,ui-sans-serif,system-ui,sans-serif]"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      aria-describedby={isVisible ? tooltipId : undefined}
    >
      {children}

      {/* Tooltip Content Box */}
      <div
        id={tooltipId}
        role="tooltip"
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-lg border border-white/10 bg-[#0B1F1A]/95 px-2.5 py-1.5 text-xs font-medium text-[#F3F1EA] shadow-[0_10px_25px_-10px_rgba(11,31,26,0.5)] backdrop-blur-xs transition-all duration-150 ease-out ${
          positionClasses[position]
        } ${
          isVisible
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {text}

        {/* Directional Arrow Indicator */}
        <div
          className={`absolute border-4 ${arrowClasses[position]}`}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default Tooltip;
