import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Layout from "@/components/Layout";
import api from "@/config";
import { fetchUserProfile } from "@/config/redux/action/authAction";

export default function Discover() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [loadingAction, setLoadingAction] = useState({});

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const groups = [
    { name: "Web Developers India", members: "125K members", desc: "A community of web developers building the future of the internet in India." },
    { name: "AI Agents Community", members: "45K members", desc: "Discussing agentic models, LLMs, memory architectures, and cognitive workflows." },
    { name: "CBIT Alumni Association", members: "12K members", desc: "Official networking group for Chaitanya Bharathi Institute of Technology alumni." }
  ];

  const newsletters = [
    { name: "The Agentic Era", subscribers: "32K subscribers", desc: "Weekly updates on autonomous software agents and AI developer tooling." },
    { name: "Accelerated Computing", subscribers: "58K subscribers", desc: "NVIDIA news, CUDA tutorials, and GPU infrastructure architecture insights." },
    { name: "Frontier Models Weekly", subscribers: "19K subscribers", desc: "Breaking down the latest research papers and releases from OpenAI, Meta, and Google." }
  ];

  const pages = [
    { name: "Satya Nadella", followers: "12M followers", desc: "CEO at Microsoft. Sharing thoughts on the future of AI, developer platforms, and Azure." },
    { name: "Google", followers: "24M followers", desc: "Organizing the world's information and making it universally accessible and useful." },
    { name: "Microsoft", followers: "20M followers", desc: "Empowering every person and organization on the planet to achieve more." },
    { name: "NVIDIA", followers: "8M followers", desc: "The pioneer of accelerated computing. Building the engine of the AI industrial revolution." }
  ];

  const handleToggleAction = async (type, name, isFollowingOrJoined) => {
    const key = `${type}-${name}`;
    setLoadingAction(prev => ({ ...prev, [key]: true }));
    try {
      let action = "";
      if (type === "group") {
        action = isFollowingOrJoined ? "leave" : "join";
      } else {
        action = isFollowingOrJoined ? "unfollow" : "follow";
      }

      await api.put("/users/update-discover", { type, name, action });
      dispatch(fetchUserProfile());
    } catch (err) {
      console.error("Failed to update discover settings:", err.message);
    } finally {
      setLoadingAction(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto flex flex-col gap-6 font-sans text-left select-none">
        
        {/* Header card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#0077b5] transition-colors mb-2 w-fit cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home Feed</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Discover More</h1>
          <p className="text-xs text-slate-500 font-medium">
            Explore recommended groups, newsletters, and company pages based on your CBL/CBIT education profile and software engineering skills.
          </p>
        </div>

        {/* 1. Groups Section */}
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-sm text-slate-800 uppercase tracking-wider pl-1">Recommended Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {groups.map((group) => {
              const isJoined = user?.joinedGroups?.includes(group.name);
              const key = `group-${group.name}`;
              return (
                <div key={group.name} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-between h-44">
                  <div>
                    <span className="font-bold text-xs text-slate-800 block truncate">{group.name}</span>
                    <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{group.members}</span>
                    <p className="text-[10px] text-slate-500 mt-2 line-clamp-3 leading-relaxed font-medium">
                      {group.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleAction("group", group.name, isJoined)}
                    disabled={loadingAction[key]}
                    className={`w-full py-1.5 rounded-full text-xs font-bold transition-all focus:outline-none cursor-pointer mt-3 text-center ${
                      isJoined
                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        : "border border-[#0077b5] text-[#0077b5] hover:bg-sky-50"
                    }`}
                  >
                    {loadingAction[key] ? "..." : (isJoined ? "Leave Group" : "Join Group")}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Newsletters Section */}
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-sm text-slate-800 uppercase tracking-wider pl-1">Recommended Newsletters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {newsletters.map((nl) => {
              const isSubscribed = user?.followedNewsletters?.includes(nl.name);
              const key = `newsletter-${nl.name}`;
              return (
                <div key={nl.name} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-between h-44">
                  <div>
                    <span className="font-bold text-xs text-slate-800 block truncate">{nl.name}</span>
                    <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{nl.subscribers}</span>
                    <p className="text-[10px] text-slate-500 mt-2 line-clamp-3 leading-relaxed font-medium">
                      {nl.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleAction("newsletter", nl.name, isSubscribed)}
                    disabled={loadingAction[key]}
                    className={`w-full py-1.5 rounded-full text-xs font-bold transition-all focus:outline-none cursor-pointer mt-3 text-center ${
                      isSubscribed
                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        : "border border-[#0077b5] text-[#0077b5] hover:bg-sky-50"
                    }`}
                  >
                    {loadingAction[key] ? "..." : (isSubscribed ? "Unsubscribe" : "Subscribe")}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Pages Section */}
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-sm text-slate-800 uppercase tracking-wider pl-1">Recommended Pages to Follow</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pages.map((page) => {
              const isFollowing = user?.followedPages?.includes(page.name);
              const key = `page-${page.name}`;
              return (
                <div key={page.name} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-xs text-slate-800 block truncate">{page.name}</span>
                    <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{page.followers}</span>
                    <p className="text-[10px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                      {page.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleAction("page", page.name, isFollowing)}
                    disabled={loadingAction[key]}
                    className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all focus:outline-none cursor-pointer flex-shrink-0 text-center ${
                      isFollowing
                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        : "border border-[#0077b5] text-[#0077b5] hover:bg-sky-50"
                    }`}
                  >
                    {loadingAction[key] ? "..." : (isFollowing ? "Following" : "Follow")}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </Layout>
  );
}
