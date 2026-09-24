import React from "react";
import { Link } from "react-router-dom";
import { Compass, Home, ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white border border-slate-200 rounded-2xl shadow-xs text-center flex flex-col items-center">
        {/* Badge / Icon */}
        <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-4">
          <Compass className="w-8 h-8 stroke-[1.5]" />
        </div>

        {/* Status & Title */}
        <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-1">
          Error 404
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Page Not Found
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6 leading-relaxed">
          Sorry, we couldn’t find the page you’re looking for. It might have
          been moved, renamed, or deleted.
        </p>

        {/* Primary Action */}
        <Link
          to="/"
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        {/* Secondary Go Back Link */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Go back to previous page</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
