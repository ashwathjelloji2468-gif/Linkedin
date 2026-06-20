import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchConnections } from "@/config/redux/action/authAction";
import { API_BASE_URL } from "@/config";

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

  // Initialize the list of chats on mount/connections load
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

    const defaultMessagesMap = {
      "Satya Nadella": [
        { sender: "contact", text: "Hello! Loved your latest post on AI agents.", time: "10:30 AM" },
        { sender: "me", text: "Thank you Satya! Really excited about the future of tech.", time: "10:32 AM" },
      ],
      "Sundar Pichai": [
        { sender: "contact", text: "Let's schedule some time to chat about Google Cloud integration.", time: "Yesterday" },
      ],
      "Elon Musk": [
        { sender: "contact", text: "How is the scaling of your AI models going? We need more compute.", time: "2 days ago" },
      ],
      "Sam Altman": [
        { sender: "contact", text: "Hey! What are you building with the new GPT-4o API?", time: "3 days ago" },
      ],
      "Jensen Huang": [
        { sender: "contact", text: "The Blackwell GPUs are in full production. Let me know if you need allocation.", time: "1 week ago" },
      ],
      "Mark Zuckerberg": [
        { sender: "contact", text: "Llama 3 is open source and fully accessible. Let's build something cool.", time: "1 week ago" },
      ],
    };

    // Combine connections with mock contacts
    const connectionChats = connections.map((c) => ({
      _id: c._id || c.id,
      name: c.name,
      headline: c.headline || "LinkedIn Member",
      profilePicture: c.profilePicture,
      messages: defaultMessagesMap[c.name] || [
        { sender: "contact", text: `Hi, thank you for connecting! How are you doing?`, time: "12:00 PM" },
      ],
    }));

    const filteredMockContacts = defaultMockContacts.filter(
      (mock) => !connectionChats.some((cc) => cc.name.toLowerCase() === mock.name.toLowerCase())
    );

    setChats([...connectionChats, ...filteredMockContacts]);
  }, [connections]);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleOpenChatBox = (chatId) => {
    // If the chat box is already open, do nothing or restore it if collapsed
    const exists = openChatBoxes.find((box) => box._id === chatId);
    if (exists) {
      setOpenChatBoxes(
        openChatBoxes.map((box) =>
          box._id === chatId ? { ...box, collapsed: false } : box
        )
      );
    } else {
      // Limit to max 2 active chat boxes to avoid UI clutter
      const newBoxes = [...openChatBoxes];
      if (newBoxes.length >= 2) {
        newBoxes.shift(); // remove oldest
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

  const generateHumanizedResponse = (contactName, userText) => {
    const text = userText.toLowerCase();

    const isJobQuery = text.includes("job") || text.includes("opening") || text.includes("career") || text.includes("hiring") || text.includes("recruit") || text.includes("internship") || text.includes("position") || text.includes("role") || text.includes("vacancy");
    const isMeetQuery = text.includes("meeting") || text.includes("schedule") || text.includes("meet") || text.includes("sync") || text.includes("call") || text.includes("chat");
    const isGreeting = text.includes("hello") || text.includes("hi") || text.includes("hey") || text.includes("how are you") || text.includes("good morning") || text.includes("good afternoon");

    if (contactName === "Satya Nadella") {
      if (isJobQuery) {
        return "We are always looking for stellar engineering talent, particularly in our Azure AI and Web XT teams. We actually have a few openings for Frontend and Fullstack developers right now - you should check out the Microsoft Careers portal, or if you find a specific role you match well, let me know and I can flag it for our recruiting leads!";
      }
      if (isMeetQuery) {
        return "Absolutely, I'll have my team coordinate a 15-minute sync for next week. Looking forward to discussing developer platforms and how we can support your work further!";
      }
      if (text.includes("agent") || text.includes("ai") || text.includes("copilot")) {
        return "Yes, Microsoft Copilot and AI agents are transforming every industry. We believe the future of software is agentic, where every developer has a team of autonomous agents assisting them. How are you thinking about deploying them in your work?";
      }
      if (isGreeting) {
        return "Hello! Great to connect with you. Hope you are doing well and building great things. What projects are keeping you busy these days?";
      }
      return "Interesting thoughts. At Microsoft, we believe in employing every developer and organizing to achieve success. Let's keep exploring how we can build a more collaborative and open ecosystem together.";
    }

    if (contactName === "Sundar Pichai") {
      if (isJobQuery) {
        return "Google is actively hiring across our Google Cloud, Core Systems, and Vertex AI UI teams. If you possess strong skills in React/Next.js and fullstack integration, you would fit right in. Take a look at Google Careers and send me the job ID of any position that catches your eye!";
      }
      if (isMeetQuery) {
        return "I'll have my assistant coordinate a quick Google Meet session next week. Looking forward to discussing Google Cloud integrations and developer API workflows!";
      }
      if (text.includes("cloud") || text.includes("gcp") || text.includes("vertex") || text.includes("integration")) {
        return "Google Cloud GCP and Vertex AI are seeing massive developer adoption. The combination of Gemini models with robust infrastructure allows building very premium user interfaces and agent workflows.";
      }
      if (isGreeting) {
        return "Hi there! Glad to connect. How has your experience been building on top of Google developer platforms and APIs?";
      }
      return "Thank you for sharing that perspective. I will pass these insights to our Developer Relations and Product teams. Let's keep in touch!";
    }

    if (contactName === "Elon Musk") {
      if (isJobQuery) {
        return "Tesla, SpaceX, and xAI are hiring hardcore engineers. If you write clean, high-performance code and want to solve hard physics or AI alignment problems, send over your GitHub and resume. We don't care about degrees, only exceptional ability.";
      }
      if (isMeetQuery) {
        return "Very busy with Starship launches and Tesla FSD meetings, but send over your project proposal. If it sounds high-conviction, we can do a brief sync.";
      }
      if (text.includes("tesla") || text.includes("fsd") || text.includes("autopilot")) {
        return "Tesla FSD v12 is completely neural-net based. It is solving real-world AI. Real-world physical AI is the hardest and most important problem.";
      }
      if (text.includes("spacex") || text.includes("starship") || text.includes("mars")) {
        return "Starship is crucial for making life multiplanetary. We must build a self-sustaining city on Mars to preserve the light of consciousness.";
      }
      if (isGreeting) {
        return "Hi. What are you building right now? What are the biggest bottlenecks in your tech stack?";
      }
      return "Accelerating engineering and clean tech is the priority. Let's make sure we are focused on first-principles thinking.";
    }

    if (contactName === "Sam Altman") {
      if (isJobQuery) {
        return "OpenAI is growing extremely fast. We have openings across our ML Platform, API Infrastructure, and Product Engineering teams. We pay top market rates and work on the most important technology of our time. Send me your details, and I will route them to our hiring team.";
      }
      if (isMeetQuery) {
        return "I'd love to sync. Let's set up a quick Zoom next Tuesday afternoon. I'll have my team send over a calendar invite.";
      }
      if (text.includes("gpt") || text.includes("openai") || text.includes("agi")) {
        return "AGI is coming sooner than most think, and we want to ensure it benefits all of humanity. What features are you building with the new GPT-4o API?";
      }
      if (isGreeting) {
        return "Hey! Great to connect. What are you building with generative AI? Let me know if you need developer platform credits to scale up.";
      }
      return "The rate of AI progress is exponential. It's an incredible time to be a developer. Let's keep collaborating.";
    }

    if (contactName === "Jensen Huang") {
      if (isJobQuery) {
        return "At NVIDIA, we are hiring system software engineers, CUDA developers, and deep learning platform engineers. If you understand accelerated computing, computer architecture, and distributed training pipelines, there's no better place to work.";
      }
      if (isMeetQuery) {
        return "I'd love to chat. Let's sync next week. I'll have my assistant set up a meeting to discuss GPU workloads and optimization.";
      }
      if (text.includes("gpu") || text.includes("nvidia") || text.includes("blackwell") || text.includes("cuda")) {
        return "NVIDIA is no longer just a chip company; we are an AI factory. Blackwell is the engine of the next industrial revolution. Remember, the more you buy, the more you save!";
      }
      if (isGreeting) {
        return "Hello! Welcome to the accelerated computing revolution. What kind of AI models are you training or running inference on?";
      }
      return "Accelerated computing is the only sustainable path forward for IT. Let's keep optimizing.";
    }

    if (contactName === "Mark Zuckerberg") {
      if (isJobQuery) {
        return "Meta is pushing hard on open-source Llama and spatial computing. We are looking for product engineers who want to build the metaverse and next-generation social apps. Check out Meta Careers and send me your profile info if you find a good fit!";
      }
      if (isMeetQuery) {
        return "Let's coordinate a brief sync. I'll have my team send over a calendar invite for next week. Looking forward to it!";
      }
      if (text.includes("llama") || text.includes("open source")) {
        return "Open-source AI is the best path forward. Llama 3 is pushing the frontier of open weights, and we're committed to keeping it open. It lets developers build with total control.";
      }
      if (isGreeting) {
        return "Hi! Glad to connect. Meta is building tools to help people connect and build community. What technologies are you using to build your apps?";
      }
      return "Exciting times ahead. Keep building and pushing the boundaries of what's possible with open technology!";
    }

    if (isGreeting) {
      return `Hi! Great to connect with you. How are things going on your end?`;
    }
    if (isJobQuery) {
      return `Yes, our company is currently hiring! We have open positions for frontend and fullstack developer roles. Feel free to check out our company page or send me your resume, and I will gladly forward it to our recruiting team!`;
    }
    if (isMeetQuery) {
      return `I'd love to sync! Let me check my calendar for next week and send over a few options. Speak soon!`;
    }
    return `Thanks for the message! That makes a lot of sense. Let's stay in touch and coordinate a time to chat further.`;
  };

  const handleSendMessage = (chatId, textToSend) => {
    if (!textToSend.trim()) return;

    const newMessage = {
      sender: "me",
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Update messages in the chats list
    let targetChat = null;
    const updatedChats = chats.map((chat) => {
      if (chat._id === chatId) {
        targetChat = chat;
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
        };
      }
      return chat;
    });

    setChats(updatedChats);
    
    // Clear message from the specific chat box
    setOpenChatBoxes(
      openChatBoxes.map((box) =>
        box._id === chatId ? { ...box, typedMessage: "" } : box
      )
    );

    // Simulate smart CEO reply
    if (targetChat) {
      setTimeout(() => {
        const replyText = generateHumanizedResponse(targetChat.name, newMessage.text);
        const replyMessage = {
          sender: "contact",
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat._id === chatId) {
              return {
                ...chat,
                messages: [...chat.messages, replyMessage],
              };
            }
            return chat;
          })
        );
      }, 1500);
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
        {/* Drawer Header */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between px-3 py-2 border-b border-slate-200 cursor-pointer h-11 hover:bg-slate-50 transition-colors select-none rounded-t-lg"
        >
          <div className="flex items-center gap-2">
            {/* User Profile Avatar with Online Dot */}
            <div className="relative">
              {user?.profilePicture ? (
                <img
                  src={`${API_BASE_URL}/uploads/${user.profilePicture.replace("uploads/", "")}`}
                  alt="me"
                  className="w-6 h-6 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-[9px]">
                  {getInitials(user?.name)}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-600 border border-white"></span>
            </div>
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
                            src={`${API_BASE_URL}/uploads/${chat.profilePicture.replace("uploads/", "")}`}
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
          <div className="relative flex-shrink-0">
            {chat.profilePicture ? (
              <img
                src={`${API_BASE_URL}/uploads/${chat.profilePicture.replace("uploads/", "")}`}
                alt="avatar"
                className="w-6 h-6 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-[9px]">
                {getInitials(chat.name)}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-600 border border-white"></span>
          </div>

          <div className="overflow-hidden">
            <span className="text-[11px] font-bold text-slate-800 truncate block hover:text-[#0077b5]">
              {chat.name}
            </span>
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
