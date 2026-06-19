import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "@/config";

export default function PostComposer({ onPost }) {
  const { user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState("");
  const modalRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (onPost) {
      onPost(text.trim());
    }
    setText("");
    setIsModalOpen(false);
  };

  // Close modal on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    }
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 shadow-sm">
      {/* Top Part: Input field and Avatar */}
      <div className="flex items-center gap-3">
        {user?.profilePicture ? (
          <img
            src={`${API_BASE_URL}/uploads/${user.profilePicture.replace("uploads/", "")}`}
            alt="avatar"
            className="w-11 h-11 rounded-full object-cover border border-slate-200"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-sm">
            {getInitials(user?.name)}
          </div>
        )}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex-grow text-left bg-transparent hover:bg-slate-50 border border-slate-300 rounded-full px-4 py-3 text-slate-500 text-sm font-semibold transition-colors duration-150 focus:outline-none"
        >
          Start a post
        </button>
      </div>

      {/* Bottom Part: Action Buttons */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-500">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 hover:bg-slate-100 p-2 rounded cursor-pointer transition-all"
        >
          <svg className="w-5 h-5 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
          </svg>
          <span>Media</span>
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 hover:bg-slate-100 p-2 rounded cursor-pointer transition-all"
        >
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
          </svg>
          <span>Video</span>
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 hover:bg-slate-100 p-2 rounded cursor-pointer transition-all"
        >
          <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
          </svg>
          <span>Event</span>
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 hover:bg-slate-100 p-2 rounded cursor-pointer transition-all"
        >
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
          <span>Write article</span>
        </button>
      </div>

      {/* Modal Dialog Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            ref={modalRef}
            className="bg-white w-full max-w-lg rounded-xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <span className="font-semibold text-lg text-slate-800">Create a post</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:bg-slate-100 p-1.5 rounded-full transition-colors focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal User Row */}
            <div className="px-6 py-4 flex items-center gap-3">
              {user?.profilePicture ? (
                <img
                  src={`${API_BASE_URL}/uploads/${user.profilePicture.replace("uploads/", "")}`}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-base">
                  {getInitials(user?.name)}
                </div>
              )}
              <div>
                <div className="font-semibold text-slate-800">{user?.name}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 border border-slate-300 rounded-full px-2 py-0.5 w-fit">
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                  <span>Anyone</span>
                </div>
              </div>
            </div>

            {/* Modal Edit Area */}
            <form onSubmit={handlePostSubmit} className="flex flex-col flex-grow overflow-hidden">
              <div className="px-6 pb-4 flex-grow overflow-y-auto">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full text-slate-800 placeholder-slate-400 border-0 resize-none text-base focus:ring-0 focus:outline-none min-h-[150px]"
                  placeholder="What do you want to talk about?"
                  autoFocus
                />
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                {/* Media options */}
                <div className="flex gap-2 text-slate-500">
                  <button type="button" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <svg className="w-5 h-5 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                  </button>
                  <button type="button" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" />
                    </svg>
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className={`px-5 py-1.5 rounded-full font-semibold text-sm transition-all ${
                    text.trim()
                      ? "bg-[#0077b5] text-white hover:bg-sky-800 cursor-pointer shadow-md"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
