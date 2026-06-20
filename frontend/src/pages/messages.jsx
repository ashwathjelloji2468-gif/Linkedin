import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { fetchConnections } from "@/config/redux/action/authAction";
import { API_BASE_URL } from "@/config";
import api from "@/config";

export default function Messages() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, connections = [] } = useSelector((state) => state.auth);
  
  const [activeChatId, setActiveChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Load connections on mount
  useEffect(() => {
    dispatch(fetchConnections());
  }, [dispatch]);

  // Load connections and backend chat threads
  useEffect(() => {
    const loadThreadsAndConnections = async () => {
      try {
        // Fetch active threads
        const threadsRes = await api.get("/chats");
        const activeThreads = threadsRes.data?.threads || [];

        // Fetch connections to show potential chats
        const connRes = await api.get("/users/connections");
        const connectionsList = connRes.data?.connections || [];

        // Map threads
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

        // Add connections who don't have active threads yet
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

        const combined = [...mappedChats, ...fallbackChats];
        setChats(combined);

        // If activeChatId is not set, set it to the first thread
        if (combined.length > 0 && !activeChatId) {
          setActiveChatId(combined[0]._id);
        }
      } catch (err) {
        console.error("Failed to load threads:", err.message);
      }
    };

    if (user) {
      loadThreadsAndConnections();
    }
  }, [connections, user]);

  // Handle chatWith query parameter from search redirects
  useEffect(() => {
    if (router.query.chatWith && chats.length > 0) {
      const targetChat = chats.find(c => c.connectionId === router.query.chatWith);
      if (targetChat) {
        handleChatSelect(targetChat);
      } else {
        const loadSearchChat = async () => {
          try {
            const res = await api.get(`/chats/connection/${router.query.chatWith}`);
            const t = res.data?.thread;
            const otherParticipant = t.participants.find(p => p._id !== user?._id && p.id !== user?._id) || {};
            
            const newChat = {
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
            
            setChats(prev => [newChat, ...prev.filter(c => c.connectionId !== newChat.connectionId)]);
            setActiveChatId(t._id);
          } catch (err) {
            console.error("Failed to load search chat:", err.message);
          }
        };
        loadSearchChat();
      }
    }
  }, [router.query.chatWith, chats.length]);

  const activeChat = chats.find((c) => c._id === activeChatId) || chats[0];

  // Scroll to bottom of message list on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const handleChatSelect = async (chat) => {
    if (chat._id.startsWith("pending-")) {
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
        setActiveChatId(t._id);
      } catch (err) {
        console.error("Failed to get/create chat thread:", err.message);
      }
    } else {
      setActiveChatId(chat._id);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeChat) return;

    const messageText = typedMessage.trim();
    setTypedMessage("");

    // Optimistically add user message to list
    const tempUserMsg = {
      sender: "me",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prev => prev.map(c => {
      if (c._id === activeChat._id) {
        return { ...c, messages: [...c.messages, tempUserMsg] };
      }
      return c;
    }));

    try {
      let reqBody = { text: messageText };
      if (activeChat._id.startsWith("pending-")) {
        reqBody.recipientId = activeChat.connectionId;
      } else {
        reqBody.chatId = activeChat._id;
      }

      const res = await api.post("/chats/send", reqBody);
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

      setChats(prev => prev.map(c => c.connectionId === activeChat.connectionId ? updatedChat : c));
      setActiveChatId(t._id);
    } catch (err) {
      console.error("Failed to send message:", err.message);
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
    <Layout>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm grid grid-cols-12 min-h-[75vh] items-stretch">
        
        {/* Left Column: Chats List */}
        <div className="col-span-12 md:col-span-4 border-r border-slate-200 flex flex-col h-full">
          <div className="p-4 border-b border-slate-200 font-semibold text-slate-800 text-sm">
            Messaging
          </div>
          <div className="flex-grow overflow-y-auto max-h-[65vh] flex flex-col">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => handleChatSelect(chat)}
                  className={`flex gap-3 p-3 items-start border-b border-slate-100 last:border-b-0 cursor-pointer transition-all ${
                    activeChatId === chat._id
                      ? "bg-slate-50 border-l-4 border-[#0077b5]"
                      : "hover:bg-slate-50/50"
                  }`}
                >
                  {chat.profilePicture ? (
                    <img
                      src={`${API_BASE_URL}/uploads/${chat.profilePicture.replace("uploads/", "")}`}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 mt-0.5"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-xs mt-0.5 flex-shrink-0">
                      {getInitials(chat.name)}
                    </div>
                  )}
                  <div className="overflow-hidden flex-grow">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-xs text-slate-900 truncate">
                        {chat.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">{chat.headline}</span>
                    <span className="text-[10px] text-slate-400 block mt-1 truncate">
                      {chat.messages?.[chat.messages.length - 1]?.text}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400 text-center py-8">No messages available.</span>
            )}
          </div>
        </div>

        {/* Right Column: Chat Window */}
        <div className="col-span-12 md:col-span-8 flex flex-col h-full bg-slate-50/40">
          {activeChat ? (
            <div className="flex flex-col h-full justify-between flex-grow">
              {/* Header */}
              <div className="p-4 bg-white border-b border-slate-200 flex items-center gap-3 shadow-sm">
                {activeChat.profilePicture ? (
                  <img
                    src={`${API_BASE_URL}/uploads/${activeChat.profilePicture.replace("uploads/", "")}`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-xs">
                    {getInitials(activeChat.name)}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-xs text-slate-900 hover:underline cursor-pointer">
                    {activeChat.name}
                  </h3>
                  <span className="text-[10px] text-slate-500 block leading-snug">{activeChat.headline}</span>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-grow p-4 overflow-y-auto max-h-[50vh] flex flex-col gap-4 bg-white">
                {activeChat.messages?.map((msg, index) => {
                  const isMe = msg.sender === "me";
                  return (
                    <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-xl px-4 py-2.5 text-xs shadow-sm ${
                          isMe
                            ? "bg-[#0077b5] text-white rounded-tr-none"
                            : "bg-[#edf3f8] text-slate-800 rounded-tl-none"
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        <span className={`text-[8px] block text-right mt-1.5 ${isMe ? "text-slate-200" : "text-slate-400"}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message composer input */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-2">
                <input
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  className="flex-grow border border-slate-300 rounded-full px-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#0077b5] focus:border-[#0077b5] text-slate-800 placeholder-slate-400"
                  placeholder="Write a message..."
                />
                <button
                  type="submit"
                  disabled={!typedMessage.trim()}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                    typedMessage.trim()
                      ? "bg-[#0077b5] text-white hover:bg-sky-800 cursor-pointer shadow-sm"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                  }`}
                >
                  Send
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center my-auto py-10">
              <svg className="w-14 h-14 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-xs text-slate-400">Select a connection to start messaging</span>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
