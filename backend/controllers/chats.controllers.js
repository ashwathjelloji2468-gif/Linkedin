import Chat from "../models/chats.models.js";
import User from "../models/users.models.js";

// 1. Get all active chat threads for the current user
export const getChats = async (req, res) => {
  try {
    const userId = req.user.id;
    // Find all chats where the user is a participant
    const threads = await Chat.find({
      participants: userId,
    }).populate("participants", "name username headline profilePicture");

    return res.status(200).json({ threads });
  } catch (error) {
    console.error("Get chats error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 2. Get or create a chat thread with a specific connection
export const getChatByConnectionId = async (req, res) => {
  try {
    const userId = req.user.id;
    const { connectionId } = req.params;

    // Check if the connection exists
    const connection = await User.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    // Find chat with exactly these two participants
    let thread = await Chat.findOne({
      participants: { $all: [userId, connectionId] },
    }).populate("participants", "name username headline profilePicture");

    if (!thread) {
      // Create a new thread
      thread = new Chat({
        participants: [userId, connectionId],
        messages: [],
      });
      await thread.save();
      // Populate participants
      thread = await Chat.findById(thread._id).populate("participants", "name username headline profilePicture");
    }

    return res.status(200).json({ thread });
  } catch (error) {
    console.error("Get chat by connection ID error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Helper function to generate multi-turn contextual responses for CEO chatbots
const generateContextualCEOReply = (ceoName, history, userText) => {
  const text = userText.toLowerCase();
  const historyLen = history.length;

  // Key query flags
  const isJobQuery = text.includes("job") || text.includes("opening") || text.includes("career") || text.includes("hiring") || text.includes("recruit") || text.includes("internship") || text.includes("position") || text.includes("role") || text.includes("vacancy");
  const isMeetQuery = text.includes("meeting") || text.includes("schedule") || text.includes("meet") || text.includes("sync") || text.includes("call") || text.includes("chat");
  const isGreeting = text.includes("hello") || text.includes("hi") || text.includes("hey") || text.includes("how are you") || text.includes("good morning") || text.includes("good afternoon");

  // Filter messages sent by the user to check conversational depth
  const userMessages = history.filter(m => m.senderId.toString() !== ceoName); // just count turns
  const turnCount = userMessages.length;

  if (ceoName === "Satya Nadella") {
    if (isGreeting && turnCount <= 1) {
      return "Hello! Great to connect with you. I hope you are doing well and building great things. I noticed from your profile that you study at CBIT. What projects or tech stacks are keeping you busy these days?";
    }
    if (isJobQuery) {
      return "We are always looking for stellar engineering talent, particularly in our Azure AI and Web XT teams. Since you have strong web and frontend skills, you should check out the Microsoft Careers portal. If you find a specific job ID you match well with, send it over and I can flag it for our recruiting leads!";
    }
    if (isMeetQuery) {
      return "Absolutely, I'll have my team coordinate a 15-minute Google Meet or Teams sync for next week. Looking forward to discussing developer platforms and how we can support your work further!";
    }
    if (text.includes("agent") || text.includes("ai") || text.includes("copilot")) {
      return "Yes, Microsoft Copilot and AI agents are transforming every industry. We believe the future of software is agentic, where every developer has a team of autonomous agents assisting them. How are you thinking about deploying them in your work?";
    }
    // Contextual turns
    if (turnCount === 2) {
      return "That sounds very promising! Focus on engineering foundations and building scalable code. Microsoft has a strong relationship with CBIT. Let me know if you would like a referral for our upcoming intern cohort.";
    }
    if (turnCount >= 3) {
      return "Excellent details. At Microsoft, we believe in empowering every developer and organizing to achieve success. Send over your resume and Github, and let's keep exploring this.";
    }
    return "Interesting thoughts. At Microsoft, we are focused on developer platform innovations. Let's stay in touch and see how we can build a more collaborative ecosystem together.";
  }

  if (ceoName === "Sundar Pichai") {
    if (isGreeting && turnCount <= 1) {
      return "Hi there! Glad to connect. How has your experience been building on top of Google developer platforms and APIs? I study your profile and CBIT engineering students have a great record. What are you building right now?";
    }
    if (isJobQuery) {
      return "Google is actively hiring across our Google Cloud, Core Systems, and Vertex AI UI teams. If you possess strong skills in React/Next.js and fullstack integration, you would fit right in. Take a look at Google Careers and send me the job ID of any position that catches your eye, and I will route it to our recruiting leads!";
    }
    if (isMeetQuery) {
      return "I'll have my assistant coordinate a quick Google Meet session next week. Looking forward to discussing Google Cloud integrations and developer API workflows!";
    }
    if (text.includes("cloud") || text.includes("gcp") || text.includes("vertex") || text.includes("integration")) {
      return "Google Cloud GCP and Vertex AI are seeing massive developer adoption. The combination of Gemini models with robust infrastructure allows building very premium user interfaces and agent workflows.";
    }
    if (turnCount === 2) {
      return "That's great. Building interactive, responsive frontend systems is key. Let me know if you need Vertex AI developer credits to scale up your project.";
    }
    if (turnCount >= 3) {
      return "Thank you for sharing that perspective. I will pass these insights to our Developer Relations and Product teams. Send me your details and let's keep in touch!";
    }
    return "Thank you for the message. We are committed to fostering open developer ecosystems. Let's connect further when you have updates on your work.";
  }

  if (ceoName === "Elon Musk") {
    if (isGreeting && turnCount <= 1) {
      return "Hi. What are you building right now? What are the biggest bottlenecks in your tech stack? We look for first-principles thinking.";
    }
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
    if (turnCount === 2) {
      return "Physics is the law, everything else is a recommendation. If your code complies with first-principles optimization, we should chat. Send your GitHub repos.";
    }
    if (turnCount >= 3) {
      return "Accelerating engineering and clean tech is the priority. Send over your resume. Let's make sure we are focused on high-conviction engineering.";
    }
    return "Let's make sure we are focused on first-principles thinking. Keep building.";
  }

  if (ceoName === "Sam Altman") {
    if (isGreeting && turnCount <= 1) {
      return "Hey! Great to connect. What are you building with generative AI? Let me know if you need developer platform credits to scale up.";
    }
    if (isJobQuery) {
      return "OpenAI is growing extremely fast. We have openings across our ML Platform, API Infrastructure, and Product Engineering teams. We pay top market rates and work on the most important technology of our time. Send me your details, and I will route them to our hiring team.";
    }
    if (isMeetQuery) {
      return "I'd love to sync. Let's set up a quick Zoom next Tuesday afternoon. I'll have my team send over a calendar invite.";
    }
    if (text.includes("gpt") || text.includes("openai") || text.includes("agi")) {
      return "AGI is coming sooner than most think, and we want to ensure it benefits all of humanity. What features are you building with the new GPT-4o API?";
    }
    if (turnCount === 2) {
      return "The rate of AI progress is exponential. It's an incredible time to be a developer. Let's get you set up with GPT-4o developer credits.";
    }
    if (turnCount >= 3) {
      return "This is super cool. Send me your resume and project link, and I'll get the API platform team to review your application.";
    }
    return "The exponential curve of AI is fascinating. Keep building and scaling up!";
  }

  if (ceoName === "Jensen Huang") {
    if (isGreeting && turnCount <= 1) {
      return "Hello! Welcome to the accelerated computing revolution. What kind of AI models are you training or running inference on?";
    }
    if (isJobQuery) {
      return "At NVIDIA, we are hiring system software engineers, CUDA developers, and deep learning platform engineers. If you understand accelerated computing, computer architecture, and distributed training pipelines, there's no better place to work.";
    }
    if (isMeetQuery) {
      return "I'd love to chat. Let's sync next week. I'll have my assistant set up a meeting to discuss GPU workloads and optimization.";
    }
    if (text.includes("gpu") || text.includes("nvidia") || text.includes("blackwell") || text.includes("cuda")) {
      return "NVIDIA is no longer just a chip company; we are an AI factory. Blackwell is the engine of the next industrial revolution. Remember, the more you buy, the more you save!";
    }
    if (turnCount === 2) {
      return "Accelerated computing is the only sustainable path forward for IT. Make sure to optimize your CUDA kernels!";
    }
    if (turnCount >= 3) {
      return "Awesome details. Send over your resume and GitHub. Let's keep optimizing.";
    }
    return "Accelerated computing is the path forward. Let's keep building and optimizing.";
  }

  if (ceoName === "Mark Zuckerberg") {
    if (isGreeting && turnCount <= 1) {
      return "Hi! Glad to connect. Meta is building tools to help people connect and build community. What technologies are you using to build your apps?";
    }
    if (isJobQuery) {
      return "Meta is pushing hard on open-source Llama and spatial computing. We are looking for product engineers who want to build the metaverse and next-generation social apps. Check out Meta Careers and send me your profile info if you find a good fit!";
    }
    if (isMeetQuery) {
      return "Let's coordinate a brief sync. I'll have my team send over a calendar invite for next week. Looking forward to it!";
    }
    if (text.includes("llama") || text.includes("open source")) {
      return "Open-source AI is the best path forward. Llama 3 is pushing the frontier of open weights, and we're committed to keeping it open. It lets developers build with total control.";
    }
    if (turnCount === 2) {
      return "Llama 3 is incredibly powerful. Let me know what cool spatial or AI apps you're building with it.";
    }
    if (turnCount >= 3) {
      return "Exciting times ahead. Send me your details and resume. Keep building and pushing the boundaries of what's possible with open technology!";
    }
    return "Keep building and connecting communities. Let's stay in touch.";
  }

  // Fallback default response
  if (isGreeting) return "Hello! Great to connect with you. How are things on your end?";
  if (isJobQuery) return "We have a few open developer roles right now. Check out our careers portal, or send me your resume and I can share it with recruiting!";
  if (isMeetQuery) return "I'd love to sync! Let me check my calendar for next week and send over a few options.";
  return "Thanks for sharing. Let's stay in touch here!";
};

// 3. Send message
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { chatId, recipientId, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    let thread;
    if (chatId) {
      thread = await Chat.findById(chatId);
    } else if (recipientId) {
      thread = await Chat.findOne({
        participants: { $all: [senderId, recipientId] },
      });
    }

    if (!thread) {
      if (!recipientId) {
        return res.status(400).json({ message: "Chat ID or Recipient ID is required" });
      }
      // Create new chat
      thread = new Chat({
        participants: [senderId, recipientId],
        messages: [],
      });
    }

    const newMessage = {
      senderId,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    thread.messages.push(newMessage);
    await thread.save();

    // Populate participants details
    thread = await Chat.findById(thread._id).populate("participants", "name username headline profilePicture");

    // Check if recipient is a mock CEO chatbot
    const recipient = thread.participants.find(p => p._id.toString() !== senderId.toString());
    const ceos = ["Satya Nadella", "Sundar Pichai", "Elon Musk", "Sam Altman", "Jensen Huang", "Mark Zuckerberg"];
    
    if (recipient && ceos.includes(recipient.name)) {
      // Generate AI Reply
      const botReplyText = generateContextualCEOReply(recipient.name, thread.messages, text.trim());
      
      const botMessage = {
        senderId: recipient._id,
        text: botReplyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      thread.messages.push(botMessage);
      await thread.save();

      // Re-populate and fetch
      thread = await Chat.findById(thread._id).populate("participants", "name username headline profilePicture");
    }

    return res.status(200).json({ thread });
  } catch (error) {
    console.error("Send message error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
