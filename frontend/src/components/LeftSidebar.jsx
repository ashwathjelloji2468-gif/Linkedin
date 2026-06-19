import { useSelector } from "react-redux";
import Link from "next/link";
import { API_BASE_URL } from "@/config";

export default function LeftSidebar() {
  const { user } = useSelector((state) => state.auth);

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
    <div className="flex flex-col gap-3">
      {/* Profile Card Widget */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="h-14 bg-gradient-to-r from-sky-700 to-[#0077b5]"></div>
        
        {/* Profile Info */}
        <div className="px-4 pb-4 flex flex-col items-center border-b border-slate-200 relative">
          {/* Avatar Container */}
          <div className="w-16 h-16 rounded-full overflow-hidden absolute -top-8 border-2 border-white shadow-sm bg-white flex items-center justify-center">
            {user?.profilePicture ? (
              <img
                src={`${API_BASE_URL}/uploads/${user.profilePicture.replace("uploads/", "")}`}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-xl">
                {getInitials(user?.name)}
              </div>
            )}
          </div>

          <div className="mt-10 text-center w-full">
            <Link href="/profile" className="font-semibold text-slate-900 hover:underline block truncate">
              {user?.name || "Welcome!"}
            </Link>
            <span className="text-xs text-slate-500 block mt-1 truncate">
              {user?.headline || "No headline yet"}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="p-3 border-b border-slate-200">
          <Link href="/network" className="flex items-center justify-between text-xs hover:bg-slate-50 p-1.5 rounded transition-all">
            <div className="flex flex-col">
              <span className="text-slate-500 font-medium">Connections</span>
              <span className="text-slate-900 font-semibold">Grow your network</span>
            </div>
            <span className="text-[#0077b5] font-bold">{user?.connections?.length || 0}</span>
          </Link>
        </div>

        {/* My Items */}
        <div className="p-3 hover:bg-slate-50 transition-all">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
            </svg>
            <span>Saved items</span>
          </div>
        </div>
      </div>

      {/* Quick Access Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hidden md:block">
        <span className="text-xs font-semibold text-slate-500 block mb-2">Recent</span>
        <ul className="text-xs font-semibold text-slate-600 space-y-2">
          <li className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded cursor-pointer">
            <span className="text-[#0077b5]">#</span> javascript
          </li>
          <li className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded cursor-pointer">
            <span className="text-[#0077b5]">#</span> reactjs
          </li>
          <li className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded cursor-pointer">
            <span className="text-[#0077b5]">#</span> careerdevelopment
          </li>
        </ul>
        <div className="border-t border-slate-100 mt-3 pt-2 text-center">
          <span className="text-xs font-semibold text-[#0077b5] hover:underline cursor-pointer">
            Discover more
          </span>
        </div>
      </div>
    </div>
  );
}
