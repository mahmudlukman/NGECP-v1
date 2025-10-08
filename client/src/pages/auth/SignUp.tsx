// SignUp.tsx - Minimal changes to your original file

import { useEffect, useState } from "react";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import { useRegisterMutation } from "../../redux/features/auth/authApi";
import type { RegistrationData } from "../../@types";

const SignUp = ({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) => {
  // Account Type
  const [accountType, setAccountType] = useState<"individual" | "company">(
    "individual"
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

  // Original fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [_isRegistering, setIsRegistering] = useState(false);
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
      if (!fullName) {
        setError("Please enter full name.");
        return;
      }
      if (!phoneNumber) {
        setError("Please enter phone number.");
        return;
      }
    } else {
      if (!companyName) {
        setError("Please enter company name.");
        return;
      }
      if (!phoneNumber) {
        setError("Please enter company phone number.");
        return;
      }
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError(null);
    setIsRegistering(true);

    try {
      // Build registration data based on account type
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

      if (res?.message) {
        setSuccess(res.message);
      } else {
        setSuccess("Registration successful!");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.data?.message) {
        setError(err.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="w-[90vw] md:w-[40vw] p-7 flex flex-col justify-center max-h-[90vh] overflow-y-auto">
      <h3 className="text-lg font-semibold text-black">Create an Account</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Join us today by entering your details below.
      </p>

      <form onSubmit={handleSignUp}>
        {/* Account Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setAccountType("individual")}
              className={`py-2 px-3 rounded-md border-2 transition-all text-sm ${
                accountType === "individual"
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              Individual
            </button>
            <button
              type="button"
              onClick={() => setAccountType("company")}
              className={`py-2 px-3 rounded-md border-2 transition-all text-sm ${
                accountType === "company"
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              Company
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Individual Fields */}
          {accountType === "individual" && (
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
          )}

          {/* Company Fields */}
          {accountType === "company" && (
            <>
              <Input
                value={companyName}
                onChange={({ target }) => setCompanyName(target.value)}
                label="Company Name"
                placeholder="Tech Solutions Ltd"
                type="text"
              />
              <Input
                value={companyRegNumber}
                onChange={({ target }) => setCompanyRegNumber(target.value)}
                label="Registration Number (Optional)"
                placeholder="RC123456"
                type="text"
              />
              <Input
                value={companyAddress}
                onChange={({ target }) => setCompanyAddress(target.value)}
                label="Company Address (Optional)"
                placeholder="123 Business Street, Lagos"
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
              <Input
                value={phoneNumber}
                onChange={({ target }) => setPhoneNumber(target.value)}
                label="Company Phone Number"
                placeholder="08012345678"
                type="tel"
              />
            </>
          )}

          {/* Common Fields */}
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 6 Characters"
            type="password"
          />
        </div>

        {error && <p className="text-red-500 text-xs pb-2.5 py-2">{error}</p>}
        {success && (
          <p className="text-green-600 text-xs pb-2.5 py-2">{success}</p>
        )}

        <button
          type="submit"
          className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 my-3 text-sm rounded-md cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="text-[13px] text-slate-800 mt-3">
          Already an account?{" "}
          <button
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => {
              setCurrentPage("login");
            }}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
