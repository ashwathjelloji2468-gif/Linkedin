import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchConnections } from "@/config/redux/action/authAction";
import { API_BASE_URL, getImageUrl } from "@/config";
import api from "@/config";

export default function FloatingMessaging() {
  const dispatch = useDispatch();
  const { user, connections = [] } = useSelector((state) => state.auth);
  
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // List of active chat box IDs that are currently open side-by-side
  // Each entry is: { _id, collapsed: boolean, typedMessage: string }
  const [openChatBoxes, setOpenChatBoxes] = useState([]);

  // Fetch connections if not loaded
  useEffect(() => {
    if (connections.length === 0) {
      dispatch(fetchConnections());
    }
  }, [dispatch, connections.length]);

  // Fetch active threads and connections to build the chat list
  useEffect(() => {
    const loadThreadsAndConnections = async () => {
      try {
        const threadsRes = await api.get("/chats");
        const activeThreads = threadsRes.data?.threads || [];

        const connRes = await api.get("/users/connections");
        const connectionsList = connRes.data?.connections || [];

        const mappedChats = activeThreads.map(t => {
          const otherParticipant = t.participants.find(p => p._id !== user?._id && p.id !== user?._id) || {};
          return {
            _id: t._id,
            connectionId: otherParticipant._id || otherParticipant.id,
            name: otherParticipant.name,
            headline: otherParticipant.headline,
            profilePicture: otherParticipant.profilePicture,
            messages: t.messages.map(m => ({
              sender: m.senderId === user?._id || m.senderId === user?.id ? "me" : "contact",
              text: m.text,
              time: m.time
            }))
          };
        });

        const remainingConnections = connectionsList.filter(
          conn => !mappedChats.some(mc => mc.connectionId === conn._id || mc.connectionId === conn.id)
        );

        const fallbackChats = remainingConnections.map(conn => ({
          _id: `pending-${conn._id || conn.id}`,
          connectionId: conn._id || conn.id,
          name: conn.name,
          headline: conn.headline || "LinkedIn Member",
          profilePicture: conn.profilePicture,
          messages: [
            { sender: "contact", text: "Hi, thank you for connecting! How are you doing?", time: "12:00 PM" }
          ]
        }));

        setChats([...mappedChats, ...fallbackChats]);
      } catch (err) {
        console.error("Failed to load threads in drawer:", err.message);
      }
    };

    if (user) {
      loadThreadsAndConnections();
    }
  }, [connections, user]);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleOpenChatBox = async (chat) => {
    let chatId = chat._id;
    let targetChat = chat;

    // If it's a pending chat, get/create the thread on the backend first
    if (chatId.startsWith("pending-")) {
      try {
        const res = await api.get(`/chats/connection/${chat.connectionId}`);
        const t = res.data?.thread;
        const otherParticipant = t.participants.find(p => p._id !== user?._id && p.id !== user?._id) || {};
        
        const realChat = {
          _id: t._id,
          connectionId: otherParticipant._id || otherParticipant.id,
          name: otherParticipant.name,
          headline: otherParticipant.headline,
          profilePicture: otherParticipant.profilePicture,
          messages: t.messages.map(m => ({
            sender: m.senderId === user?._id || m.senderId === user?.id ? "me" : "contact",
            text: m.text,
            time: m.time
          }))
        };

        setChats(prev => prev.map(c => c.connectionId === chat.connectionId ? realChat : c));
        chatId = t._id;
        targetChat = realChat;
      } catch (err) {
        console.error("Failed to initialize pending chat:", err.message);
        return;
      }
    }

    const exists = openChatBoxes.find((box) => box._id === chatId);
    if (exists) {
      setOpenChatBoxes(
        openChatBoxes.map((box) =>
          box._id === chatId ? { ...box, collapsed: false } : box
        )
      );
    } else {
      const newBoxes = [...openChatBoxes];
      if (newBoxes.length >= 2) {
        newBoxes.shift();
      }
      newBoxes.push({ _id: chatId, collapsed: false, typedMessage: "" });
      setOpenChatBoxes(newBoxes);
    }
  };

  const handleCloseChatBox = (chatId) => {
    setOpenChatBoxes(openChatBoxes.filter((box) => box._id !== chatId));
  };

  const handleToggleCollapseChatBox = (chatId) => {
    setOpenChatBoxes(
      openChatBoxes.map((box) =>
        box._id === chatId ? { ...box, collapsed: !box.collapsed } : box
      )
    );
  };

  const handleTypedMessageChange = (chatId, value) => {
    setOpenChatBoxes(
      openChatBoxes.map((box) =>
        box._id === chatId ? { ...box, typedMessage: value } : box
      )
    );
  };

  const handleSendMessage = async (chatId, textToSend) => {
    if (!textToSend.trim()) return;

    const messageText = textToSend.trim();
    const chat = chats.find(c => c._id === chatId);
    if (!chat) return;

    // Optimistically add user message to list
    const tempUserMsg = {
      sender: "me",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prev => prev.map(c => {
      if (c._id === chatId) {
        return { ...c, messages: [...c.messages, tempUserMsg] };
      }
      return c;
    }));

    // Clear typed message
    setOpenChatBoxes(prev =>
      prev.map(box => box._id === chatId ? { ...box, typedMessage: "" } : box)
    );

    try {
      const res = await api.post("/chats/send", { chatId, text: messageText });
      const t = res.data?.thread;
      const otherParticipant = t.participants.find(p => p._id !== user?._id && p.id !== user?._id) || {};

      const updatedChat = {
        _id: t._id,
        connectionId: otherParticipant._id || otherParticipant.id,
        name: otherParticipant.name,
        headline: otherParticipant.headline,
        profilePicture: otherParticipant.profilePicture,
        messages: t.messages.map(m => ({
          sender: m.senderId === user?._id || m.senderId === user?.id ? "me" : "contact",
          text: m.text,
          time: m.time
        }))
      };

      setChats(prev => prev.map(c => c.connectionId === chat.connectionId ? updatedChat : c));
    } catch (err) {
      console.error("Failed to send message in drawer:", err.message);
    }
  };

  // Filter chats by search query
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Floating Side-by-Side Active Chat Boxes */}
      <div className="fixed bottom-0 z-50 flex items-end gap-3 pointer-events-none" style={{ right: "340px" }}>
        {openChatBoxes.map((box, idx) => {
          const chatInfo = chats.find((c) => c._id === box._id);
          if (!chatInfo) return null;

          return (
            <ActiveChatBox
              key={box._id}
              chat={chatInfo}
              collapsed={box.collapsed}
              typedMessage={box.typedMessage}
              onClose={() => handleCloseChatBox(box._id)}
              onToggleCollapse={() => handleToggleCollapseChatBox(box._id)}
              onTypedMessageChange={(val) => handleTypedMessageChange(box._id, val)}
              onSend={(text) => handleSendMessage(box._id, text)}
            />
          );
        })}
      </div>

      {/* Main Messaging Drawer Widget */}
      <div
        className={`fixed bottom-0 right-8 z-40 bg-white rounded-t-lg border border-slate-300 shadow-xl flex flex-col transition-all duration-200 text-left ${
          isOpen ? "h-[440px] w-72" : "h-11 w-72"
        }`}
      >
        {/* Header */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="h-11 bg-white border-b border-slate-200 px-3 flex items-center justify-between cursor-pointer rounded-t-lg select-none"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-800 font-bold">Messaging</span>
          </div>

          <div className="flex items-center gap-2 text-slate-550">
            <button className="hover:bg-slate-100 p-1 rounded focus:outline-none" title="More options">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
            <button className="hover:bg-slate-100 p-1 rounded focus:outline-none" title="Compose">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </button>
            <button className="hover:bg-slate-100 p-1 rounded focus:outline-none">
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Drawer Body (only visible when expanded) */}
        {isOpen && (
          <div className="flex flex-col flex-grow min-h-0 bg-white">
            {/* Search messages */}
            <div className="p-2 border-b border-slate-150 bg-slate-50/50">
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#edf3f8] text-slate-800 text-[11px] rounded-md pl-7 pr-3 py-1.5 focus:outline-none focus:bg-white border border-transparent focus:border-slate-300 font-sans"
                  placeholder="Search messages"
                />
                <svg className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Chat Contacts List */}
            <div className="flex-grow overflow-y-auto divide-y divide-slate-100">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => {
                  const lastMessage = chat.messages?.[chat.messages.length - 1];
                  return (
                    <div
                      key={chat._id}
                      onClick={() => handleOpenChatBox(chat._id)}
                      className="flex gap-2.5 p-2.5 items-start cursor-pointer hover:bg-slate-50 transition-all select-none"
                    >
                      {/* Contact Photo */}
                      <div className="relative flex-shrink-0">
                        {chat.profilePicture ? (
                          <img
                            src={getImageUrl(chat.profilePicture)}
                            alt="avatar"
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-xs">
                            {getInitials(chat.name)}
                          </div>
                        )}
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-600 border border-white"></span>
                      </div>
                      
                      <div className="overflow-hidden flex-grow">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-xs text-slate-900 truncate">
                            {chat.name}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium">
                            {lastMessage?.time || ""}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate leading-snug">{chat.headline}</span>
                        <span className="text-[10px] text-slate-400 block truncate mt-0.5 font-medium">
                          {lastMessage ? (
                            <>
                              {lastMessage.sender === "me" ? "You: " : ""}
                              {lastMessage.text}
                            </>
                          ) : (
                            "No messages"
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-[11px] text-slate-400 text-center py-8 font-medium">
                  No conversations found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Side-by-side Chat Box component
function ActiveChatBox({
  chat,
  collapsed,
  typedMessage,
  onClose,
  onToggleCollapse,
  onTypedMessageChange,
  onSend,
}) {
  const messagesEndRef = useRef(null);

  // Auto-scroll messages list to bottom
  useEffect(() => {
    if (!collapsed) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat.messages?.length, collapsed]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typedMessage.trim()) {
      onSend(typedMessage);
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

  return (
    <div
      className={`bg-white rounded-t-lg border border-slate-300 shadow-2xl flex flex-col transition-all duration-200 pointer-events-auto text-left ${
        collapsed ? "h-11 w-64" : "h-[360px] w-72"
      }`}
    >
      {/* Chat Box Header */}
      <div
        onClick={onToggleCollapse}
        className="flex items-center justify-between px-3 py-2 border-b border-slate-200 cursor-pointer h-11 hover:bg-slate-50 transition-colors select-none rounded-t-lg"
      >
        <div className="flex items-center gap-2 overflow-hidden mr-2">
          {/* Avatar with Status Dot */}
          <Link
            href={`/profile?id=${chat.connectionId}`}
            onClick={(e) => e.stopPropagation()}
            className="relative flex-shrink-0 cursor-pointer block hover:opacity-80"
          >
            {chat.profilePicture ? (
              <img
                src={getImageUrl(chat.profilePicture)}
                alt="avatar"
                className="w-6 h-6 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-[9px]">
                {getInitials(chat.name)}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-600 border border-white"></span>
          </Link>

          <div className="overflow-hidden text-left">
            <Link
              href={`/profile?id=${chat.connectionId}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] font-bold text-slate-800 truncate block hover:text-[#0077b5] hover:underline cursor-pointer"
            >
              {chat.name}
            </Link>
            <span className="text-[9px] text-slate-500 block truncate leading-none mt-0.5">
              {chat.headline}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 text-slate-550 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onToggleCollapse}
            className="hover:bg-slate-100 p-0.5 rounded focus:outline-none"
            title={collapsed ? "Expand" : "Minimize"}
          >
            {collapsed ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 11l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 13H5" />
              </svg>
            )}
          </button>
          <button
            onClick={onClose}
            className="hover:bg-slate-100 p-0.5 rounded focus:outline-none"
            title="Close chat"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Box Body */}
      {!collapsed && (
        <div className="flex flex-col flex-grow min-h-0 bg-slate-50/30">
          {/* Message List */}
          <div className="flex-grow p-3 overflow-y-auto flex flex-col gap-2.5 bg-white">
            {chat.messages?.map((msg, index) => {
              const isMe = msg.sender === "me";
              return (
                <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-1.5 text-[11px] shadow-sm leading-relaxed whitespace-pre-wrap ${
                      isMe
                        ? "bg-[#0077b5] text-white rounded-tr-none"
                        : "bg-[#edf3f8] text-slate-800 rounded-tl-none"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-[7px] block text-right mt-1 font-semibold ${
                        isMe ? "text-slate-200" : "text-slate-400"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Composer Input Form */}
          <form onSubmit={handleSubmit} className="p-2.5 bg-white border-t border-slate-200 flex gap-2 items-center">
            <input
              value={typedMessage}
              onChange={(e) => onTypedMessageChange(e.target.value)}
              className="flex-grow border border-slate-300 rounded-full px-3 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#0077b5] focus:border-[#0077b5] text-slate-850 placeholder-slate-400 font-sans"
              placeholder="Write a message..."
            />
            <button
              type="submit"
              disabled={!typedMessage.trim()}
              className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                typedMessage.trim()
                  ? "bg-[#0077b5] text-white hover:bg-sky-800 cursor-pointer shadow-sm"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
              }`}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
