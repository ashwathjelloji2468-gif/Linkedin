import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Layout from "@/components/Layout";
import { fetchUserProfile } from "@/config/redux/action/authAction";
import { getImageUrl } from "@/config";
import api from "@/config";

const NEWSLETTERS_DATA = [
  {
    name: "JavaScript Weekly",
    publisher: "Software Engineering Digest",
    subscribers: "1,240,500 subscribers",
    description: "A weekly round-up of the best JavaScript tutorials, articles, tools, and releases. Keep your JS skills sharp and modern.",
    logo: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=150&auto=format&fit=crop&q=60",
    latestArticleTitle: "Understanding React 19 Server Actions & Transitions",
    latestArticleContent: "React 19 introduces native support for Async Transitions and Server Actions. This issue dives deep into how you can perform data mutations and state updates seamlessly without writing complex loading state variables. Learn about the new useActionState hook, how it handles validation, pending states, and error messages automatically. We also provide step-by-step code samples comparing old patterns to the new server-assisted actions."
  },
  {
    name: "AI & ML Deep Dive",
    publisher: "CognitiveTech Press",
    subscribers: "890,200 subscribers",
    description: "Weekly expert analysis on Neural Networks, Transformers, PyTorch implementations, and large language model architecture advances.",
    logo: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=150&auto=format&fit=crop&q=60",
    latestArticleTitle: "Inside the Black Box: How Attention Mechanism Learns Weights",
    latestArticleContent: "The transformer architecture revolves around the self-attention mechanism, which maps queries, keys, and values. In this edition, we visually demystify how these dot-products are computed, scaled, and normalized using softmax. We also showcase how multi-head attention allows networks to focus on different tokens simultaneously, detailing the exact linear projection transformations."
  },
  {
    name: "Next.js & Frontend Frontiers",
    publisher: "Vercel Pioneers",
    subscribers: "670,400 subscribers",
    description: "Explore the bleeding edge of Next.js, static site generation, React Server Components (RSC), and Turbopack build tools.",
    logo: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=150&auto=format&fit=crop&q=60",
    latestArticleTitle: "Next.js 16 App Router Performance Tuning",
    latestArticleContent: "Next.js 16 introduces further optimizations to Turbopack, making local hot-module replacement (HMR) up to 2x faster. In this guide, we walk through setting up absolute paths, optimizing fonts and images, managing client-side bundling, and utilizing server-side rendering routes vs. static generation pages for maximum web application efficiency."
  },
  {
    name: "Architecting Microservices",
    publisher: "Cloud Native Systems",
    subscribers: "450,100 subscribers",
    description: "Design highly-available, fault-tolerant distributed backends. Covers Kubernetes, gRPC, Docker, and Kafka event streams.",
    logo: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=150&auto=format&fit=crop&q=60",
    latestArticleTitle: "Designing Idempotent Event Consumers with Apache Kafka",
    latestArticleContent: "In event-driven backends, message duplication is inevitable due to network jitters. To build robust microservices, you must ensure your consumers are idempotent. We explore utilizing a unique ID lookup pattern within Redis, verifying transaction states in Mongoose, and successfully completing database commits before acknowledging message delivery."
  },
  {
    name: "UX Design & Design Systems",
    publisher: "Creative Layouts",
    subscribers: "320,800 subscribers",
    description: "Bridging the gap between design and front-end code. UI/UX best practices, typography rules, glassmorphism, and animations.",
    logo: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=150&auto=format&fit=crop&q=60",
    latestArticleTitle: "Micro-animations: Improving User Engagement by 40%",
    latestArticleContent: "Subtle hover transitions, progress metrics, and loading spinners do more than look pretty; they communicate state and guide interactions. We review design tokens, HSL Tailwind color customization, CSS keyframe animations, and how minor changes to button transition timing can make a web application feel premium and responsive."
  }
];

export default function Newsletters() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [loadingMap, setLoadingMap] = useState({});

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleSubscribe = async (nlName, isSubscribed) => {
    setLoadingMap(prev => ({ ...prev, [nlName]: true }));
    try {
      const action = isSubscribed ? "unfollow" : "follow";
      await api.put("/users/update-discover", {
        type: "newsletter",
        name: nlName,
        action
      });
      dispatch(fetchUserProfile());
    } catch (err) {
      console.error("Failed to update newsletter subscription:", err.message);
    } finally {
      setLoadingMap(prev => ({ ...prev, [nlName]: false }));
    }
  };

  const subscribedNewsletters = NEWSLETTERS_DATA.filter(nl => 
    user?.followedNewsletters?.includes(nl.name)
  );

  const recommendedNewsletters = NEWSLETTERS_DATA.filter(nl => 
    !user?.followedNewsletters?.includes(nl.name)
  );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto flex flex-col gap-6 text-left select-none pb-10">
        
        {/* Header Widget */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-grow">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-2xl">📰</span>
              <span>LinkedIn Newsletters Hub</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1.5">
              Stay ahead in your field by subscribing to curated, professional newsletters edited by industry experts.
            </p>
          </div>
          <Link href="/" className="px-4 py-1.5 bg-[#0077b5] text-white hover:bg-sky-850 rounded-full text-xs font-semibold shadow-sm transition-all flex items-center gap-1 cursor-pointer">
            <span>←</span> Back to Feed
          </Link>
        </div>

        {/* 1. Subscribed Newsletters (Conditional) */}
        {subscribedNewsletters.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-xs text-slate-500 uppercase tracking-wider pl-1">
              Your Subscriptions ({subscribedNewsletters.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subscribedNewsletters.map((nl) => (
                <div 
                  key={nl.name}
                  className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-sky-50 rounded-bl-full opacity-40"></div>
                  
                  <div className="flex gap-4 items-start relative z-10">
                    <img 
                      src={nl.logo} 
                      alt={nl.name} 
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-800 hover:text-[#0077b5] cursor-pointer hover:underline truncate" onClick={() => setSelectedNewsletter(nl)}>
                        {nl.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                        Published by {nl.publisher}
                      </span>
                      <span className="bg-sky-100 text-[#0077b5] text-[9px] px-1.5 py-0.5 rounded font-bold uppercase mt-2 inline-block">
                        ✓ Subscribed
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {nl.description}
                  </p>

                  <div className="flex gap-2 justify-end border-t border-slate-100 pt-3 relative z-10">
                    <button
                      onClick={() => setSelectedNewsletter(nl)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded cursor-pointer transition-colors"
                    >
                      Read Latest Issue
                    </button>
                    <button
                      onClick={() => handleSubscribe(nl.name, true)}
                      disabled={loadingMap[nl.name]}
                      className="px-3 py-1 border border-red-500 hover:bg-red-50 text-red-500 text-xs font-semibold rounded cursor-pointer transition-colors flex items-center justify-center min-w-[90px]"
                    >
                      {loadingMap[nl.name] ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-red-500 border-t-transparent"></div>
                      ) : (
                        "Unsubscribe"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Recommended Newsletters */}
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-xs text-slate-500 uppercase tracking-wider pl-1">
            Recommended for you
          </h2>
          {recommendedNewsletters.length > 0 ? (
            <div className="flex flex-col gap-4 bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              {recommendedNewsletters.map((nl, idx) => (
                <div 
                  key={nl.name} 
                  className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0 ${idx > 0 ? "pt-4" : ""}`}
                >
                  <div className="flex gap-4 items-start min-w-0">
                    <img 
                      src={nl.logo} 
                      alt={nl.name} 
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-800 hover:text-[#0077b5] cursor-pointer hover:underline" onClick={() => setSelectedNewsletter(nl)}>
                        {nl.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Published by {nl.publisher} • {nl.subscribers}
                      </span>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2 max-w-2xl">
                        {nl.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0 self-end md:self-center">
                    <button
                      onClick={() => setSelectedNewsletter(nl)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-655 text-xs font-semibold rounded cursor-pointer transition-colors"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleSubscribe(nl.name, false)}
                      disabled={loadingMap[nl.name]}
                      className="px-4 py-1.5 bg-[#0077b5] hover:bg-sky-855 text-white text-xs font-semibold rounded shadow-sm cursor-pointer transition-colors flex items-center justify-center min-w-[90px]"
                    >
                      {loadingMap[nl.name] ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                      ) : (
                        "+ Subscribe"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-400 text-xs">
              🎉 Congratulations! You have subscribed to all available newsletters. Stay tuned for new recommendations.
            </div>
          )}
        </div>

        {/* Modal: Read Newsletter Issue */}
        {selectedNewsletter && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl p-6 border border-slate-200 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
              
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-150">
                <div className="flex gap-3 items-center min-w-0">
                  <img 
                    src={selectedNewsletter.logo} 
                    alt={selectedNewsletter.name} 
                    className="w-10 h-10 rounded object-cover border border-slate-200"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-800 truncate">{selectedNewsletter.name}</h3>
                    <span className="text-[10px] text-slate-500 block">Latest Issue • Published by {selectedNewsletter.publisher}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedNewsletter(null)}
                  className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-full cursor-pointer focus:outline-none transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto flex-grow flex flex-col gap-4 pr-1">
                <div className="bg-sky-50/50 p-4 border border-sky-100 rounded-lg text-slate-800 text-left">
                  <h4 className="font-bold text-sm text-[#0077b5]">{selectedNewsletter.latestArticleTitle}</h4>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Published 2 days ago • 5 min read</span>
                  <p className="text-xs text-slate-655 leading-relaxed mt-3 whitespace-pre-line">
                    {selectedNewsletter.latestArticleContent}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <h5 className="font-bold text-[10px] text-slate-500 uppercase tracking-wider mb-2">Discussion & Feedback</h5>
                  <div className="bg-slate-50 border border-slate-150 rounded-lg p-3 text-xs text-slate-500 text-center">
                    💬 Subscribed members can post questions and comments on this edition. Join the discussion feed to participate.
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-2 justify-end border-t border-slate-100 pt-4 mt-4">
                <button
                  onClick={() => setSelectedNewsletter(null)}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:bg-slate-50 border border-slate-200 cursor-pointer"
                >
                  Close
                </button>
                {user?.followedNewsletters?.includes(selectedNewsletter.name) ? (
                  <button
                    onClick={() => {
                      handleSubscribe(selectedNewsletter.name, true);
                      setSelectedNewsletter(null);
                    }}
                    className="px-5 py-1.5 rounded-full text-xs font-semibold text-white bg-red-500 hover:bg-red-650 cursor-pointer shadow-md transition-colors"
                  >
                    Unsubscribe
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleSubscribe(selectedNewsletter.name, false);
                      setSelectedNewsletter(null);
                    }}
                    className="px-5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#0077b5] hover:bg-sky-850 cursor-pointer shadow-md transition-colors"
                  >
                    Subscribe
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
