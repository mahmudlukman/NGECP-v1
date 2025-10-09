import { useState, useEffect } from "react";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../@types";

interface LoginProps {
  setCurrentPage: (page: string) => void;
  closeModal: () => void;
}

const Login = ({ setCurrentPage, closeModal }: LoginProps) => {
  // const { user } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();

  const navigate = useNavigate();

  // Auto clear error after 5s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle Login Form Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError(null);

    try {
      const response = await login({ email, password }).unwrap(); // ✅ get the fresh data
      closeModal();

      const role = response.user?.role;

      if (role === "admin" || role === "editor") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
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
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black m-auto">Welcome Back</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6 m-auto">
        Please enter your details to log in
      </p>

      <form onSubmit={handleLogin}>
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
          placeholder="Min 8 Characters"
          type="password"
        />

        {/* ✅ Forgot Password link */}
        <div className="flex justify-end mb-2">
          <button
            type="button"
            className="text-[12px] text-primary underline cursor-pointer hover:text-primary/80"
            onClick={() => setCurrentPage("forgotPassword")}
          >
            Forgot Password?
          </button>
        </div>

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button
          type="submit"
          className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 my-3 text-sm rounded-md cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Logging In..." : "Login"}
        </button>

        <p className="text-[13px] text-slate-800 mt-3">
          Don’t have an account?{" "}
          <button
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => {
              setCurrentPage("signup");
            }}
          >
            SignUp
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
