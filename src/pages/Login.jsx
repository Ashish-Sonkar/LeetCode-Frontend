
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import { loginUser } from "../authSlice";
import { useEffect, useState } from "react";
import {
  Code2,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password should contain at least 8 characters"),
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

 
return (
  <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-[#f4f7ff] px-3 py-3 sm:px-5 lg:py-2">
    {/* Background Effects */}
    <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
    <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />

    {/* Main Card */}
    <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white bg-white shadow-2xl shadow-indigo-900/10 lg:grid-cols-2">

      {/* Left Panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#111b3c] via-[#172b5c] to-[#244bc0] p-6 text-white lg:flex xl:p-8">
        <div className="absolute -right-20 top-20 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -right-10 top-32 h-44 w-44 rounded-full border border-white/10" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-400/10 blur-2xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
            <Code2 size={23} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              CodeCrag
            </h1>
            <p className="text-xs text-blue-200">
              Your coding journey starts here
            </p>
          </div>
        </div>

        <div className="relative my-6 xl:my-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-400/20 ring-1 ring-blue-200/20">
            <Sparkles size={27} className="text-blue-200" />
          </div>

          <h2 className="max-w-sm text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
            Welcome
            <br />
            <span className="text-blue-300">back!</span>
          </h2>

          <p className="mt-4 max-w-sm text-sm leading-6 text-blue-100/80">
            Continue solving coding challenges, sharpen your problem-solving
            skills, and keep moving toward your goals.
          </p>

          <div className="mt-6 space-y-3">
            {[
              "Continue your coding practice",
              "Track your progress",
              "Prepare for technical interviews",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-sm text-blue-50"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                  ✓
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-2 border-t border-white/15 pt-4 text-xs text-blue-200/80">
          <ShieldCheck size={16} />
          Your next coding challenge awaits
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-5 xl:p-7">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="mb-5 lg:hidden">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25">
              <Code2 size={26} />
            </div>

            <h1 className="mt-2 text-center text-2xl font-extrabold tracking-tight text-slate-900">
              CodeCrag
            </h1>
          </div>

          {/* Heading */}
          <div className="mb-5">
            <p className="mb-1.5 text-xs font-semibold text-blue-600">
              WELCOME BACK
            </p>

            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Sign in
            </h2>

            <p className="mt-2 text-sm leading-5 text-slate-500">
              Enter your credentials to access your coding workspace.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {typeof error === "string"
                ? error
                : error.message || "Unable to log in. Please try again."}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

            {/* Email */}
            <div>
              <label
                htmlFor="emailId"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <div
                className={`flex items-center rounded-xl border bg-white transition focus-within:ring-4 ${
                  errors.emailId
                    ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100"
                    : "border-slate-200 focus-within:border-blue-500 focus-within:ring-blue-100"
                }`}
              >
                <Mail size={18} className="ml-4 shrink-0 text-slate-400" />

                <input
                  id="emailId"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl bg-transparent px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  {...register("emailId")}
                />
              </div>

              {errors.emailId && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {errors.emailId.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div
                className={`flex items-center rounded-xl border bg-white transition focus-within:ring-4 ${
                  errors.password
                    ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100"
                    : "border-slate-200 focus-within:border-blue-500 focus-within:ring-blue-100"
                }`}
              >
                <LockKeyhole
                  size={18}
                  className="ml-4 shrink-0 text-slate-400"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl bg-transparent px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="mr-3 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Login to your account
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* Signup Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">NEW HERE?</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Signup Link */}
          <p className="text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <NavLink
              to="/signup"
              className="font-bold text-blue-600 transition hover:text-indigo-700"
            >
              Create account
            </NavLink>
          </p>

          {/* Footer */}
          <p className="mt-4 text-center text-xs leading-5 text-slate-400">
            Log in to continue practicing and track your coding progress.
          </p>
        </div>
      </div>
    </div>
  </div>
);

}

export default Login;
