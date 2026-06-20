import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { logout } from "@/config/redux/reducer/authReducer";
import { API_BASE_URL } from "@/config";
import api from "@/config";

export default function Header() {
  const { user, connectionRequests = [] } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  
  // Search states
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const searchRef = useRef(null);

  const posts = useSelector((state) => state.posts?.items || []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await api.get("/users/all-users");
        setAllUsers(res.data?.users || []);
      } catch (err) {
        console.error("Failed to load users for search:", err.message);
      }
    };
    if (user) {
      loadUsers();
    }
  }, [user]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Satya Nadella accepted your connection request.", time: "2h ago", unread: true },
    { id: 2, text: "Sundar Pichai viewed your profile.", time: "4h ago", unread: true },
    { id: 3, text: "Elon Musk liked your post.", time: "1d ago", unread: false },
    { id: 4, text: "Your job application to AST SpaceMobile was received.", time: "2d ago", unread: false },
    { id: 5, text: "Sam Altman sent you a message.", time: "3d ago", unread: false }
  ]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setShowDropdown(false);
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const filteredUsers = searchQuery.trim()
    ? allUsers.filter(u =>
        u._id !== user?._id && u.id !== user?._id &&
        (u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         u.headline?.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 3)
    : [];

  const filteredPosts = searchQuery.trim()
    ? posts.filter(p =>
        p.body?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

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
      badge: connectionRequests?.length || 1,
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
      label: "Messaging",
      href: "/messages",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
        </svg>
      ),
    },
    {
      label: "Notifications",
      href: "#",
      badge: notifications.filter(n => n.unread).length || 1,
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
        </svg>
      ),
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm h-14 select-none">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-full">
        {/* Left Section: Logo & Search */}
        <div className="flex items-center gap-2 flex-grow md:flex-grow-0">
          <Link href="/" className="flex items-center">
            <svg className="w-9 h-9 text-[#0077b5]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </Link>
          <div className="relative hidden md:block" ref={searchRef}>
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowDropdown(true)}
              className="bg-[#edf3f8] text-slate-800 text-sm border-0 rounded-full px-9 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white placeholder-slate-500 transition-all font-sans"
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

            {/* Real-time search dropdown */}
            {showDropdown && searchQuery.trim() && (
              <div className="absolute left-0 top-11 bg-white border border-slate-200 shadow-2xl rounded-lg py-3 w-[450px] z-50 text-left flex flex-col gap-2.5 max-h-[380px] overflow-y-auto animate-in fade-in duration-100 select-none">
                {/* People section */}
                <div className="px-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">People</h4>
                  {filteredUsers.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {filteredUsers.map((u) => {
                        const isConnected = user?.connections?.includes(u._id) || user?.connections?.includes(u.id);
                        return (
                          <div key={u._id} className="flex items-center justify-between gap-3 hover:bg-slate-55 p-1.5 rounded transition-all">
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              {u.profilePicture ? (
                                <img
                                  src={`${API_BASE_URL}/uploads/${u.profilePicture.replace("uploads/", "")}`}
                                  alt={u.name}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-100"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-xs">
                                  {getInitials(u.name)}
                                </div>
                              )}
                              <div className="truncate text-left">
                                <span className="font-bold text-xs text-slate-800 block leading-tight">{u.name}</span>
                                <span className="text-[10px] text-slate-500 block truncate mt-0.5">{u.headline}</span>
                              </div>
                            </div>
                            <button
                              onClick={async () => {
                                if (isConnected) {
                                  router.push(`/messages?chatWith=${u._id}`);
                                } else {
                                  try {
                                    await api.post(`/users/user/send_connection_request/${u._id}`);
                                    alert(`Connection request sent to ${u.name}!`);
                                  } catch (err) {
                                    alert(err.response?.data?.message || "Failed to send request");
                                  }
                                }
                                setShowDropdown(false);
                              }}
                              className="px-3 py-1 rounded-full text-[10px] font-bold border border-[#0077b5] text-[#0077b5] hover:bg-sky-50 transition-all focus:outline-none cursor-pointer"
                            >
                              {isConnected ? "Message" : "Connect"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 block italic pl-1">No matching people</span>
                  )}
                </div>

                <div className="border-t border-slate-100"></div>

                {/* Posts section */}
                <div className="px-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Posts</h4>
                  {filteredPosts.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {filteredPosts.map((p) => (
                        <div
                          key={p._id}
                          onClick={() => {
                            setSelectedPost(p);
                            setShowDropdown(false);
                          }}
                          className="hover:bg-slate-50 p-2 rounded cursor-pointer transition-all border border-slate-50 text-left"
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="font-bold text-[10px] text-slate-700">{p.userId?.name || "LinkedIn Member"}</span>
                            <span className="text-[8px] text-slate-400">• {new Date(p.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-[10px] text-slate-600 line-clamp-2 leading-relaxed">
                            {p.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 block italic pl-1">No matching posts</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Navigation & Profile */}
        <nav className="flex items-center gap-3 md:gap-4 lg:gap-5 h-full">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;

            if (item.label === "Notifications") {
              return (
                <div key={item.label} className="relative h-full flex items-center" ref={notificationsRef}>
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="flex flex-col items-center justify-center text-xs h-full min-w-[64px] border-b-2 border-transparent text-slate-550 hover:text-slate-900 transition-all focus:outline-none cursor-pointer"
                  >
                    <div className="relative flex items-center justify-center">
                      {item.icon}
                      {item.badge && item.badge > 0 ? (
                        <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full text-[9px] font-bold min-w-4 h-4 px-1 flex items-center justify-center border border-white">
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                    <span className="hidden sm:inline mt-1 text-[10px]">{item.label}</span>
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 top-14 bg-white rounded-lg border border-slate-200 shadow-lg py-2 w-80 text-xs text-slate-800 animate-in fade-in slide-in-from-top-2 duration-100 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 font-bold text-slate-900 flex justify-between items-center">
                        <span>Notifications</span>
                        <button
                          onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                          className="text-[10px] text-[#0077b5] hover:underline font-semibold focus:outline-none cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`px-4 py-3 flex gap-2.5 items-start hover:bg-slate-50 transition-colors cursor-pointer ${
                              n.unread ? "bg-blue-50/20" : ""
                            }`}
                            onClick={() => {
                              setNotifications(notifications.map(item => item.id === n.id ? { ...item, unread: false } : item));
                            }}
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"
                              style={{ visibility: n.unread ? "visible" : "hidden" }}
                            ></div>
                            <div className="flex-grow">
                              <p className="text-slate-700 leading-snug font-medium text-left">{n.text}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block text-left font-medium">{n.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center text-xs h-full min-w-[64px] border-b-2 transition-all relative ${
                  isActive
                    ? "border-slate-950 text-slate-955 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <div className="relative flex items-center justify-center">
                  {item.icon}
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full text-[9px] font-bold min-w-4 h-4 px-1 flex items-center justify-center border border-white">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="hidden sm:inline mt-1 text-[10px]">{item.label}</span>
              </Link>
            );
          })}

          {/* Profile Dropdown */}
          <div className="relative h-full flex items-center" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-900 h-full border-b-2 border-transparent focus:outline-none min-w-[64px]"
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
              <span className="hidden sm:inline mt-1 text-[10px] flex items-center gap-0.5">
                Me
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-14 bg-white rounded-lg border border-slate-200 shadow-lg py-3 w-64 text-sm text-slate-800 animate-in fade-in slide-in-from-top-2 duration-100 z-50">
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
                  <div className="overflow-hidden text-left">
                    <div className="font-semibold text-slate-900 truncate">{user?.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user?.headline || "No headline"}</div>
                  </div>
                </div>

                <div className="py-2 text-left">
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-55 hover:text-sky-800 text-[#0077b5] font-semibold text-xs border border-transparent rounded-full mx-4 my-1 text-center"
                    style={{ border: "1px solid #0077b5" }}
                  >
                    View Profile
                  </Link>
                </div>

                <div className="border-t border-slate-100 pt-2 px-4 text-left">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-slate-550 hover:text-slate-900 py-1 hover:underline font-medium text-xs cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Vertical Separator */}
          <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

          {/* For Business */}
          <a
            href="https://www.linkedin.com/business/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex flex-col items-center justify-center text-xs h-full min-w-[64px] border-b-2 border-transparent text-slate-500 hover:text-slate-900 transition-all"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z" />
            </svg>
            <span className="mt-1 text-[10px] flex items-center gap-0.5 whitespace-nowrap">
              For Business
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </a>

          {/* Advertise */}
          <a
            href="https://www.linkedin.com/talent-solutions/recruiting-solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex flex-col items-center justify-center text-xs h-full min-w-[64px] border-b-2 border-transparent text-slate-550 hover:text-slate-900 transition-all"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 12c0-1.1.9-2 2-2V8c-1.1 0-2-.9-2-2h-2c0 1.1-.9 2-2 2v2c1.1 0 2 .9 2 2s-.9 2-2 2v2c1.1 0 2 .9 2 2h2c0-1.1.9-2 2-2v-2c-1.1 0-2-.9-2-2zm-10 6.5h-3L3.5 14H2c-1.1 0-2-.9-2-2s.9-2 2-2h1.5L7 6.5h3c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5zM15 12c0-1.93-1.07-3.61-2.67-4.47v8.94c1.6-.86 2.67-2.54 2.67-4.47z" />
            </svg>
            <span className="mt-1 text-[10px]">Advertise</span>
          </a>
        </nav>
      </div>

      {/* Selected Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-xl overflow-hidden shadow-2xl p-6 border border-slate-200 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150 text-left select-none">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <span>📄</span>
                <span>Post Detail</span>
              </h3>
              <button onClick={() => setSelectedPost(null)} className="text-slate-400 hover:bg-slate-100 p-1 rounded-full cursor-pointer focus:outline-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-grow flex flex-col gap-4 pr-1">
              <div className="flex gap-2.5 items-start">
                {selectedPost.userId?.profilePicture ? (
                  <img
                    src={`${API_BASE_URL}/uploads/${selectedPost.userId.profilePicture.replace("uploads/", "")}`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-sm">
                    {getInitials(selectedPost.userId?.name)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-xs text-slate-900 leading-tight">{selectedPost.userId?.name}</h4>
                  <span className="text-[10px] text-slate-500 block leading-snug mt-0.5">{selectedPost.userId?.headline}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">{new Date(selectedPost.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                {selectedPost.body}
              </div>

              {selectedPost.media && (
                <div className="rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                  <img
                    src={`${API_BASE_URL}/uploads/${selectedPost.media.replace("uploads/", "")}`}
                    alt="post media"
                    className="max-h-[300px] w-full object-contain mx-auto"
                  />
                </div>
              )}

              {/* Likes & Comments Count */}
              <div className="flex items-center justify-between text-[10px] text-slate-450 font-bold border-b border-slate-100 pb-2">
                <span>👍 {selectedPost.likesCount || 0} likes</span>
                <span>💬 {selectedPost.comments?.length || 0} comments</span>
              </div>

              {/* Comments list */}
              {selectedPost.comments?.length > 0 && (
                <div className="flex flex-col gap-2 mt-1">
                  <h5 className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Comments</h5>
                  <div className="flex flex-col gap-2.5">
                    {selectedPost.comments.map((c, i) => (
                      <div key={i} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex gap-2">
                        <div className="flex-grow">
                          <span className="font-bold text-slate-800 text-[10px]">{c.userId?.name || c.name || "LinkedIn Member"}</span>
                          <p className="text-[10px] text-slate-650 leading-relaxed mt-0.5">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
