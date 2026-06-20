import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import api from "@/config";

export default function NewsArticle() {
  const router = useRouter();
  const { id } = router.query;

  const [article, setArticle] = useState(null);
  const [otherArticles, setOtherArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Fetch article detail
  useEffect(() => {
    if (!id) return;
    const fetchArticleDetail = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/news/${id}`);
        const data = res.data?.article;
        setArticle(data);
        setLikeCount(data?.likes || 0);
        setComments(data?.comments || []);
        
        // Fetch current user ID to see if liked
        const profileRes = await api.get("/users/get_user_and_profile");
        const currentUserId = profileRes.data?.user?._id || profileRes.data?.user?.id;
        if (data?.likedBy?.includes(currentUserId)) {
          setHasLiked(true);
        } else {
          setHasLiked(false);
        }
      } catch (err) {
        console.error("Failed to load article detail:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetail();
  }, [id]);

  // Fetch other articles for sidebar
  useEffect(() => {
    const fetchOtherArticles = async () => {
      try {
        const res = await api.get("/news");
        const list = res.data?.articles || [];
        setOtherArticles(list.filter(item => item._id !== id).slice(0, 5));
      } catch (err) {
        console.error("Failed to load other articles:", err.message);
      }
    };
    fetchOtherArticles();
  }, [id]);

  const handleLike = async () => {
    try {
      const res = await api.post(`/news/like/${id}`);
      setLikeCount(res.data?.likes);
      
      const profileRes = await api.get("/users/get_user_and_profile");
      const currentUserId = profileRes.data?.user?._id || profileRes.data?.user?.id;
      if (res.data?.likedBy?.includes(currentUserId)) {
        setHasLiked(true);
      } else {
        setHasLiked(false);
      }
    } catch (err) {
      console.error("Failed to like article:", err.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setSubmittingComment(true);
      const res = await api.post(`/news/comment/${id}`, { text: commentText.trim() });
      setComments(res.data?.comments || []);
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err.message);
      alert(err.response?.data?.message || "Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-12 gap-5 items-start font-sans">
        
        {/* Left Column: Back button & main content */}
        <main className="col-span-12 md:col-span-8 flex flex-col gap-4 text-left">
          {/* Back button */}
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0077b5] transition-colors p-2 rounded-lg bg-white border border-slate-200 shadow-sm w-fit focus:outline-none cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home Feed</span>
          </Link>

          {loading ? (
            <div className="bg-white border border-slate-200 rounded-lg p-12 text-center shadow-sm flex flex-col items-center">
              <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-[#0077b5] mb-2"></div>
              <span className="text-xs font-bold text-slate-500 animate-pulse">Loading article details...</span>
            </div>
          ) : article ? (
            <article className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col gap-5 select-none">
              
              {/* Category & Publish details */}
              <div className="flex items-center justify-between">
                <span className="bg-sky-50 text-[#0077b5] text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                  {article.category}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Published {article.time} • {article.readers}
                </span>
              </div>

              {/* Title & Author */}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                  {article.title}
                </h1>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-600 to-[#0077b5] text-white flex items-center justify-center font-bold text-xs">
                    LN
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block leading-tight">{article.author}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">LinkedIn News Editor</span>
                  </div>
                </div>
              </div>

              {/* Body Content */}
              <div className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal border-t border-slate-100 pt-4">
                {article.content}
              </div>

              {/* Action area: Likes & Comments */}
              <div className="border-t border-b border-slate-100 py-3 flex items-center justify-between text-xs font-bold select-none">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                      hasLiked
                        ? "bg-sky-50 border-sky-200 text-[#0077b5]"
                        : "bg-white border-slate-200 text-slate-655 hover:bg-slate-50"
                    }`}
                  >
                    <span>👍</span>
                    <span>{hasLiked ? "Liked" : "Like"}</span>
                    <span className="bg-slate-200/50 px-1.5 py-0.5 rounded text-[10px] ml-0.5">{likeCount}</span>
                  </button>
                  <span className="text-[10px] text-slate-450">💬 {comments.length} Comments</span>
                </div>
              </div>

              {/* Write a comment */}
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Join the discussion</h3>
                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-grow border border-slate-300 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-800 placeholder-slate-400"
                    placeholder="Add a comment..."
                  />
                  <button
                    type="submit"
                    disabled={submittingComment || !commentText.trim()}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                      commentText.trim()
                        ? "bg-[#0077b5] text-white hover:bg-sky-850 cursor-pointer"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    }`}
                  >
                    {submittingComment ? "Posting..." : "Comment"}
                  </button>
                </form>

                {/* Comments List */}
                <div className="flex flex-col gap-3.5 mt-2">
                  {comments.map((comment, index) => (
                    <div key={index} className="bg-slate-50/70 p-3 rounded-lg border border-slate-100 flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                        {comment.userName?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className="font-bold text-xs text-slate-800">{comment.userName}</span>
                          <span className="text-[9px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-slate-650 leading-relaxed font-normal">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </article>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-12 text-center shadow-sm">
              <span className="text-xs font-semibold text-slate-500">News article not found.</span>
            </div>
          )}
        </main>

        {/* Right Column: Other top stories */}
        <aside className="col-span-12 md:col-span-4 flex flex-col gap-3">
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-left select-none">
            <h2 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-1.5">
              <span>📰</span>
              <span>More Top Stories</span>
            </h2>
            <div className="flex flex-col gap-3">
              {otherArticles.map((item) => (
                <Link href={`/news/${item._id}`} key={item._id} className="group cursor-pointer block border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-750 group-hover:text-[#0077b5] group-hover:underline transition-all leading-snug">
                      {item.title}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-1 font-semibold">
                      {item.time} • {item.readers}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </Layout>
  );
}
