import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { likePost, commentPost, deletePost, deleteComment } from "@/config/redux/action/postAction";
import { API_BASE_URL } from "@/config";

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const currentUserId = user?._id || user?.id;
  const author = post.userId || {};
  const isPostOwner = author._id === currentUserId || author.id === currentUserId;

  const hasLiked = post.likes?.includes(currentUserId);

  const handleLike = () => {
    dispatch(likePost({ postId: post._id, userId: currentUserId }));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    dispatch(commentPost({ postId: post._id, commentText: commentText.trim() }));
    setCommentText("");
  };

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(post._id));
    }
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      dispatch(deleteComment({ postId: post._id, commentId }));
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${Math.max(1, diffMins)}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm mb-4">
      {/* Top Header Card */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex gap-3">
          {author.profilePicture ? (
            <img
              src={`${API_BASE_URL}/uploads/${author.profilePicture.replace("uploads/", "")}`}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-base">
              {getInitials(author.name)}
            </div>
          )}
          <div>
            <div className="font-semibold text-slate-800 hover:underline hover:text-[#0077b5] cursor-pointer text-sm">
              {author.name || "Anonymous User"}
            </div>
            <div className="text-[11px] text-slate-500 leading-normal max-w-[280px] md:max-w-[400px] truncate">
              {author.headline || "LinkedIn Member"}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
              <span>{formatDate(post.createdAt)}</span>
              <span>•</span>
              <svg className="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
          </div>
        </div>

        {isPostOwner && (
          <button
            onClick={handleDeletePost}
            className="text-slate-400 hover:text-red-600 p-1.5 rounded-full hover:bg-slate-50 transition-all duration-150 focus:outline-none"
            title="Delete post"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Main post text content */}
      <div className="px-4 pb-3 text-slate-800 text-sm whitespace-pre-wrap leading-relaxed select-text">
        {post.body}
      </div>

      {/* Stats Counter */}
      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1 hover:underline cursor-pointer">
          <span className="bg-sky-100 p-0.5 rounded-full text-[#0077b5]">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
            </svg>
          </span>
          <span>{post.likesCount || 0} likes</span>
        </div>
        <div
          onClick={() => setShowComments(!showComments)}
          className="hover:underline hover:text-[#0077b5] cursor-pointer font-medium"
        >
          {post.comments?.length || 0} comments
        </div>
      </div>

      {/* Interactive Actions Panel */}
      <div className="flex items-center justify-between px-2 py-1 text-slate-600 font-semibold text-xs border-b border-slate-100">
        <button
          onClick={handleLike}
          className={`flex items-center justify-center gap-2 flex-grow hover:bg-slate-50 py-2.5 rounded-md transition-colors ${
            hasLiked ? "text-[#0077b5]" : "text-slate-600"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill={hasLiked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          <span>Like</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center justify-center gap-2 flex-grow hover:bg-slate-50 py-2.5 rounded-md transition-colors text-slate-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>Comment</span>
        </button>
      </div>

      {/* Comments Panel Wrapper */}
      {showComments && (
        <div className="bg-slate-50 p-4 border-t border-slate-100 rounded-b-lg flex flex-col gap-3">
          {/* Post Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            {user?.profilePicture ? (
              <img
                src={`${API_BASE_URL}/uploads/${user.profilePicture.replace("uploads/", "")}`}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-xs">
                {getInitials(user?.name)}
              </div>
            )}
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-grow bg-white border border-slate-300 rounded-full px-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#0077b5] focus:border-[#0077b5] text-slate-800 placeholder-slate-400"
              placeholder="Add a comment..."
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className={`px-4 py-1 rounded-full text-xs font-semibold ${
                commentText.trim()
                  ? "bg-[#0077b5] text-white hover:bg-sky-800 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Post
            </button>
          </form>

          {/* List of comments */}
          <div className="flex flex-col gap-3 mt-2 max-h-[300px] overflow-y-auto pr-1">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => {
                const commentAuthor = comment.userId || {};
                const isCommentOwner =
                  commentAuthor._id === currentUserId || commentAuthor.id === currentUserId;
                return (
                  <div key={comment._id} className="flex gap-2 items-start">
                    {commentAuthor.profilePicture ? (
                      <img
                        src={`${API_BASE_URL}/uploads/${commentAuthor.profilePicture.replace("uploads/", "")}`}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 mt-1"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-[10px] mt-1">
                        {getInitials(commentAuthor.name)}
                      </div>
                    )}
                    <div className="flex-grow bg-[#edf3f8] px-3 py-2 rounded-lg relative">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-800 hover:underline cursor-pointer">
                          {commentAuthor.name || "Anonymous Member"}
                        </span>
                        {isCommentOwner && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-slate-400 hover:text-red-600 p-0.5 rounded-full hover:bg-slate-200 transition-colors focus:outline-none"
                            title="Delete comment"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {comment.createdAt ? formatDate(comment.createdAt) : ""}
                      </div>
                      <p className="text-slate-800 text-xs mt-1.5 leading-normal">{comment.text}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <span className="text-xs text-slate-400 text-center py-2">
                No comments yet. Start the conversation!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
