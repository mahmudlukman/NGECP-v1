interface PassFailToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  passLabel?: string;
  failLabel?: string;
}

const PassFailToggle = ({
  value,
  onChange,
  passLabel = "Passed",
  failLabel = "Failed",
}: PassFailToggleProps) => {
  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
      <button
        type="button"
        onClick={() => onChange(true)}
        aria-pressed={value}
        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500/40 ${
          value
            ? "bg-emerald-600 text-white shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        {passLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        aria-pressed={!value}
        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-rose-500/40 ${
          !value
            ? "bg-rose-600 text-white shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        {failLabel}
      </button>
    </div>
  );
};

export default PassFailToggle;
