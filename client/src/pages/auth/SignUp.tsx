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
  const [accountType, setAccountType] = useState<"individual" | "organization">(
    "individual",
  );

  // Individual Fields
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // organization Fields
  const [organizationName, setOrganizationName] = useState("");
  const [organizationRegNumber, setOrganizationRegNumber] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");
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
      if (!organizationName.trim()) {
        setError("Please enter organization name.");
        return;
      }
      if (!phoneNumber.trim()) {
        setError("Please enter organization phone number.");
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
        registrationData.organizationName = organizationName;
        if (organizationRegNumber)
          registrationData.organizationRegNumber = organizationRegNumber;
        if (organizationAddress)
          registrationData.organizationAddress = organizationAddress;
        if (contactPersonName)
          registrationData.contactPersonName = contactPersonName;
        if (contactPersonPhone)
          registrationData.contactPersonPhone = contactPersonPhone;
      }

      const res = await register(
        registrationData as Parameters<typeof register>[0],
      ).unwrap();

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
    <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 font-[Figtree,ui-sans-serif,system-ui,sans-serif] sm:p-8">
      {/* Header */}
      <div className="mb-6 text-center sm:text-left">
        <h3 className="font-[Newsreader,Georgia,serif] text-xl font-normal tracking-tight text-[#0B1F1A]">
          Create an Account
        </h3>
        <p className="mt-1 text-xs text-[#0B1F1A]/55 sm:text-sm">
          Join us today by entering your details below.
        </p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        {/* Account Type Toggle */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-[#0B1F1A]/75">
            Account Type
          </label>
          <div className="grid grid-cols-2 gap-3 rounded-lg bg-[#0B1F1A]/[0.04] p-1">
            <button
              type="button"
              onClick={() => setAccountType("individual")}
              className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-all sm:text-sm ${
                accountType === "individual"
                  ? "bg-white text-[#16785A] shadow-xs"
                  : "text-[#0B1F1A]/55 hover:text-[#0B1F1A]"
              }`}
            >
              <User className="h-4 w-4" />
              <span>Individual</span>
            </button>
            <button
              type="button"
              onClick={() => setAccountType("organization")}
              className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-all sm:text-sm ${
                accountType === "organization"
                  ? "bg-white text-[#16785A] shadow-xs"
                  : "text-[#0B1F1A]/55 hover:text-[#0B1F1A]"
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>organization</span>
            </button>
          </div>
        </div>

        {/* Dynamic Fields Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                value={organizationName}
                onChange={({ target }) => setOrganizationName(target.value)}
                label="organization Name"
                placeholder="Tech Solutions Ltd"
                type="text"
              />
              <Input
                value={phoneNumber}
                onChange={({ target }) => setPhoneNumber(target.value)}
                label="organization Phone Number"
                placeholder="08012345678"
                type="tel"
              />
              <Input
                value={organizationRegNumber}
                onChange={({ target }) =>
                  setOrganizationRegNumber(target.value)
                }
                label="Reg Number (Optional)"
                placeholder="RC123456"
                type="text"
              />
              <Input
                value={organizationAddress}
                onChange={({ target }) => setOrganizationAddress(target.value)}
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
          <div className="animate-fade-in flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="animate-fade-in flex items-center gap-2 rounded-lg border border-[#16785A]/25 bg-[#16785A]/[0.06] p-3 text-xs text-[#0B1F1A]">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16785A]" />
            <span>{success}</span>
          </div>
        )}

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B1F1A] px-4 py-2.5 text-sm font-medium text-[#F3F1EA] shadow-xs transition-all hover:bg-[#12332b] focus:outline-none focus:ring-2 focus:ring-[#16785A]/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            "Sign Up"
          )}
        </button>

        {/* Redirect Switch */}
        <p className="pt-2 text-center text-xs text-[#0B1F1A]/60">
          Already have an account?{" "}
          <button
            type="button"
            className="font-semibold text-[#16785A] underline hover:text-[#0f5e44] focus:outline-none"
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
