import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { logout } from "@/config/redux/reducer/authReducer";
import { API_BASE_URL } from "@/config";

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23 9v2h-2v10a1 1 0 0 1-1 1h-4v-6h-4v6H6a1 1 0 0 1-1-1V11H3V9l9-7 9 7zm-11-4.75L5.75 9H7v11h3v-6h4v6h3V9h1.25L12 4.25z" />
        </svg>
      ),
    },
    {
      label: "My Network",
      href: "/network",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 8c3.67 0 11 1.84 11 5.5V24H1v-2.5c0-3.66 7.33-5.5 11-5.5zm0 1.9c-2.99 0-7.79 1.4-8.9 2.1v.5h17.8v-.5c-1.11-.7-5.91-2.1-8.9-2.1z" />
        </svg>
      ),
    },
    {
      label: "Jobs",
      href: "/jobs",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
        </svg>
      ),
    },
    {
      label: "Messages",
      href: "/messages",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
        </svg>
      ),
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Left Section: Logo & Search */}
        <div className="flex items-center gap-2 flex-grow md:flex-grow-0">
          <Link href="/" className="flex items-center">
            <svg className="w-9 h-9 text-[#0077b5]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </Link>
          <div className="relative hidden md:block">
            <input
              className="bg-[#edf3f8] text-slate-800 text-sm border-0 rounded px-9 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-[#0077b5] focus:bg-white placeholder-slate-500 transition-all"
              placeholder="Search"
            />
            <svg
              className="w-4 h-4 text-slate-500 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Right Section: Navigation & Profile */}
        <nav className="flex items-center gap-6 md:gap-8 h-full">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center text-xs h-full min-w-[64px] border-b-2 transition-all ${
                  isActive
                    ? "border-[#0077b5] text-slate-900 font-semibold"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {item.icon}
                <span className="hidden sm:inline mt-1 text-[10px]">{item.label}</span>
              </Link>
            );
          })}

          {/* Profile Dropdown */}
          <div className="relative h-full flex items-center" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-900 h-full border-b-2 border-transparent focus:outline-none"
            >
              {user?.profilePicture ? (
                <img
                  src={`${API_BASE_URL}/uploads/${user.profilePicture.replace("uploads/", "")}`}
                  alt="avatar"
                  className="w-6 h-6 rounded-full object-cover border border-slate-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "";
                  }}
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-[10px]">
                  {getInitials(user?.name)}
                </div>
              )}
              <span className="hidden sm:inline mt-1 text-[10px] flex items-center gap-1">
                Me
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-14 bg-white rounded-lg border border-slate-200 shadow-lg py-3 w-64 text-sm text-slate-800 animate-in fade-in slide-in-from-top-2 duration-100">
                <div className="px-4 pb-3 border-b border-slate-100 flex items-center gap-3">
                  {user?.profilePicture ? (
                    <img
                      src={`${API_BASE_URL}/uploads/${user.profilePicture.replace("uploads/", "")}`}
                      alt="avatar"
                      className="w-12 h-12 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-lg">
                      {getInitials(user?.name)}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <div className="font-semibold text-slate-900 truncate">{user?.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user?.headline || "No headline"}</div>
                  </div>
                </div>

                <div className="py-2">
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-50 text-[#0077b5] font-semibold text-xs border border-transparent rounded-full mx-4 my-1 text-center"
                    style={{ border: "1px solid #0077b5" }}
                  >
                    View Profile
                  </Link>
                </div>

                <div className="border-t border-slate-100 pt-2 px-4">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-slate-500 hover:text-slate-900 py-1 hover:underline font-medium text-xs"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
