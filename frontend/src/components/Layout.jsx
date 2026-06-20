import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { fetchUserProfile } from "@/config/redux/action/authAction";
import Header from "./Header";
import FloatingMessaging from "./FloatingMessaging";

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, profileFetching } = useSelector((state) => state.auth);

  const isAuthPage = router.pathname === "/login" || router.pathname === "/register";

  useEffect(() => {
    // Attempt to load the user profile if there's a token
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!profileFetching) {
      if (!token && !isAuthPage) {
        router.push("/login");
      } else if (token && isAuthPage) {
        router.push("/");
      }
    }
  }, [user, profileFetching, router.pathname, isAuthPage]);

  // If loading the profile, show a loading spinner
  if (profileFetching && !isAuthPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f2ee]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0077b5]"></div>
          <span className="mt-4 text-sm font-medium text-slate-500 animate-pulse">Loading LinkedIn...</span>
        </div>
      </div>
    );
  }

  // If not logged in and trying to access a protected page, don't render children (we are redirecting to login)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token && !isAuthPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f2ee]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0077b5]"></div>
          <span className="mt-4 text-sm font-medium text-slate-500 animate-pulse">Redirecting to sign in...</span>
        </div>
      </div>
    );
  }

  // If it's an auth page, render without header/layout
  if (isAuthPage) {
    return <div className="min-h-screen bg-[#f4f2ee]">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f2ee] text-[#0f172a]">
      <Header />
      <main className="max-w-6xl mx-auto w-full px-4 py-6 flex-grow">
        {children}
      </main>
      <FloatingMessaging />
    </div>
  );
}
