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
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3.5 transition-all ${
        fullScreen
          ? "min-h-screen w-full bg-slate-50/80 backdrop-blur-xs fixed inset-0 z-50"
          : "w-full py-12"
      }`}
    >
      {/* Spinner Ring */}
      <div
        className={`${sizeClasses[size]} rounded-full border-slate-200 border-t-emerald-500 animate-spin border-[3px]`}
      />

      {/* Optional Context Message */}
      {message && (
        <p className="text-xs sm:text-sm font-medium text-slate-500 animate-pulse tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loading;
