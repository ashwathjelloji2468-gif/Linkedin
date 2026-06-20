import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import { loginUser } from "@/config/redux/action/authAction";
import { reset } from "@/config/redux/reducer/authReducer";
import api from "@/config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Forgot Password flow states
  const [mode, setMode] = useState("login"); // "login", "forgot", "reset"
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [clientError, setClientError] = useState("");
  const [clientSuccess, setClientSuccess] = useState("");
  const [isLoadingForgot, setIsLoadingForgot] = useState(false);
  const [mockCode, setMockCode] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess || user) {
      router.push("/");
    }
  }, [isSuccess, user, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setClientError("");
    setClientSuccess("");
    setIsLoadingForgot(true);
    try {
      const res = await api.post("/users/forgot-password", { email: forgotEmail.trim() });
      setMockCode(res.data?.code || "");
      setClientSuccess("Verification code generated successfully!");
      // Automatically advance to reset page after a brief delay so they see the success message
      setTimeout(() => {
        setMode("reset");
      }, 1000);
    } catch (err) {
      setClientError(err.response?.data?.message || "Failed to generate reset code");
    } finally {
      setIsLoadingForgot(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !resetCode.trim() || !newPassword.trim()) {
      setClientError("Please fill out all fields");
      return;
    }
    setClientError("");
    setClientSuccess("");
    setIsLoadingForgot(true);
    try {
      const res = await api.post("/users/reset-password", {
        email: forgotEmail.trim(),
        code: resetCode.trim(),
        newPassword: newPassword.trim(),
      });
      setClientSuccess(res.data?.message || "Password reset successfully!");
      // Reset form fields
      setResetCode("");
      setNewPassword("");
      setForgotEmail("");
      setMockCode("");
      // Transition back to login after 1.5 seconds
      setTimeout(() => {
        setMode("login");
        setClientSuccess("");
      }, 1500);
    } catch (err) {
      setClientError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoadingForgot(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4">
        {/* Header Logo */}
        <div className="mb-6 flex items-center justify-center gap-1.5">
          <svg className="w-10 h-10 text-[#0077b5]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
          <span className="text-2xl font-bold tracking-tight text-slate-800">
            Linked<span className="text-[#0077b5]">In</span>
          </span>
        </div>

        {/* Card Body */}
        <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-xl w-full max-w-md transition-all duration-300">
          {mode === "login" && (
            <>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign in</h1>
              <p className="text-slate-500 text-xs mb-6">Stay updated on your professional world</p>

              {isError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-semibold mb-4 border border-red-200 shadow-sm">
                  {message?.message || message || "Invalid credentials"}
                </div>
              )}
              {clientSuccess && (
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-xs font-semibold mb-4 border border-emerald-200 shadow-sm">
                  {clientSuccess}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] focus:border-[#0077b5] text-slate-800 placeholder-slate-400"
                    placeholder="Email address"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] focus:border-[#0077b5] text-slate-800 placeholder-slate-400"
                    placeholder="Password"
                  />
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email); // prefill if they typed it
                      setMode("forgot");
                      setClientError("");
                      setClientSuccess("");
                    }}
                    className="text-xs text-[#0077b5] font-semibold hover:underline cursor-pointer focus:outline-none"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 bg-[#0077b5] hover:bg-sky-800 text-white font-semibold py-2.5 rounded-full text-sm transition-all shadow-md focus:outline-none flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              <div className="mt-8 text-center text-xs text-slate-500">
                New to LinkedIn?{" "}
                <Link href="/register" className="text-[#0077b5] font-semibold hover:underline">
                  Join now
                </Link>
              </div>
            </>
          )}

          {mode === "forgot" && (
            <>
              <h1 className="text-xl font-bold text-slate-900 mb-1">Forgot password</h1>
              <p className="text-slate-500 text-xs mb-6">Reset your password in two quick steps</p>

              {clientError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-semibold mb-4 border border-red-200 shadow-sm">
                  {clientError}
                </div>
              )}
              {clientSuccess && (
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-xs font-semibold mb-4 border border-emerald-200 shadow-sm">
                  {clientSuccess}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="forgotEmail">
                    Email address
                  </label>
                  <input
                    id="forgotEmail"
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] focus:border-[#0077b5] text-slate-800 placeholder-slate-400"
                    placeholder="E.g. alex@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoadingForgot}
                  className="mt-2 bg-[#0077b5] hover:bg-sky-800 text-white font-semibold py-2.5 rounded-full text-sm transition-all shadow-md focus:outline-none flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoadingForgot ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Sending code...</span>
                    </>
                  ) : (
                    "Send reset code"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setClientError("");
                    setClientSuccess("");
                  }}
                  className="bg-white hover:bg-slate-50 text-[#0077b5] border border-[#0077b5] font-semibold py-2.5 rounded-full text-sm transition-all focus:outline-none cursor-pointer text-center"
                >
                  Back to Sign In
                </button>
              </form>
            </>
          )}

          {mode === "reset" && (
            <>
              <h1 className="text-xl font-bold text-slate-900 mb-1">Reset password</h1>
              <p className="text-slate-500 text-xs mb-6">Enter the 6-digit verification code and your new password</p>

              {clientError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-semibold mb-4 border border-red-200 shadow-sm">
                  {clientError}
                </div>
              )}
              {clientSuccess && (
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-xs font-semibold mb-4 border border-emerald-200 shadow-sm">
                  {clientSuccess}
                </div>
              )}

              {mockCode && (
                <div className="bg-sky-50 text-[#0077b5] p-3 rounded-lg text-xs font-bold mb-4 border border-sky-200 shadow-sm flex flex-col gap-1">
                  <span>✉️ Mock Email Server Code:</span>
                  <span className="text-base tracking-widest text-slate-800 font-mono text-center select-all bg-white py-1.5 border border-sky-100 rounded mt-1">
                    {mockCode}
                  </span>
                  <span className="text-[9px] font-normal text-slate-500 mt-0.5 text-center">
                    (Click above to copy the code for quick testing)
                  </span>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="resetCode">
                    6-Digit Verification Code
                  </label>
                  <input
                    id="resetCode"
                    type="text"
                    required
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full border border-slate-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] focus:border-[#0077b5] text-slate-800 placeholder-slate-400 font-mono text-center tracking-widest text-lg"
                    placeholder="E.g. 123456"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="newPassword">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] focus:border-[#0077b5] text-slate-800 placeholder-slate-400"
                    placeholder="New password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoadingForgot}
                  className="mt-2 bg-[#0077b5] hover:bg-sky-800 text-white font-semibold py-2.5 rounded-full text-sm transition-all shadow-md focus:outline-none flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoadingForgot ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Resetting password...</span>
                    </>
                  ) : (
                    "Reset password"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setClientError("");
                    setClientSuccess("");
                    setMockCode("");
                  }}
                  className="bg-white hover:bg-slate-50 text-[#0077b5] border border-[#0077b5] font-semibold py-2.5 rounded-full text-sm transition-all focus:outline-none cursor-pointer text-center"
                >
                  Cancel
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
