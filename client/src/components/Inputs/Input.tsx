import { useState, useId, type FC, type ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder: string;
  type: string;
  disabled?: boolean;
  error?: string;
  autoComplete?: string;
  name?: string;
}

const Input: FC<InputProps> = ({
  value,
  onChange,
  label,
  placeholder,
  type,
  disabled = false,
  error,
  autoComplete,
  name,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = useId();

  const isPasswordType = type === "password";
  const computedType = isPasswordType
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="w-full font-[Figtree,ui-sans-serif,system-ui,sans-serif]">
      {/* Field Label */}
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-xs font-semibold text-[#0B1F1A]/75"
      >
        {label}
      </label>

      {/* Input Container Wrapper */}
      <div
        className={`flex items-center rounded-lg border bg-white px-3 py-2 transition-all focus-within:ring-2 ${
          error
            ? "border-rose-400 focus-within:ring-rose-500/20"
            : "border-[#0B1F1A]/15 focus-within:border-[#16785A] focus-within:ring-[#16785A]/20"
        } ${disabled ? "cursor-not-allowed bg-[#0B1F1A]/[0.03] opacity-60" : ""}`}
      >
        <input
          id={inputId}
          name={name}
          type={computedType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className="w-full bg-transparent text-sm text-[#0B1F1A] outline-none placeholder:text-[#0B1F1A]/35 disabled:cursor-not-allowed"
        />

        {/* Password Visibility Toggle */}
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="ml-2 text-[#0B1F1A]/35 transition-colors hover:text-[#0B1F1A]/75 focus:outline-none disabled:pointer-events-none"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 shrink-0" />
            ) : (
              <Eye className="h-4 w-4 shrink-0" />
            )}
          </button>
        )}
      </div>

      {/* Field Level Error Message */}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
};

export default Input;
