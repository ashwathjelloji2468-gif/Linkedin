import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import PostComposer from "@/components/PostComposer";
import PostCard from "@/components/PostCard";
import { fetchPosts, createPost } from "@/config/redux/action/postAction";

export default function Feed() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items: posts, loading, error } = useSelector((state) => state.posts);

  const searchQuery = router.query.search || "";

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handlePostSubmit = (postData) => {
    dispatch(createPost(postData));
  };

  const filteredPosts = searchQuery.trim()
    ? posts.filter((post) =>
        post.body?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  return (
    <div className="flex flex-col">
      {/* Create Post composer */}
      <PostComposer onPost={handlePostSubmit} />

      {/* Sort By Separator */}
      <div className="flex items-center justify-between my-2 text-[11px] text-slate-500">
        <div className="flex-grow border-t border-slate-300 mr-3"></div>
        <div className="flex items-center gap-1 font-semibold text-slate-700 cursor-pointer hover:text-slate-900 transition-colors">
          <span>Sort by:</span>
          <span className="font-bold text-slate-900">Top</span>
          <svg className="w-3 h-3 text-slate-750" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
        </div>
      </div>

      {/* Feed Area */}
      {loading && posts.length === 0 ? (
        <div className="flex flex-col items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0077b5]"></div>
          <span className="mt-2 text-xs font-semibold text-slate-500 animate-pulse">Loading feed...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center text-xs font-medium border border-red-200 shadow-sm">
          Failed to load posts: {typeof error === "object" ? (error.message || "Failed to load posts") : error}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="flex flex-col gap-2">
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-8 rounded-lg text-center text-slate-500 text-xs shadow-sm font-sans font-medium">
          No matching posts available. Try another search query!
        </div>
      )}
    </div>
  );
}
