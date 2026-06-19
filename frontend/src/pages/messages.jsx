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
      },
      {
        _id: "mock2",
        name: "Sundar Pichai",
        headline: "CEO at Google & Alphabet",
        profilePicture: "",
        messages: [
          { sender: "contact", text: "Let's schedule some time to chat about Google Cloud integration.", time: "Yesterday" },
        ],
      },
      {
        _id: "mock3",
        name: "Elon Musk",
        headline: "CEO at Tesla, SpaceX & xAI",
        profilePicture: "",
        messages: [
          { sender: "contact", text: "How is the scaling of your AI models going? We need more compute.", time: "2 days ago" },
        ],
      },
      {
        _id: "mock4",
        name: "Sam Altman",
        headline: "CEO at OpenAI",
        profilePicture: "",
        messages: [
          { sender: "contact", text: "Hey! What are you building with the new GPT-4o API?", time: "3 days ago" },
        ],
      },
      {
        _id: "mock5",
        name: "Jensen Huang",
        headline: "CEO at NVIDIA",
        profilePicture: "",
        messages: [
          { sender: "contact", text: "The Blackwell GPUs are in full production. Let me know if you need allocation.", time: "1 week ago" },
        ],
      },
      {
        _id: "mock6",
        name: "Mark Zuckerberg",
        headline: "CEO at Meta",
        profilePicture: "",
        messages: [
          { sender: "contact", text: "Llama 3 is open source and fully accessible. Let's build something cool.", time: "1 week ago" },
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

  const generateHumanizedResponse = (contactName, userText) => {
    const text = userText.toLowerCase();
    
    if (contactName === "Satya Nadella") {
      if (text.includes("agent") || text.includes("ai") || text.includes("copilot")) {
        return "Yes, Microsoft Copilot and AI agents are transforming every industry. How are you thinking about deploying them in your work?";
      }
      if (text.includes("meeting") || text.includes("schedule") || text.includes("meet") || text.includes("sync")) {
        return "Absolutely, I'll have my team coordinate a 15-minute sync for next week. Looking forward to discussing developer platforms further!";
      }
      if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
        return "Hello! Great to connect with you. Hope you are doing well and building great things.";
      }
      return "Interesting thoughts. At Microsoft, we believe in empowering every developer and organization to achieve more. Let's keep exploring this.";
    }

    if (contactName === "Sundar Pichai") {
      if (text.includes("cloud") || text.includes("google cloud") || text.includes("gcp") || text.includes("integration")) {
        return "Google Cloud is seeing massive momentum, especially with our Vertex AI and Gemini integrations. Let's sync on your backend setup!";
      }
      if (text.includes("gemini") || text.includes("ai") || text.includes("model")) {
        return "Gemini is at the core of Google's future. The multi-modal capabilities are opening up completely new paradigms for web developers.";
      }
      if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
        return "Hi there! Glad to connect. How has your experience been building on top of Google APIs?";
      }
      return "Thank you for sharing that. I will pass these insights to the developer relations team. Let's keep in touch!";
    }

    if (contactName === "Elon Musk") {
      if (text.includes("tesla") || text.includes("car") || text.includes("autopilot") || text.includes("fsd")) {
        return "Tesla FSD and Optimus are solving real-world AI. Next-generation FSD v12 is mind-blowing. Full autonomous transport is coming.";
      }
      if (text.includes("spacex") || text.includes("mars") || text.includes("rocket") || text.includes("starship")) {
        return "Starship is designed to make life multiplanetary. We need to build a self-sustaining city on Mars to preserve the consciousness.";
      }
      if (text.includes("x") || text.includes("twitter") || text.includes("ai") || text.includes("grok")) {
        return "X is the global real-time town square. Grok will continue to get better rapidly as it trains on real-time data.";
      }
      return "Accelerating sustainable energy and engineering is key. What projects are you working on right now?";
    }

    if (contactName === "Sam Altman") {
      if (text.includes("gpt") || text.includes("openai") || text.includes("agi") || text.includes("model")) {
        return "AGI is coming sooner than most think, and we want to ensure it benefits all of humanity. What features are you building with GPT-4o?";
      }
      if (text.includes("api") || text.includes("cost") || text.includes("token") || text.includes("pricing")) {
        return "We are actively driving API costs down and increasing speed. Expect massive improvements in cost-efficiency this year.";
      }
      return "The speed of AI progress is exponential. Let me know if you need enterprise credits to scale your startup or projects.";
    }

    if (contactName === "Jensen Huang") {
      if (text.includes("gpu") || text.includes("nvidia") || text.includes("chip") || text.includes("blackwell")) {
        return "NVIDIA is no longer just a chip company; we are an AI factory. Blackwell is the engine of the next industrial revolution.";
      }
      if (text.includes("cuda") || text.includes("software") || text.includes("developer")) {
        return "CUDA is the bedrock of accelerated computing. It has taken 20 years of dedication to build this ecosystem.";
      }
      return "Remember, the more you buy, the more you save! Accelerated computing is the only sustainable path forward.";
    }

    if (contactName === "Mark Zuckerberg") {
      if (text.includes("llama") || text.includes("open source") || text.includes("meta")) {
        return "Open-source AI is the best path forward. Llama 3 is pushing the frontier of open weights, and we're committed to keeping it open.";
      }
      if (text.includes("vr") || text.includes("ar") || text.includes("quest") || text.includes("metaverse")) {
        return "Quest 3 and Orion AR glasses represent the future of spatial computing. The physical and digital worlds are merging.";
      }
      return "Exciting times ahead. Meta is building tools to help people connect and build community. Glad to have you in the ecosystem.";
    }

    // Fallback generic but polite human-like responses for regular connections
    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
      return `Hi! Great to connect with you. How are things going on your end?`;
    }
    if (text.includes("project") || text.includes("work") || text.includes("job") || text.includes("hire") || text.includes("portfolio")) {
      return `That sounds super interesting! I'd love to hear more about your current project or career goals. Let me know when you'd like to sync.`;
    }
    return `Thanks for the message! That makes a lot of sense. Let's stay in touch and coordinate a time to chat further.`;
  };

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

    // Simulate smart context-aware reply
    setTimeout(() => {
      const replyText = generateHumanizedResponse(activeChat.name, newMessage.text);
      
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
