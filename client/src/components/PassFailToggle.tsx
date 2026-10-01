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
    <div className="inline-flex rounded-full border border-[#0B1F1A]/10 bg-[#0B1F1A]/[0.03] p-1 font-[Figtree,ui-sans-serif,system-ui,sans-serif]">
      <button
        type="button"
        onClick={() => onChange(true)}
        aria-pressed={value}
        className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium outline-none transition-colors focus:ring-2 focus:ring-[#16785A]/40 ${
          value
            ? "bg-[#16785A] text-white shadow-sm"
            : "text-[#0B1F1A]/50 hover:text-[#0B1F1A]/75"
        }`}
      >
        {passLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        aria-pressed={!value}
        className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium outline-none transition-colors focus:ring-2 focus:ring-rose-500/40 ${
          !value
            ? "bg-rose-600 text-white shadow-sm"
            : "text-[#0B1F1A]/50 hover:text-[#0B1F1A]/75"
        }`}
      >
        {failLabel}
      </button>
    </div>
  );
};

export default PassFailToggle;