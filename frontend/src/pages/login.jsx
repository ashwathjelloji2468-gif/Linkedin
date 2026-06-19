import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import { loginUser } from "@/config/redux/action/authAction";
import { reset } from "@/config/redux/reducer/authReducer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign in</h1>
          <p className="text-slate-500 text-xs mb-6">Stay updated on your professional world</p>

          {isError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-semibold mb-4 border border-red-200 shadow-sm">
              {message?.message || message || "Invalid credentials"}
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
        </div>
      </div>
    </Layout>
  );
}
