import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PostComposer from "@/components/PostComposer";
import PostCard from "@/components/PostCard";
import { fetchPosts, createPost } from "@/config/redux/action/postAction";

export default function Feed() {
  const dispatch = useDispatch();
  const { items: posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handlePostSubmit = (text) => {
    dispatch(createPost({ body: text }));
  };

  return (
    <div className="flex flex-col">
      {/* Create Post composer */}
      <PostComposer onPost={handlePostSubmit} />

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
      ) : posts.length > 0 ? (
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-8 rounded-lg text-center text-slate-500 text-xs shadow-sm">
          No posts available. Be the first to share something!
        </div>
      )}
    </div>
  );
}
