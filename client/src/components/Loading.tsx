import React from "react";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
}

const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  fullScreen = true,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-[3px]",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3.5 font-[Figtree,ui-sans-serif,system-ui,sans-serif] transition-all ${
        fullScreen
          ? "fixed inset-0 z-50 min-h-screen w-full bg-[#F7F6F1]/85 backdrop-blur-xs"
          : "w-full py-12"
      }`}
    >
      {/* Spinner Ring */}
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-[#0B1F1A]/10 border-t-[#16785A]`}
      />

      {/* Optional Context Message */}
      {message && (
        <p className="animate-pulse text-xs font-medium tracking-wide text-[#0B1F1A]/50 sm:text-sm">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loading;
