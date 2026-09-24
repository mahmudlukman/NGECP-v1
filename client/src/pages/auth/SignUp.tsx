import React, { useEffect, useState } from "react";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import { useRegisterMutation } from "../../redux/features/auth/authApi";
import type { RegistrationData } from "../../@types";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  User,
  Building2,
} from "lucide-react";

interface SignUpProps {
  setCurrentPage: (page: string) => void;
}

interface CustomFetchBaseQueryError {
  data?: {
    message?: string;
  };
}

const SignUp: React.FC<SignUpProps> = ({ setCurrentPage }) => {
  // Account Type
  const [accountType, setAccountType] = useState<"individual" | "company">(
    "individual",
  );

  // Individual Fields
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Company Fields
  const [companyName, setCompanyName] = useState("");
  const [companyRegNumber, setCompanyRegNumber] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [contactPersonPhone, setContactPersonPhone] = useState("");

  // Account Credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Notifications
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Handle SignUp Form Submit
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation based on account type
    if (accountType === "individual") {
      if (!fullName.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (!phoneNumber.trim()) {
        setError("Please enter your phone number.");
        return;
      }
    } else {
      if (!companyName.trim()) {
        setError("Please enter company name.");
        return;
      }
      if (!phoneNumber.trim()) {
        setError("Please enter company phone number.");
        return;
      }
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError(null);

    try {
      const registrationData: RegistrationData = {
        email,
        password,
        accountType,
        phoneNumber,
      };

      if (accountType === "individual") {
        registrationData.name = fullName;
      } else {
        registrationData.companyName = companyName;
        if (companyRegNumber)
          registrationData.companyRegNumber = companyRegNumber;
        if (companyAddress) registrationData.companyAddress = companyAddress;
        if (contactPersonName)
          registrationData.contactPersonName = contactPersonName;
        if (contactPersonPhone)
          registrationData.contactPersonPhone = contactPersonPhone;
      }

      const res = await register(registrationData).unwrap();

      setSuccess(res?.message || "Registration successful! Redirecting...");

      // Auto-switch to login tab after success
      setTimeout(() => {
        setCurrentPage("login");
      }, 2000);
    } catch (err: unknown) {
      const apiError = err as CustomFetchBaseQueryError;
      if (apiError.data?.message) {
        setError(apiError.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="w-full max-w-lg p-6 sm:p-8 bg-white rounded-xl max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="mb-6 text-center sm:text-left">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          Create an Account
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Join us today by entering your details below.
        </p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        {/* Account Type Toggle */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Account Type
          </label>
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setAccountType("individual")}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                accountType === "individual"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Individual</span>
            </button>
            <button
              type="button"
              onClick={() => setAccountType("company")}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                accountType === "company"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Company</span>
            </button>
          </div>
        </div>

        {/* Dynamic Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {accountType === "individual" ? (
            <>
              <Input
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
                label="Full Name"
                placeholder="John Doe"
                type="text"
              />
              <Input
                value={phoneNumber}
                onChange={({ target }) => setPhoneNumber(target.value)}
                label="Phone Number"
                placeholder="08012345678"
                type="tel"
              />
            </>
          ) : (
            <>
              <Input
                value={companyName}
                onChange={({ target }) => setCompanyName(target.value)}
                label="Company Name"
                placeholder="Tech Solutions Ltd"
                type="text"
              />
              <Input
                value={phoneNumber}
                onChange={({ target }) => setPhoneNumber(target.value)}
                label="Company Phone Number"
                placeholder="08012345678"
                type="tel"
              />
              <Input
                value={companyRegNumber}
                onChange={({ target }) => setCompanyRegNumber(target.value)}
                label="Reg Number (Optional)"
                placeholder="RC123456"
                type="text"
              />
              <Input
                value={companyAddress}
                onChange={({ target }) => setCompanyAddress(target.value)}
                label="Address (Optional)"
                placeholder="123 Business Street"
                type="text"
              />
              <Input
                value={contactPersonName}
                onChange={({ target }) => setContactPersonName(target.value)}
                label="Contact Person (Optional)"
                placeholder="Jane Smith"
                type="text"
              />
              <Input
                value={contactPersonPhone}
                onChange={({ target }) => setContactPersonPhone(target.value)}
                label="Contact Phone (Optional)"
                placeholder="08098765432"
                type="tel"
              />
            </>
          )}

          {/* Common Full-width Fields */}
          <div className="sm:col-span-2">
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="email"
            />
          </div>

          <div className="sm:col-span-2">
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 6 Characters"
              type="password"
            />
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500/20 mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            "Sign Up"
          )}
        </button>

        {/* Redirect Switch */}
        <p className="text-xs text-center text-slate-600 pt-2">
          Already have an account?{" "}
          <button
            type="button"
            className="font-semibold text-emerald-600 hover:text-emerald-700 underline focus:outline-none"
            onClick={() => setCurrentPage("login")}
          >
            Log In
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
