import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "@/components/Layout";
import { fetchConnections } from "@/config/redux/action/authAction";
import { API_BASE_URL } from "@/config";

export default function Messages() {
  const dispatch = useDispatch();
  const { connections } = useSelector((state) => state.auth);
  
  const [activeChatId, setActiveChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Load connections on mount
  useEffect(() => {
    dispatch(fetchConnections());
  }, [dispatch]);

  // Set up mock chats or real connection chats
  useEffect(() => {
    const defaultMockContacts = [
      {
        _id: "mock1",
        name: "Satya Nadella",
        headline: "CEO at Microsoft",
        profilePicture: "",
        messages: [
          { sender: "contact", text: "Hello! Loved your latest post on AI agents.", time: "10:30 AM" },
          { sender: "me", text: "Thank you Satya! Really excited about the future of tech.", time: "10:32 AM" },
        ],
        replies: [
          "Absolutely! Tech is evolving faster than ever. Let's touch base next week.",
          "Indeed. Keep pushing boundaries!",
        ],
      },
      {
        _id: "mock2",
        name: "Sundar Pichai",
        headline: "CEO at Google & Alphabet",
        profilePicture: "",
        messages: [
          { sender: "contact", text: "Let's schedule some time to chat about Google Cloud integration.", time: "Yesterday" },
        ],
        replies: [
          "I'll have my assistant schedule a meet. Speak soon!",
          "Great! Looking forward to it.",
        ],
      },
    ];

    // Combine connections with mock contacts to populate chats list
    const connectionChats = connections.map((c, index) => ({
      _id: c._id || c.id,
      name: c.name,
      headline: c.headline || "LinkedIn Member",
      profilePicture: c.profilePicture,
      messages: [
        { sender: "contact", text: `Hi, thank you for connecting! How are you doing?`, time: "12:00 PM" },
      ],
      replies: [
        "That sounds wonderful! Let's connect soon.",
        "Glad to hear. Keep in touch!",
      ],
    }));

    const combinedChats = [...connectionChats, ...defaultMockContacts];
    setChats(combinedChats);
    
    if (combinedChats.length > 0 && !activeChatId) {
      setActiveChatId(combinedChats[0]._id);
    }
  }, [connections]);

  const activeChat = chats.find((c) => c._id === activeChatId) || chats[0];

  // Scroll to bottom of message list on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeChat) return;

    const newMessage = {
      sender: "me",
      text: typedMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Update active chat messages
    const updatedChats = chats.map((chat) => {
      if (chat._id === activeChat._id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setTypedMessage("");

    // Simulate dummy reply
    setTimeout(() => {
      const replyText =
        activeChat.replies?.[Math.floor(Math.random() * activeChat.replies.length)] ||
        "Sounds good, let's keep in touch!";
      
      const replyMessage = {
        sender: "contact",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat._id === activeChat._id) {
            return {
              ...chat,
              messages: [...chat.messages, replyMessage],
            };
          }
          return chat;
        })
      );
    }, 1500);
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
                  onClick={() => setActiveChatId(chat._id)}
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
