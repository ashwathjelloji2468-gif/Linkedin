import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "@/config";

export default function PostComposer({ onPost }) {
  const { user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("post"); // 'post' | 'event' | 'article'
  const [text, setText] = useState("");
  
  // File attachments state
  const [attachedFile, setAttachedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [fileType, setFileType] = useState("image"); // 'image' | 'video'
  const fileInputRef = useRef(null);

  // Event state
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDesc, setEventDesc] = useState("");

  // Article state
  const [articleTitle, setArticleTitle] = useState("");
  const [articleContent, setArticleContent] = useState("");

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

    if (modalMode === "post") {
      if (!text.trim() && !attachedFile) return;
      if (onPost) {
        if (attachedFile) {
          const formData = new FormData();
          formData.append("body", text.trim() || "Shared a file");
          formData.append("media", attachedFile);
          formData.append("fileType", fileType);
          onPost(formData);
        } else {
          onPost({ body: text.trim() });
        }
      }
    } else if (modalMode === "event") {
      if (!eventName.trim() || !eventDate.trim()) return;
      const formattedBody = `📅 **Event**: ${eventName.trim()}\n⏰ **Date & Time**: ${eventDate}\n📍 **Location**: ${eventLocation.trim() || "Virtual / TBD"}\n\n📝 **Description**: ${eventDesc.trim() || "Join us for this exciting event!"}`;
      if (onPost) {
        onPost({ body: formattedBody });
      }
    } else if (modalMode === "article") {
      if (!articleTitle.trim() || !articleContent.trim()) return;
      const formattedBody = `✍️ **Article**: ${articleTitle.trim()}\n\n${articleContent.trim()}`;
      if (onPost) {
        onPost({ body: formattedBody });
      }
    }

    // Reset all states
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMode("post");
    setText("");
    setAttachedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview("");
    }
    setEventName("");
    setEventDate("");
    setEventLocation("");
    setEventDesc("");
    setArticleTitle("");
    setArticleContent("");
  };

  const triggerFileSelect = (type) => {
    setFileType(type);
    setModalMode("post");
    setIsModalOpen(true);
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.accept = type === "video" ? "video/*" : "image/*";
        fileInputRef.current.click();
      }
    }, 100);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedFile(file);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(URL.createObjectURL(file));
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview("");
    }
  };

  // Close modal on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseModal();
      }
    }
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen, filePreview]);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 shadow-sm">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

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
          onClick={() => {
            setModalMode("post");
            setIsModalOpen(true);
          }}
          className="flex-grow text-left bg-transparent hover:bg-slate-50 border border-slate-300 rounded-full px-4 py-3 text-slate-500 text-sm font-semibold transition-colors duration-150 focus:outline-none"
        >
          Start a post
        </button>
      </div>

      {/* Bottom Part: Action Buttons */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-500">
        <button
          onClick={() => triggerFileSelect("video")}
          className="flex items-center gap-2 hover:bg-slate-100 p-2 rounded cursor-pointer transition-all focus:outline-none"
        >
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
          </svg>
          <span>Video</span>
        </button>
        <button
          onClick={() => triggerFileSelect("image")}
          className="flex items-center gap-2 hover:bg-slate-100 p-2 rounded cursor-pointer transition-all focus:outline-none"
        >
          <svg className="w-5 h-5 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V9h14v9c0 .55-.45 1-1 1zm1-11H5V5h14v3z" />
          </svg>
          <span>Photo</span>
        </button>
        <button
          onClick={() => {
            setModalMode("article");
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 hover:bg-slate-100 p-2 rounded cursor-pointer transition-all focus:outline-none"
        >
          <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
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
              <span className="font-semibold text-lg text-slate-800">
                {modalMode === "post" && "Create a post"}
                {modalMode === "event" && "Create an Event"}
                {modalMode === "article" && "Write an Article"}
              </span>
              <button
                onClick={handleCloseModal}
                className="text-slate-500 hover:bg-slate-100 p-1.5 rounded-full transition-colors focus:outline-none cursor-pointer"
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

            {/* Modal Input Forms based on Mode */}
            <form onSubmit={handlePostSubmit} className="flex flex-col flex-grow overflow-hidden">
              <div className="px-6 pb-4 flex-grow overflow-y-auto max-h-[50vh]">
                
                {/* Standard Post Editor */}
                {modalMode === "post" && (
                  <div className="flex flex-col gap-4">
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full text-slate-800 placeholder-slate-400 border-0 resize-none text-base focus:ring-0 focus:outline-none min-h-[150px]"
                      placeholder="What do you want to talk about?"
                      autoFocus
                    />

                    {/* Preview attached file */}
                    {filePreview && (
                      <div className="relative border border-slate-200 rounded-lg overflow-hidden max-h-[250px] bg-slate-50 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={removeAttachedFile}
                          className="absolute top-2 right-2 bg-slate-900/75 hover:bg-slate-950 text-white rounded-full p-1 transition-colors z-10 focus:outline-none"
                          title="Remove media"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        {fileType === "video" ? (
                          <video src={filePreview} controls className="max-h-[250px] max-w-full object-contain" />
                        ) : (
                          <img src={filePreview} alt="upload preview" className="max-h-[250px] max-w-full object-contain" />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Event Creation Form */}
                {modalMode === "event" && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Event Name *</label>
                      <input
                        type="text"
                        required
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        placeholder="e.g. Next.js 16 Launch Party"
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] focus:border-[#0077b5] text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Date & Time *</label>
                      <input
                        type="text"
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        placeholder="e.g. June 25, 2026 at 6:00 PM EST"
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] focus:border-[#0077b5] text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Location / Join URL</label>
                      <input
                        type="text"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        placeholder="e.g. zoom.us/j/12345 or San Francisco, CA"
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] focus:border-[#0077b5] text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                      <textarea
                        value={eventDesc}
                        onChange={(e) => setEventDesc(e.target.value)}
                        placeholder="What is this event about?"
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] focus:border-[#0077b5] text-slate-800 resize-none h-20"
                      />
                    </div>
                  </div>
                )}

                {/* Article Writing Form */}
                {modalMode === "article" && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Article Title *</label>
                      <input
                        type="text"
                        required
                        value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}
                        placeholder="Title of your article"
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] focus:border-[#0077b5] text-slate-800 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Article Content *</label>
                      <textarea
                        required
                        value={articleContent}
                        onChange={(e) => setArticleContent(e.target.value)}
                        placeholder="Write your thoughts here..."
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] focus:border-[#0077b5] text-slate-800 resize-none h-40"
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                
                {/* Media file picker icons inside footer */}
                <div className="flex gap-2 text-slate-500">
                  <button
                    type="button"
                    onClick={() => triggerFileSelect("image")}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                    title="Add image"
                  >
                    <svg className="w-5 h-5 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerFileSelect("video")}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                    title="Add video"
                  >
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" />
                    </svg>
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={
                    modalMode === "post"
                      ? !text.trim() && !attachedFile
                      : modalMode === "event"
                      ? !eventName.trim() || !eventDate.trim()
                      : !articleTitle.trim() || !articleContent.trim()
                  }
                  className={`px-5 py-1.5 rounded-full font-semibold text-sm transition-all ${
                    (modalMode === "post" && (text.trim() || attachedFile)) ||
                    (modalMode === "event" && eventName.trim() && eventDate.trim()) ||
                    (modalMode === "article" && articleTitle.trim() && articleContent.trim())
                      ? "bg-[#0077b5] text-white hover:bg-sky-800 cursor-pointer shadow-md"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {modalMode === "post" ? "Post" : "Share"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
