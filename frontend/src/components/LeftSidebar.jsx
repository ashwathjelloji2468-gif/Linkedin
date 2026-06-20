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
        <div className="h-14 bg-gradient-to-r from-sky-700 to-[#0077b5] overflow-hidden">
          {user?.bannerPicture && (
            <img
              src={`${API_BASE_URL}/uploads/${user.bannerPicture.replace("uploads/", "")}`}
              alt="profile banner"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
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
            <Link href="/profile" className="font-semibold text-slate-900 hover:underline flex items-center justify-center gap-1.5 truncate max-w-full">
              <span>{user?.name || "Welcome!"}</span>
              {/* Shield-Check verified badge */}
              <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 inline-block align-middle" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0c-.2 0-.3.1-.4.2C6.7 1.2 5.1 2 3 2c-.6 0-1 .4-1 1v4.7c0 4.1 2.9 7 5.7 8.1.2.1.4.1.6 0 2.8-1.1 5.7-4 5.7-8.1V3c0-.6-.4-1-1-1-2.1 0-3.7-.8-4.6-1.8C8.3.1 8.2 0 8 0zm2.2 6.7L7.5 9.4 5.8 7.7a.8.8 0 1 0-1.1 1.1l2.2 2.2c.3.3.8.3 1.1 0l3.3-3.3a.8.8 0 1 0-1.1-1.1z"/>
              </svg>
            </Link>
            <span className="text-[11px] text-slate-500 block mt-1 leading-snug line-clamp-2">
              {user?.headline || "🎓 Student at Chaitanya Bharathi Institute of Technology | Secunderabad, Telangana"}
            </span>

            {/* School Row */}
            <div className="flex items-center justify-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100 w-full text-left">
              <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200">
                <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 13c-2.76 0-5-2.24-5-5 0-.58.1-1.14.29-1.66l4.21 2.3c.16.08.33.12.5.12.17 0 .34-.04.5-.12l4.21-2.3c.19.52.29 1.08.29 1.66 0 2.76-2.24 5-5 5z" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-slate-700 leading-tight hover:underline cursor-pointer line-clamp-2">
                Chaitanya Bharathi Institute of Technology
              </span>
            </div>
          </div>
        </div>

        {/* Premium Promo section */}
        <div className="p-3 border-b border-slate-200 hover:bg-slate-50 transition-all text-left">
          <Link href="/premium" className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-550 leading-snug">
              Get 4x more recruiter views on average with AI tools
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 bg-amber-500 rounded flex-shrink-0 flex items-center justify-center text-[9px] font-extrabold text-slate-900 shadow-sm">
                IN
              </div>
              <span className="text-[10px] font-bold text-slate-800 hover:text-[#0077b5] underline decoration-amber-600 decoration-1">
                Try Premium for ₹0
              </span>
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="p-3 border-b border-slate-200 text-[11px] text-slate-500 font-medium text-left">
          <Link href="/profile" className="flex items-center justify-between hover:bg-slate-50 p-1 rounded transition-all">
            <span>Profile viewers</span>
            <span className="text-[#0077b5] font-bold">37</span>
          </Link>
          <Link href="/profile" className="flex items-center justify-between hover:bg-slate-50 p-1 rounded transition-all mt-1">
            <span>Post impressions</span>
            <span className="text-[#0077b5] font-bold">123</span>
          </Link>
        </div>

        {/* Secondary Links list */}
        <div className="p-3 text-[11px] font-bold text-slate-600 flex flex-col gap-2.5 text-left">
          <Link href="/jobs?tab=applied" className="flex items-center gap-2 hover:text-[#0077b5] transition-colors">
            <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
            </svg>
            <span>Saved items</span>
          </Link>
          <Link href="/network" className="flex items-center gap-2 hover:text-[#0077b5] transition-colors">
            <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            <span>Groups</span>
          </Link>
          <Link href="#" className="flex items-center gap-2 hover:text-[#0077b5] transition-colors">
            <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
            <span>Newsletters</span>
          </Link>
          <Link href="#" className="flex items-center gap-2 hover:text-[#0077b5] transition-colors">
            <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" />
            </svg>
            <span>Events</span>
          </Link>
        </div>
      </div>

      {/* Quick Access Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hidden md:block">
        <span className="text-xs font-semibold text-slate-500 block mb-2 text-left">Recent</span>
        <ul className="text-xs font-semibold text-slate-655 space-y-2 text-left">
          <li className="flex items-center gap-2 hover:bg-slate-5	0 p-1 rounded cursor-pointer">
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
          <Link href="/discover" className="text-xs font-semibold text-[#0077b5] hover:underline cursor-pointer">
            Discover more
          </Link>
        </div>
      </div>
    </div>
  );
}
