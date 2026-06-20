import News from "../models/news.models.js";
import User from "../models/users.models.js";

// Helper to seed news articles if empty
export const seedNewsIfEmpty = async () => {
  try {
    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      const defaultArticles = [
        {
          title: "India-UK CETA: What it means for trade",
          content: "The India-UK Comprehensive Economic Trade Agreement (CETA) is entering its final rounds of negotiations. Trade analysts suggest that a trade deal could boost bilateral trade by billions of dollars, opening up service sectors, tech collaboration, and reducing tariffs on whiskey, automobiles, and dairy products. Both nations are optimistic about signing the pact before the end of the fiscal year.",
          author: "Rohan Sen (Trade Editor)",
          time: "21h ago",
          readers: "1,174 readers",
          category: "Economy",
          likes: 24,
          comments: [
            { userName: "Satya Nadella", text: "A trade pact like this will facilitate greater collaborative engineering exchange between the UK and India tech hubs." }
          ]
        },
        {
          title: "Korean instant noodles cook up India sales",
          content: "Korean ramyun is seeing exponential growth in the Indian market, driven by the popularity of K-pop, K-dramas, and a shifting consumer appetite for spicy and quick meals. Brands like Samyang and Nongshim have reports of over 100% year-on-year sales growth in major metropolitan cities. Local retail chains are expanding dedicated sections for Korean imports to meet local demand.",
          author: "Anjali Mehta (Business Reporter)",
          time: "19h ago",
          readers: "843 readers",
          category: "Business",
          likes: 42,
          comments: [
            { userName: "Mark Zuckerberg", text: "Fascinating shift. Viral social media trends on Instagram Reels have definitely accelerated this consumer demand!" }
          ]
        },
        {
          title: "Banks rejig strategies to retain NRI deposits",
          content: "Indian public and private sector banks are revising interest rates and introducing customized wealth management options to retain Non-Resident Indian (NRI) deposits. With global interest rates fluctuating and domestic credit demands rising, attracting foreign remittances remains a critical focus area. New digital banking platforms tailored for NRIs are facilitating frictionless cross-border transactions.",
          author: "Siddharth Rao (Financial Analyst)",
          time: "15h ago",
          readers: "435 readers",
          category: "Finance",
          likes: 12,
          comments: []
        },
        {
          title: "Rural e-commerce startups attract funding",
          content: "Startups focusing on supply chains and logistics in tier-3 and tier-4 cities in India are witnessing a surge in seed and Series-A funding rounds. Investors are highly optimistic about digitizing rural retail trade, providing access to consumer electronics, fresh produce, and fintech credit services to thousands of villages that were previously underserved.",
          author: "Pooja Hegde (Tech Reporter)",
          time: "17h ago",
          readers: "361 readers",
          category: "Tech",
          likes: 19,
          comments: []
        },
        {
          title: "India shines in global clean energy race",
          content: "India has reached a key milestone in renewable energy capacity, surpassing its targets for solar and wind power installations. Massive clean energy parks in Gujarat and Rajasthan are supplying gigawatts of power to the grid. Foreign investments are pouring into India's green hydrogen projects, establishing the country as a leading hub for clean energy export.",
          author: "Vikram Malhotra (Climate Editor)",
          time: "19h ago",
          readers: "309 readers",
          category: "Sustainability",
          likes: 56,
          comments: [
            { userName: "Elon Musk", text: "Accelerating clean energy generation and battery storage capability is critical for a sustainable future." }
          ]
        },
        {
          title: "Next.js 16 releases advanced dev tooling",
          content: "Vercel has announced the release of Next.js 16, introducing Turbopack by default for all production builds, advanced server component debugging, and optimized image processing. Developers are praising the massive speedups in hot module reloading (HMR) and cold starts. The framework continues to dominate the modern web application ecosystem.",
          author: "Sarah Connor (Tech Lead)",
          time: "1d ago",
          readers: "4,512 readers",
          category: "Technology",
          likes: 132,
          comments: [
            { userName: "Sundar Pichai", text: "Google Chrome works closely with Vercel to optimize framework core web vitals. Great release." }
          ]
        },
        {
          title: "Hiring trends pivot towards Agentic AI developers",
          content: "Hiring managers at Google, Microsoft, and OpenAI report a dramatic shift in recruitment criteria, prioritizing engineers with experience in building autonomous agentic loops, prompt routing, and vector memory systems. Understanding multi-agent orchestration tools like LangGraph or Autogen is now a highly sought-after skill in top-tier tech companies.",
          author: "David Miller (HR Insights)",
          time: "2d ago",
          readers: "12,940 readers",
          category: "Career",
          likes: 245,
          comments: [
            { userName: "Sam Altman", text: "Agentic capabilities are scaling rapidly. Developing software using agentic loops is indeed the future." }
          ]
        },
        {
          title: "Secunderabad tech startups raise seed funding",
          content: "Startups in the Secunderabad and Hyderabad region are securing significant funding, demonstrating the expansion of the local startup ecosystem beyond standard tech parks. Focus areas range from SaaS applications for healthcare to spatial computing and drone navigation systems. Local incubators and CBIT tech hubs are fostering a new wave of student entrepreneurship.",
          author: "K. Srinivas (Local Tech Reporter)",
          time: "3d ago",
          readers: "612 readers",
          category: "Startups",
          likes: 38,
          comments: [
            { userName: "Jensen Huang", text: "Accelerated computing and AI startups are expanding globally. Great to see Hyderabad's local ecosystem growing so fast." }
          ]
        }
      ];

      await News.insertMany(defaultArticles);
      console.log("News articles seeded successfully.");
    }
  } catch (error) {
    console.error("Error seeding news:", error.message);
  }
};

// 1. Get all news
export const getNews = async (req, res) => {
  try {
    const articles = await News.find().sort({ createdAt: -1 });
    return res.status(200).json({ articles });
  } catch (error) {
    console.error("Get news error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 2. Get news by ID
export const getNewsById = async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "News article not found" });
    }
    return res.status(200).json({ article });
  } catch (error) {
    console.error("Get news by ID error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 3. Toggle like on news
export const likeNews = async (req, res) => {
  try {
    const userId = req.user.id;
    const article = await News.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "News article not found" });
    }

    const likedIndex = article.likedBy.indexOf(userId);
    if (likedIndex === -1) {
      // Like
      article.likedBy.push(userId);
      article.likes += 1;
    } else {
      // Unlike
      article.likedBy.splice(likedIndex, 1);
      article.likes = Math.max(0, article.likes - 1);
    }

    await article.save();
    return res.status(200).json({
      message: "Like status updated successfully",
      likes: article.likes,
      likedBy: article.likedBy
    });
  } catch (error) {
    console.error("Like news error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 4. Add comment to news
export const commentNews = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const article = await News.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "News article not found" });
    }

    const newComment = {
      userName: user.name,
      text: text.trim(),
      createdAt: new Date()
    };

    article.comments.push(newComment);
    await article.save();

    return res.status(200).json({
      message: "Comment added successfully",
      comments: article.comments
    });
  } catch (error) {
    console.error("Comment news error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
