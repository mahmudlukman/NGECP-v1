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
    <div className="w-full">
      {/* Field Label */}
      <label
        htmlFor={inputId}
        className="block text-xs font-semibold text-slate-700 mb-1.5"
      >
        {label}
      </label>

      {/* Input Container Wrapper */}
      <div
        className={`flex items-center border rounded-lg px-3 py-2 bg-white transition-all focus-within:ring-2 ${
          error
            ? "border-rose-400 focus-within:ring-rose-500/20"
            : "border-slate-200 focus-within:border-emerald-500 focus-within:ring-emerald-500/20"
        } ${disabled ? "bg-slate-50 opacity-60 cursor-not-allowed" : ""}`}
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
          className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400 disabled:cursor-not-allowed"
        />

        {/* Password Visibility Toggle */}
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="ml-2 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none disabled:pointer-events-none"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 shrink-0" />
            ) : (
              <Eye className="w-4 h-4 shrink-0" />
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
