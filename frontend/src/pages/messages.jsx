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

    // Combine connections with mock contacts to populate chats list
    const connectionChats = connections.map((c) => ({
      _id: c._id || c.id,
      name: c.name,
      headline: c.headline || "LinkedIn Member",
      profilePicture: c.profilePicture,
      messages: defaultMessagesMap[c.name] || [
        { sender: "contact", text: `Hi, thank you for connecting! How are you doing?`, time: "12:00 PM" },
      ],
    }));

    // Filter out mock contacts that are already in connections
    const filteredMockContacts = defaultMockContacts.filter(
      (mock) => !connectionChats.some((cc) => cc.name.toLowerCase() === mock.name.toLowerCase())
    );

    const combinedChats = [...connectionChats, ...filteredMockContacts];
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

    // Check for job openings/hiring/careers keywords
    const isJobQuery = text.includes("job") || text.includes("opening") || text.includes("career") || text.includes("hiring") || text.includes("recruit") || text.includes("internship") || text.includes("position") || text.includes("role") || text.includes("vacancy");
    
    // Check for sync/meet keywords
    const isMeetQuery = text.includes("meeting") || text.includes("schedule") || text.includes("meet") || text.includes("sync") || text.includes("call") || text.includes("chat");

    // Check for greeting keywords
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

    // Fallback generic but polite responses for regular connections
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
