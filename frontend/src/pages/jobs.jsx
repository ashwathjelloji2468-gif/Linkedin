import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import api, { API_BASE_URL } from "@/config";
import { updateProfile } from "@/config/redux/action/authAction";

export default function Jobs() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(1);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeOption, setResumeOption] = useState("profile");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'applied'
  const [viewMode, setViewMode] = useState("dashboard"); // 'dashboard' | 'browser'

  // Interactive sidebar modals state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);

  // New Job post form state
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobCompany, setNewJobCompany] = useState("");
  const [newJobLocation, setNewJobLocation] = useState("");
  const [newJobSalary, setNewJobSalary] = useState("");
  const [newJobDesc, setNewJobDesc] = useState("");
  const [newJobReqs, setNewJobReqs] = useState("");

  // User preferences state
  const [prefTitle, setPrefTitle] = useState("Software Developer Intern");
  const [prefLocation, setPrefLocation] = useState("Hyderabad, India");
  const [prefRemote, setPrefRemote] = useState(true);

  // 20 Initial Job Listings (hardcoded & dynamic)
  const [jobsList, setJobsList] = useState([
    {
      id: 1,
      title: "Python Developer Intern",
      company: "QSkill",
      location: "India (Remote)",
      posted: "1 day ago",
      logoBg: "bg-purple-100 text-purple-650 font-bold border border-purple-300",
      logoText: "QS",
      description: "Build server-side scripting models, optimize database schemas, and create RESTful JSON endpoints. Assist in training machine learning classifiers and deploying Python applications.",
      requirements: [
        "Familiarity with Python, Django, or Flask",
        "Understanding of SQL databases and REST APIs",
        "Basic knowledge of machine learning models is a plus"
      ],
      salary: "₹18,000 - ₹25,000/month",
      promoted: true
    },
    {
      id: 2,
      title: "Full Stack Web Developer Intern",
      company: "WebBoost Solutions by UM",
      location: "India (Remote)",
      posted: "2 days ago",
      logoBg: "bg-slate-900 text-white font-bold border border-slate-750",
      logoText: "WB",
      description: "Develop interactive front-end panels in React and connect them with Node.js/Express back-end platforms. Maintain state variables, fix bugs, and design responsive layouts.",
      requirements: [
        "Good understanding of JavaScript, HTML, and CSS",
        "Basic experience with React and Node.js",
        "Familiarity with Git version control"
      ],
      salary: "₹20,000 - ₹28,000/month",
      promoted: true,
      earlyApplicant: true
    },
    {
      id: 3,
      title: "Verification Intern",
      company: "AST SpaceMobile",
      location: "Hyderabad (On-site)",
      posted: "4 days ago",
      logoBg: "bg-blue-900 text-white font-bold border border-blue-950",
      logoText: "AST",
      description: "Assist in validating satellite communication software and UI dashboards. Write automated test cases in Python/Bash and check edge telemetry logs.",
      requirements: [
        "Basic understanding of scripting languages (Python/Bash)",
        "Strong analytical and testing logic",
        "Enrolled in B.E./B.Tech in ECE/CSE/IT"
      ],
      salary: "₹25,000 - ₹35,000/month",
      activelyReviewing: true,
      easyApply: true
    },
    {
      id: 4,
      title: "Frontend Engineer (React/Next.js)",
      company: "Google",
      location: "Mountain View, CA (Hybrid)",
      posted: "1 day ago",
      logoBg: "bg-red-100 text-red-650 font-bold",
      logoText: "G",
      description: "We are looking for a Frontend Engineer to build premium, modern web applications using React and Next.js. You will collaborate closely with designers and product managers to create interactive features that wow our users.",
      requirements: [
        "3+ years of experience with React, TypeScript, and Tailwind CSS",
        "Experience building Next.js applications (Pages/App Router)",
        "Excellent communication and collaboration skills",
      ],
      salary: "$140,000 - $180,000/year",
    },
    {
      id: 5,
      title: "Fullstack Developer",
      company: "Stripe",
      location: "San Francisco, CA (Remote)",
      posted: "3 days ago",
      logoBg: "bg-indigo-100 text-indigo-650 font-bold",
      logoText: "S",
      description: "Join our engineering team to build payment infrastructure for the internet. You will work on full-stack systems, managing database schemas, core routing, and crafting sleek dashboard user interfaces.",
      requirements: [
        "4+ years of backend development (Node.js, Express, MongoDB)",
        "Strong React frontend skills",
        "Passion for developer tooling and APIs",
      ],
      salary: "$150,000 - $200,050/year",
    },
    {
      id: 6,
      title: "Developer Relations Engineer",
      company: "Vercel",
      location: "New York, NY (Hybrid)",
      posted: "1 week ago",
      logoBg: "bg-slate-100 text-slate-800 font-bold",
      logoText: "V",
      description: "Help developers build a faster Web. As a DevRel Engineer, you will create content, speak at conferences, and build open-source starters demonstrating the power of Next.js and Vercel deployments.",
      requirements: [
        "Deep knowledge of Next.js, React, and deployment architectures",
        "Public speaking or communication history (blogs, YouTube, workshops)",
        "Empathy for developers and community engagement",
      ],
      salary: "$130,000 - $165,000/year",
    },
    {
      id: 7,
      title: "Senior AI Research Engineer",
      company: "Meta",
      location: "Menlo Park, CA (Hybrid)",
      posted: "2 days ago",
      logoBg: "bg-blue-100 text-blue-655 font-bold",
      logoText: "M",
      description: "Join our FAIR (Fundamental AI Research) team to train next-generation large language models. You will design neural architectures, scale training pipelines, and optimize model inference latency.",
      requirements: [
        "Mastery in Python and PyTorch",
        "Strong understanding of deep learning and Transformers",
        "Experience with Docker, Kubernetes, and distributed GPU training",
      ],
      salary: "$210,000 - $280,000/year",
    },
    {
      id: 8,
      title: "Cloud DevOps Architect",
      company: "Netflix",
      location: "Los Gatos, CA (Hybrid)",
      posted: "4 days ago",
      logoBg: "bg-red-100 text-red-700 font-bold",
      logoText: "N",
      description: "Scale the delivery of entertainment to hundreds of millions of screens worldwide. You will maintain cloud infrastructure, design resilient CI/CD pipelines, and manage our multi-region AWS deployments.",
      requirements: [
        "Expertise with AWS cloud architectures",
        "Strong infrastructure-as-code scripting (Terraform or CloudFormation)",
        "Deep knowledge of Docker, Kubernetes, and Linux internals",
      ],
      salary: "$180,000 - $240,000/year",
    },
    {
      id: 9,
      title: "UI/UX Engineer",
      company: "Airbnb",
      location: "San Francisco, CA (Hybrid)",
      posted: "5 days ago",
      logoBg: "bg-rose-100 text-rose-500 font-bold",
      logoText: "A",
      description: "Bridge the gap between design and engineering. You will collaborate with Figma designers to prototype features, create dynamic micro-animations, and implement our design system.",
      requirements: [
        "Advanced Figma prototyping and Design Systems experience",
        "Expert in React, TypeScript, and CSS/animations",
        "High attention to visual detail and user experience",
      ],
      salary: "$135,000 - $175,000/year",
    },
    {
      id: 10,
      title: "Senior Backend Engineer",
      company: "Amazon",
      location: "Seattle, WA (Hybrid)",
      posted: "6 days ago",
      logoBg: "bg-orange-100 text-orange-605 font-bold",
      logoText: "A",
      description: "Build highly scalable distributed systems powering retail checkout pipelines. You will design robust microservices, optimize database queries, and author clean, reliable Go codebase.",
      requirements: [
        "5+ years of backend development (Go, Java, or C++)",
        "Deep knowledge of System Design, concurrency, and REST APIs",
        "Experience with SQL and MongoDB databases",
      ],
      salary: "$165,000 - $215,000/year",
    },
    {
      id: 11,
      title: "Mobile Software Engineer",
      company: "Spotify",
      location: "New York, NY (Remote)",
      posted: "1 week ago",
      logoBg: "bg-emerald-100 text-emerald-650 font-bold",
      logoText: "S",
      description: "Deliver premium audio experiences to mobile apps. You will build music streaming features using React Native and optimize local storage and audio buffering algorithms.",
      requirements: [
        "3+ years building mobile apps with React Native or Swift/Kotlin",
        "Solid foundation in TypeScript and mobile state management (Redux)",
        "Experience collaborating with Git workflow",
      ],
      salary: "$130,000 - $170,000/year",
    },
    {
      id: 12,
      title: "ML Platform Engineer",
      company: "OpenAI",
      location: "San Francisco, CA (Hybrid)",
      posted: "3 days ago",
      logoBg: "bg-slate-900 text-white font-bold",
      logoText: "O",
      description: "Help build the platform that runs the world's most advanced AI models. You will develop backend APIs, deploy models using Docker, and manage cloud compute clusters.",
      requirements: [
        "Deep knowledge of Python, APIs, and microservices",
        "Strong DevOps background (Docker, Kubernetes, AWS)",
        "Passion for Artificial Intelligence and model serving",
      ],
      salary: "$230,000 - $310,000/year",
    },
    {
      id: 13,
      title: "Graduate Research Assistant (AI & ML Labs)",
      company: "CBIT Research & Development",
      location: "Hyderabad, TS (Hybrid)",
      posted: "2 days ago",
      logoBg: "bg-sky-100 text-sky-700 font-bold border border-sky-300",
      logoText: "CB",
      description: "Join Chaitanya Bharathi Institute of Technology's premier research wing. Assist in training and evaluating domain-specific LLMs and developing fullstack prototypes for smart academic services.",
      requirements: [
        "Familiarity with Python, PyTorch, and NLP models",
        "Hands-on experience in machine learning architectures",
        "Strong analytical and documentation skills",
      ],
      salary: "₹35,000 - ₹50,000/month",
    },
    {
      id: 14,
      title: "Software Development Engineer Intern",
      company: "Chaitanya Bharathi Institute of Technology",
      location: "Secunderabad, TS (On-site)",
      posted: "4 days ago",
      logoBg: "bg-amber-150 text-amber-800 font-bold border border-amber-300",
      logoText: "CB",
      description: "Work directly with CBIT's internal IT systems team to rebuild student portals and administrative dashboards. Gain hands-on exposure deploying live Next.js platforms.",
      requirements: [
        "Pursuing B.E. / B.Tech in CSE, IT, or ECE at CBIT",
        "Strong understanding of React, JavaScript, and CSS layout engines",
        "Active GitHub profile with web projects",
      ],
      salary: "₹15,000 - ₹20,000/month",
    },
    {
      id: 15,
      title: "Frontend Engineer (Cloud UI)",
      company: "Microsoft India",
      location: "Hyderabad, TS (Hybrid)",
      posted: "3 days ago",
      logoBg: "bg-blue-50 text-blue-700 font-bold",
      logoText: "M",
      description: "Design and construct intuitive user interfaces for Azure AI developer modules. You will ensure high performance, design consistency, and premium micro-interactions.",
      requirements: [
        "2+ years of experience with React, CSS, and Tailwind CSS",
        "Familiarity with cloud dashboards and REST API integration",
        "Excellent collaborative engineering practices",
      ],
      salary: "₹18,00,000 - ₹25,00,000/year",
    },
    {
      id: 16,
      title: "Associate Software Engineer",
      company: "Google Hyderabad",
      location: "Hyderabad, TS (Hybrid)",
      posted: "5 days ago",
      logoBg: "bg-red-50 text-red-655 font-bold border border-red-200",
      logoText: "G",
      description: "Build the foundation of secure consumer interfaces. You will develop highly scalable systems, coordinate with global product teams, and learn accelerated dev setups.",
      requirements: [
        "Solid foundations in Data Structures and Algorithms",
        "Familiarity with Java, C++, Python, or Go",
        "Experience in front-end frameworks (React/Angular) is a major plus",
      ],
      salary: "₹22,0,000 - ₹30,00,000/year",
    },
    {
      id: 17,
      title: "Full Stack AI Engineer",
      company: "xAI",
      location: "San Francisco, CA (Remote)",
      posted: "2 days ago",
      logoBg: "bg-black text-white font-bold border border-slate-700",
      logoText: "X",
      description: "Construct responsive chat dashboards and pipeline metrics overlays. You will deploy frontend interfaces that serve queries to deep neural weights.",
      requirements: [
        "Expertise in React, Next.js, and tailwind styling",
        "Familiarity with LLM token streaming APIs and WebSockets",
        "Ability to ship clean prototypes at lightning speed",
      ],
      salary: "$160,000 - $220,000/year",
    },
    {
      id: 18,
      title: "React Native Mobile Lead",
      company: "Uber",
      location: "Bangalore, KA (Hybrid)",
      posted: "6 days ago",
      logoBg: "bg-slate-900 text-white font-bold",
      logoText: "U",
      description: "Architect mobile interfaces for driver coordination apps. Lead a focused engineering group maintaining React Native modular components across Android/iOS platforms.",
      requirements: [
        "5+ years of React Native and Redux architecture",
        "Familiarity with native Swift/Kotlin bindings",
        "Experience optimizing app start times and memory profiles",
      ],
      salary: "₹35,00,000 - ₹48,00,000/year",
    },
    {
      id: 19,
      title: "Senior Frontend Developer (Next.js/Tailwind)",
      company: "Vercel India",
      location: "Hyderabad, TS (Remote)",
      posted: "1 week ago",
      logoBg: "bg-black text-white font-bold",
      logoText: "V",
      description: "Author next-gen starter templates and documentation modules. Educate developers globally while shipping responsive frontend layers supporting edge networks.",
      requirements: [
        "Exceptional skills in Next.js App Router and edge logic",
        "Demonstrated history of contributing to React open source",
        "High aesthetic standards for clean design systems",
      ],
      salary: "₹28,00,000 - ₹38,00,000/year",
    },
    {
      id: 20,
      title: "Software Engineer (UI Platform)",
      company: "Tesla",
      location: "Austin, TX (Hybrid)",
      posted: "1 week ago",
      logoBg: "bg-red-655 text-white font-bold",
      logoText: "T",
      description: "Construct dashboard overlays and operational screens for energy networks. Integrate three-dimensional vehicle charts with responsive control hooks.",
      requirements: [
        "Advanced React rendering, context management, and animations",
        "Familiarity with canvas charts or Three.js/WebGL is a plus",
        "Strong focus on responsive design and telemetry integration",
      ],
      salary: "$130,000 - $170,000/year",
    },
  ]);

  // Handle Saved items / Job tracker navigation parameter
  useEffect(() => {
    if (router.query.tab === "applied") {
      setViewMode("browser");
      setActiveTab("applied");
    }
  }, [router.query.tab]);

  // Fetch persistently applied jobs from the database
  useEffect(() => {
    const fetchApplied = async () => {
      try {
        const response = await api.get("/users/jobs/applied");
        const ids = response.data.map(app => app.jobId);
        setAppliedJobs(ids);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };
    fetchApplied();
  }, []);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handlePostJobSubmit = (e) => {
    e.preventDefault();
    if (!newJobTitle || !newJobCompany) return;
    
    const newJob = {
      id: jobsList.length + 1,
      title: newJobTitle,
      company: newJobCompany,
      location: newJobLocation || "Remote",
      posted: "Just now",
      logoBg: "bg-sky-50 text-[#0077b5] border border-[#0077b5] font-bold",
      logoText: newJobCompany.substring(0, 2).toUpperCase(),
      description: newJobDesc || "Collaborate with cross-functional teams to build and scale web features.",
      requirements: newJobReqs ? newJobReqs.split(",").map(r => r.trim()) : ["Strong communication skills", "HTML/CSS/JS", "Familiarity with React"],
      salary: newJobSalary || "Competitive salary",
    };

    setJobsList([newJob, ...jobsList]);
    setIsPostJobOpen(false);
    
    // Clear forms
    setNewJobTitle("");
    setNewJobCompany("");
    setNewJobLocation("");
    setNewJobSalary("");
    setNewJobDesc("");
    setNewJobReqs("");

    // Open browser view immediately to let them see it
    setViewMode("browser");
    setSelectedJobId(newJob.id);
  };

  const calculateSkillMatch = (job) => {
    if (!job || !user) return { matchPercentage: 0, matchedSkills: [], missingSkills: [] };

    const techKeywords = [
      "React Native", "React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "GraphQL", "Figma",
      "Node.js", "NodeJS", "Express", "MongoDB", "Python", "PyTorch", "Go",
      "Docker", "Kubernetes", "AWS", "Git", "DevOps", "System Design", "UI/UX", "Data Science", "Security",
      "SQL", "APIs", "REST APIs", "Public speaking", "communication"
    ];

    const jobText = (job.title + " " + job.description + " " + job.requirements.join(" ")).toLowerCase();
    let requiredTech = techKeywords.filter(tech => jobText.includes(tech.toLowerCase()));

    requiredTech = requiredTech.filter((tech, index) => {
      return !requiredTech.some((otherTech, otherIndex) => 
        otherIndex !== index && otherTech.toLowerCase().includes(tech.toLowerCase()) && otherTech.toLowerCase() !== tech.toLowerCase()
      );
    });

    if (requiredTech.length === 0) return { matchPercentage: 100, matchedSkills: [], missingSkills: [] };

    const userSkillsLower = (user.skills || []).map(s => s.toLowerCase());
    const matched = [];
    const missing = [];

    requiredTech.forEach(tech => {
      const hasSkill = userSkillsLower.some(us => us.includes(tech.toLowerCase()) || tech.toLowerCase().includes(us));
      if (hasSkill) {
        matched.push(tech);
      } else {
        missing.push(tech);
      }
    });

    const matchPercentage = Math.round((matched.length / requiredTech.length) * 100);
    return { matchPercentage, matchedSkills: matched, missingSkills: missing };
  };

  const handleAddMissingSkills = (missing) => {
    if (!missing || missing.length === 0) return;
    const currentSkills = user?.skills || [];
    const newSkills = missing.filter(
      (skill) => !currentSkills.some((us) => us.toLowerCase() === skill.toLowerCase())
    );
    if (newSkills.length === 0) return;
    const uniqueSkills = Array.from(new Set([...currentSkills, ...newSkills]));
    dispatch(updateProfile({ skills: uniqueSkills }));
  };

  // Filter jobs by top search query
  const filteredJobs = jobsList.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter jobs by currently selected tab (All vs. Applied)
  const displayedJobs = filteredJobs.filter((job) => {
    if (activeTab === "applied") {
      return appliedJobs.includes(job.id);
    }
    return true;
  });

  const activeJob = displayedJobs.find((j) => j.id === selectedJobId) || displayedJobs[0];
  const { matchPercentage, matchedSkills, missingSkills } = calculateSkillMatch(activeJob);

  return (
    <Layout>
      <div className="grid grid-cols-12 gap-5 items-start text-left select-none">
        
        {/* Left Column: Profile widget & Job actions sidebar */}
        <aside className="col-span-12 md:col-span-3 flex flex-col gap-3">
          {/* Profile Card widget */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div className="h-14 bg-gradient-to-r from-sky-700 to-[#0077b5] overflow-hidden">
              {user?.bannerPicture && (
                <img
                  src={`${API_BASE_URL}/uploads/${user.bannerPicture.replace("uploads/", "")}`}
                  alt="banner"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="px-4 pb-4 flex flex-col items-center border-b border-slate-200 relative">
              <div className="w-16 h-16 rounded-full overflow-hidden absolute -top-8 border-2 border-white shadow bg-white flex items-center justify-center">
                {user?.profilePicture ? (
                  <img
                    src={`${API_BASE_URL}/uploads/${user.profilePicture.replace("uploads/", "")}`}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-xl">
                    {getInitials(user?.name)}
                  </div>
                )}
              </div>

              <div className="mt-10 text-center w-full">
                <Link href="/profile" className="font-semibold text-slate-900 hover:underline flex items-center justify-center gap-1.5 truncate max-w-full">
                  <span>{user?.name || "Jelloji ASHWATH"}</span>
                  <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 inline-block align-middle" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0c-.2 0-.3.1-.4.2C6.7 1.2 5.1 2 3 2c-.6 0-1 .4-1 1v4.7c0 4.1 2.9 7 5.7 8.1.2.1.4.1.6 0 2.8-1.1 5.7-4 5.7-8.1V3c0-.6-.4-1-1-1-2.1 0-3.7-.8-4.6-1.8C8.3.1 8.2 0 8 0zm2.2 6.7L7.5 9.4 5.8 7.7a.8.8 0 1 0-1.1 1.1l2.2 2.2c.3.3.8.3 1.1 0l3.3-3.3a.8.8 0 1 0-1.1-1.1z"/>
                  </svg>
                </Link>
                <span className="text-[10px] text-slate-500 block mt-1 leading-snug font-medium line-clamp-3">
                  {user?.headline || "🎓 Student at Chaitanya Bharathi Institute of Technology (CBIT) | C/C++ | Web Development | Secunderabad, Telangana"}
                </span>

                <div className="flex items-center justify-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100 w-full text-left">
                  <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200">
                    <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 13c-2.76 0-5-2.24-5-5 0-.58.1-1.14.29-1.66l4.21 2.3c.16.08.33.12.5.12.17 0 .34-.04.5-.12l4.21-2.3c.19.52.29 1.08.29 1.66 0 2.76-2.24 5-5 5z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 leading-tight hover:underline cursor-pointer">
                    Chaitanya Bharathi Institute of Technology
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Sidebar Actions card */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col font-bold text-xs text-slate-600">
            <button
              onClick={() => setIsPreferencesOpen(true)}
              className="flex items-center gap-2.5 hover:bg-slate-50 p-2.5 rounded text-left focus:outline-none cursor-pointer text-slate-700"
            >
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Preferences</span>
            </button>
            <button
              onClick={() => {
                setViewMode("browser");
                setActiveTab("applied");
                const appliedFiltered = filteredJobs.filter(j => appliedJobs.includes(j.id));
                if (appliedFiltered.length > 0) {
                  setSelectedJobId(appliedFiltered[0].id);
                } else {
                  setSelectedJobId(null);
                }
              }}
              className="flex items-center gap-2.5 hover:bg-slate-50 p-2.5 rounded text-left focus:outline-none cursor-pointer text-slate-700"
            >
              <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
              <span>Job tracker</span>
            </button>
            <button
              onClick={() => setIsInsightsOpen(true)}
              className="flex items-center gap-2.5 hover:bg-slate-50 p-2.5 rounded text-left focus:outline-none cursor-pointer text-slate-700"
            >
              <div className="w-5 h-5 bg-amber-500 rounded flex items-center justify-center text-[9px] font-extrabold text-slate-900 shadow-sm flex-shrink-0">
                IN
              </div>
              <span>My Career Insights</span>
            </button>
            <div className="border-t border-slate-100 my-2"></div>
            <button
              onClick={() => setIsPostJobOpen(true)}
              className="flex items-center gap-2.5 hover:bg-slate-50 p-2.5 rounded text-left focus:outline-none cursor-pointer text-[#0077b5] hover:text-sky-850"
            >
              <svg className="w-5 h-5 text-[#0077b5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Post a free job</span>
            </button>
          </div>

          {/* Links Footer widget */}
          <div className="text-[10px] text-slate-400 font-medium px-2 flex flex-wrap justify-center gap-x-2.5 gap-y-1.5 select-none text-center">
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Accessibility</a>
            <a href="#" className="hover:underline">Help Center</a>
            <a href="#" className="hover:underline">Privacy & Terms</a>
            <a href="#" className="hover:underline">Ad Choices</a>
            <a href="#" className="hover:underline">Advertising</a>
            <a href="#" className="hover:underline font-bold text-slate-500">Business Services</a>
            <a href="#" className="hover:underline">Get the LinkedIn app</a>
            <a href="#" className="hover:underline">More</a>
            <div className="flex items-center justify-center gap-1 w-full mt-2 font-bold text-slate-600">
              <span className="text-[#0077b5]">LinkedIn</span>
              <span>LinkedIn Corporation © 2026</span>
            </div>
          </div>
        </aside>

        {/* Right/Center Column: Matches the dashboard vs. browser */}
        <section className="col-span-12 md:col-span-9 flex flex-col gap-4">
          {viewMode === "dashboard" ? (
            <>
              {/* Card 1: Top job picks for you */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm text-left flex flex-col gap-3">
                <div>
                  <h2 className="font-bold text-base text-slate-800">Top job picks for you</h2>
                  <span className="text-[11px] text-slate-450 mt-0.5 block font-medium">
                    Based on your profile, preferences, and activity like applies, searches, and saves
                  </span>
                </div>

                <div className="flex flex-col gap-3.5 divide-y divide-slate-100 mt-2 select-none">
                  {/* Job Pick 1 */}
                  <div
                    onClick={() => { setViewMode("browser"); setSelectedJobId(1); }}
                    className="flex items-start justify-between group cursor-pointer pt-2 first:pt-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded bg-purple-100 text-purple-650 font-bold border border-purple-300 flex items-center justify-center text-xs flex-shrink-0 shadow-sm leading-none">
                        QS
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-800 group-hover:text-[#0077b5] group-hover:underline transition-all">
                          Python Developer Intern
                        </span>
                        <span className="text-xs text-slate-600 block mt-0.5 font-medium">
                          QSkill • India (Remote)
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1.5">
                          Promoted
                        </span>
                      </div>
                    </div>
                    <button className="text-slate-450 hover:bg-slate-100 p-1.5 rounded-full cursor-pointer focus:outline-none" onClick={(e) => e.stopPropagation()}>
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Job Pick 2 */}
                  <div
                    onClick={() => { setViewMode("browser"); setSelectedJobId(2); }}
                    className="flex items-start justify-between group cursor-pointer pt-4.5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded bg-slate-900 text-white font-bold border border-slate-750 flex items-center justify-center text-xs flex-shrink-0 shadow-sm leading-none">
                        WB
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-800 group-hover:text-[#0077b5] group-hover:underline transition-all">
                          Full Stack Web Developer Intern
                        </span>
                        <span className="text-xs text-slate-600 block mt-0.5 font-medium">
                          WebBoost Solutions by UM • India (Remote)
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1.5 font-semibold">
                          Promoted • <span className="text-emerald-700 font-bold">Be an early applicant</span>
                        </span>
                      </div>
                    </div>
                    <button className="text-slate-455 hover:bg-slate-100 p-1.5 rounded-full cursor-pointer focus:outline-none" onClick={(e) => e.stopPropagation()}>
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Job Pick 3 */}
                  <div
                    onClick={() => { setViewMode("browser"); setSelectedJobId(3); }}
                    className="flex items-start justify-between group cursor-pointer pt-4.5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded bg-blue-900 text-white font-bold border border-blue-950 flex items-center justify-center text-xs flex-shrink-0 shadow-sm leading-none">
                        AST
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-800 group-hover:text-[#0077b5] group-hover:underline transition-all">
                          Verification Intern
                        </span>
                        <span className="text-xs text-slate-600 block mt-0.5 font-medium">
                          AST SpaceMobile • Hyderabad (On-site)
                        </span>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                            </svg>
                            Actively reviewing applicants
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-2 font-semibold">
                          4 days ago • <span className="text-[#0077b5] font-bold flex-inline items-center gap-0.5"><span className="bg-[#0077b5] text-white px-0.5 py-0 rounded-[2px] text-[8px] font-extrabold font-sans">in</span> Easy Apply</span>
                        </span>
                      </div>
                    </div>
                    <button className="text-slate-455 hover:bg-slate-100 p-1.5 rounded-full cursor-pointer focus:outline-none" onClick={(e) => e.stopPropagation()}>
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-100 mt-4.5 pt-2">
                  <button
                    onClick={() => setViewMode("browser")}
                    className="w-full text-center text-xs font-bold text-slate-550 hover:bg-slate-50 py-2 rounded flex items-center justify-center gap-1 transition-all cursor-pointer focus:outline-none"
                  >
                    <span>Show all</span>
                    <svg className="w-4 h-4 text-slate-550" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Card 2: Explore companies that hire for your skills */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm text-left flex flex-col gap-3 relative overflow-hidden">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h2 className="font-bold text-base text-slate-800">Explore companies that hire for your skills</h2>
                    <span className="text-[11px] text-slate-450 block mt-0.5 font-medium">Promoted</span>
                  </div>
                  {/* Slider controls */}
                  <div className="flex items-center gap-1.5 text-slate-600 select-none">
                    <button className="hover:bg-slate-100 p-1.5 rounded-full cursor-pointer focus:outline-none border border-slate-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button className="hover:bg-slate-100 p-1.5 rounded-full cursor-pointer focus:outline-none border border-slate-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {/* Company 1 */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow flex flex-col justify-between min-h-[180px]">
                    <div className="h-10 bg-gradient-to-r from-sky-600 to-sky-700 relative">
                      <div className="w-10 h-10 rounded-full bg-white border border-slate-200 absolute -bottom-5 left-4 overflow-hidden flex items-center justify-center shadow-sm">
                        {/* Circular crescent Signant Health Logo */}
                        <div className="w-7 h-7 rounded-full bg-sky-500 overflow-hidden flex items-center justify-center font-bold text-white text-[8px] leading-none">
                          SH
                        </div>
                      </div>
                    </div>
                    <div className="px-4 pt-6.5 pb-4 flex flex-col gap-2.5 flex-grow text-left">
                      <div>
                        <h4 className="font-bold text-xs text-slate-800 hover:text-[#0077b5] cursor-pointer">
                          Signant Health
                        </h4>
                        <span className="text-[9px] text-slate-450 block leading-tight font-medium mt-0.5">
                          1001-5000 employees • Greater Hyderabad Area
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        <span>Actively recruiting</span>
                      </div>
                      <button className="w-full text-center text-[10px] font-bold text-[#0077b5] border border-[#0077b5] hover:bg-sky-50/50 py-1 rounded-full transition-all focus:outline-none mt-auto cursor-pointer">
                        Signant Health in Jasi, Romania...
                      </button>
                    </div>
                  </div>

                  {/* Company 2 */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow flex flex-col justify-between min-h-[180px]">
                    <div className="h-10 bg-slate-900 relative">
                      <div className="w-10 h-10 rounded-full bg-white border border-slate-200 absolute -bottom-5 left-4 overflow-hidden flex items-center justify-center shadow-sm">
                        {/* Notion N Logo */}
                        <div className="w-7 h-7 bg-white text-slate-900 flex items-center justify-center font-black text-xs leading-none">
                          N
                        </div>
                      </div>
                    </div>
                    <div className="px-4 pt-6.5 pb-4 flex flex-col gap-2.5 flex-grow text-left">
                      <div>
                        <h4 className="font-bold text-xs text-slate-800 hover:text-[#0077b5] cursor-pointer">
                          Notion
                        </h4>
                        <span className="text-[9px] text-slate-455 block leading-tight font-medium mt-0.5">
                          501-1000 employees • Greater Hyderabad Area
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        <span>Actively recruiting</span>
                      </div>
                      <button className="w-full text-center text-[10px] font-bold text-[#0077b5] border border-[#0077b5] hover:bg-sky-50/50 py-1 rounded-full transition-all focus:outline-none mt-auto cursor-pointer">
                        What we do
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Browser view with Split-Pane Layout
            <div className="flex flex-col gap-4">
              {/* Browser Header Bar */}
              <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-sm flex items-center justify-between px-4">
                <button
                  onClick={() => setViewMode("dashboard")}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#0077b5] hover:text-sky-850 focus:outline-none cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to Jobs dashboard</span>
                </button>
                <span className="text-xs text-slate-400 font-bold font-sans">
                  Job Browser Mode
                </span>
              </div>

              {/* Split Pane */}
              <div className="grid grid-cols-12 gap-5 items-start">
                {/* Left Panel: Jobs List */}
                <div className="col-span-12 md:col-span-5 flex flex-col gap-3">
                  <div className="flex border border-slate-200 bg-white rounded-lg p-1 shadow-sm select-none">
                    <button
                      onClick={() => {
                        setActiveTab("all");
                        if (filteredJobs.length > 0) {
                          setSelectedJobId(filteredJobs[0].id);
                        }
                      }}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer text-center ${
                        activeTab === "all"
                          ? "bg-[#0077b5] text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-55"
                      }`}
                    >
                      All Jobs ({filteredJobs.length})
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("applied");
                        const appliedFiltered = filteredJobs.filter(j => appliedJobs.includes(j.id));
                        if (appliedFiltered.length > 0) {
                          setSelectedJobId(appliedFiltered[0].id);
                        } else {
                          setSelectedJobId(null);
                        }
                      }}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer text-center ${
                        activeTab === "applied"
                          ? "bg-[#0077b5] text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-55"
                      }`}
                    >
                      Applied ({appliedJobs.length})
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 max-h-[58vh] overflow-y-auto pr-1">
                    {displayedJobs.length > 0 ? (
                      displayedJobs.map((job) => (
                        <div
                          key={job.id}
                          onClick={() => setSelectedJobId(job.id)}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedJobId === job.id
                              ? "border-[#0077b5] bg-sky-50/40 shadow-sm"
                              : "border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded flex items-center justify-center text-[10px] ${job.logoBg} flex-shrink-0 shadow-sm font-sans font-bold leading-none`}>
                              {job.logoText}
                            </div>
                            <div className="overflow-hidden flex-grow">
                              <h3 className="font-bold text-xs text-slate-800 hover:underline truncate">
                                {job.title}
                              </h3>
                              <span className="text-[11px] text-slate-600 block mt-0.5 truncate">{job.company}</span>
                              <span className="text-[11px] text-slate-400 block mt-0.5 truncate">{job.location}</span>
                              <div className="flex items-center justify-between mt-2.5">
                                <span className="text-[9px] text-slate-400">{job.posted}</span>
                                {appliedJobs.includes(job.id) && (
                                  <span className="text-[8px] font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                    ✓ Applied
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-white border border-slate-200 rounded-lg shadow-sm px-4">
                        <span className="text-xs text-slate-400 font-semibold block leading-relaxed">
                          {activeTab === "applied"
                            ? "You haven't submitted any job applications yet."
                            : "No matching job posts found."}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Panel: Job Detail Description */}
                <div className="col-span-12 md:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-sm min-h-[50vh] flex flex-col justify-between">
                  {activeJob ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded flex items-center justify-center text-xl ${activeJob.logoBg} flex-shrink-0 shadow-sm font-sans font-bold leading-none`}>
                          {activeJob.logoText}
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-slate-800 leading-tight">{activeJob.title}</h2>
                          <span className="text-xs font-semibold text-slate-600 block mt-1 hover:underline cursor-pointer">
                            {activeJob.company}
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-0.5">{activeJob.location}</span>
                          <div className="flex items-center gap-2 mt-2 font-medium">
                            <span className="text-[10px] text-slate-400">{activeJob.posted}</span>
                            <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                              {activeJob.salary}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* AI skill match */}
                      <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden mt-1">
                        <div className="flex items-start justify-between relative z-10">
                          <div className="flex items-center gap-2">
                            <span className="text-base">✨</span>
                            <h3 className="font-bold text-xs text-slate-800">AI Profile Skill Match</h3>
                          </div>
                          <span className="text-sm font-bold text-[#0077b5]">{matchPercentage}% Match</span>
                        </div>

                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#0077b5] h-full rounded-full transition-all duration-500"
                            style={{ width: `${matchPercentage}%` }}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 text-xs">
                          <div>
                            <span className="font-bold text-slate-700 block mb-1">Matched Skills ({matchedSkills.length})</span>
                            {matchedSkills.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {matchedSkills.map((skill) => (
                                  <span key={skill} className="bg-emerald-50 text-emerald-850 border border-emerald-250 px-2 py-0.5 rounded text-[9px] font-bold">
                                    ✓ {skill}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[9px] text-slate-400 block font-medium">No matched skills in profile.</span>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-700 block mb-1">Missing Skills ({missingSkills.length})</span>
                            {missingSkills.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {missingSkills.map((skill) => (
                                  <span key={skill} className="bg-red-50/50 text-red-700 border border-red-200 px-2 py-0.5 rounded text-[9px] font-bold">
                                    + {skill}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[9px] text-slate-400 block font-medium">No missing skills! You're a perfect match.</span>
                            )}
                          </div>
                        </div>

                        {missingSkills.length > 0 && (
                          <div className="flex justify-start mt-2">
                            <button
                              onClick={() => handleAddMissingSkills(missingSkills)}
                              className="px-3.5 py-1.5 bg-[#0077b5] text-white hover:bg-sky-850 rounded-full font-bold text-[9px] transition-all cursor-pointer shadow-sm focus:outline-none"
                            >
                              ⚡ Add Missing Skills to Profile
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 mt-2">
                        <h3 className="font-bold text-xs text-slate-800">Job Description</h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans">{activeJob.description}</p>
                      </div>

                      <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-xs text-slate-800">Requirements</h3>
                        <ul className="list-disc pl-5 text-xs text-slate-655 space-y-1.5 font-sans">
                          {activeJob.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end">
                        <button
                          onClick={() => {
                            if (!appliedJobs.includes(activeJob.id)) {
                              setIsApplyModalOpen(true);
                            }
                          }}
                          disabled={appliedJobs.includes(activeJob.id)}
                          className={`px-6 py-2 rounded-full font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none ${
                            appliedJobs.includes(activeJob.id)
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                              : "bg-[#0077b5] text-white hover:bg-sky-850 shadow-sm"
                          }`}
                        >
                          {appliedJobs.includes(activeJob.id) ? (
                            <>
                              <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Applied successfully</span>
                            </>
                          ) : (
                            <span>Easy Apply</span>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center my-auto py-10">
                      <span className="text-xs text-slate-400 font-semibold text-center">
                        Select a job posting on the left to see details.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* MODAL 1: Preferences Config Modal */}
      {isPreferencesOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-xl overflow-hidden shadow-2xl p-6 border border-slate-200 flex flex-col text-left select-none animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <span>⚙️</span>
                <span>Job Seek Preferences</span>
              </h3>
              <button onClick={() => setIsPreferencesOpen(false)} className="text-slate-400 hover:bg-slate-100 p-1 rounded-full cursor-pointer focus:outline-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Job Title</label>
                <input
                  type="text"
                  value={prefTitle}
                  onChange={(e) => setPrefTitle(e.target.value)}
                  className="w-full border border-slate-350 rounded px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0077b5]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Preferred Location</label>
                <input
                  type="text"
                  value={prefLocation}
                  onChange={(e) => setPrefLocation(e.target.value)}
                  className="w-full border border-slate-350 rounded px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0077b5]"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={prefRemote}
                  onChange={() => setPrefRemote(!prefRemote)}
                  className="rounded text-[#0077b5] focus:ring-[#0077b5]"
                />
                <span>Include Remote Positions</span>
              </label>

              <button
                onClick={() => setIsPreferencesOpen(false)}
                className="w-full mt-2 py-2 rounded-full font-bold text-white bg-[#0077b5] hover:bg-sky-850 cursor-pointer shadow-sm focus:outline-none text-center"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Post a free job Modal */}
      {isPostJobOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl overflow-hidden shadow-2xl p-6 border border-slate-200 flex flex-col text-left select-none animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <span>➕</span>
                <span>Post a free job listing</span>
              </h3>
              <button onClick={() => setIsPostJobOpen(false)} className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-full cursor-pointer focus:outline-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handlePostJobSubmit} className="flex flex-col gap-3.5 text-xs max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Node.js backend developer"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full border border-slate-350 rounded px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0077b5]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chaitanya Tech Labs"
                  value={newJobCompany}
                  onChange={(e) => setNewJobCompany(e.target.value)}
                  className="w-full border border-slate-350 rounded px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0077b5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Hyderabad, TS"
                    value={newJobLocation}
                    onChange={(e) => setNewJobLocation(e.target.value)}
                    className="w-full border border-slate-350 rounded px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0077b5]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Salary Range</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹20,000 - ₹30,000/mo"
                    value={newJobSalary}
                    onChange={(e) => setNewJobSalary(e.target.value)}
                    className="w-full border border-slate-350 rounded px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0077b5]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Job Description</label>
                <textarea
                  placeholder="Describe key responsibilities..."
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  className="w-full border border-slate-355 rounded px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0077b5] h-20 resize-none font-sans"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Skills / Requirements (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, Git, Python"
                  value={newJobReqs}
                  onChange={(e) => setNewJobReqs(e.target.value)}
                  className="w-full border border-slate-350 rounded px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0077b5]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-full font-bold text-white bg-[#0077b5] hover:bg-sky-850 cursor-pointer shadow-sm focus:outline-none text-center"
              >
                Post Job Opening
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: My Career Insights Modal */}
      {isInsightsOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-xl overflow-hidden shadow-2xl p-6 border border-slate-200 flex flex-col text-left select-none animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <span>✨</span>
                <span>AI Career Insights Coach</span>
              </h3>
              <button onClick={() => setIsInsightsOpen(false)} className="text-slate-400 hover:bg-slate-100 p-1 rounded-full cursor-pointer focus:outline-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-3.5 text-xs">
              <div className="bg-sky-50 border border-sky-100 rounded-lg p-3 text-slate-700">
                <span className="font-bold block mb-1 text-slate-900">Education Context Matched</span>
                We detected that you study at <span className="font-bold">CBIT</span>. Companies like Google Hyderabad, Microsoft India, and AST SpaceMobile actively hire from your institution!
              </div>

              <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-3 text-slate-700">
                <span className="font-bold block mb-1 text-slate-900">Profile Skill Gauge Tips</span>
                You have strong matching scores for Frontend roles. Add <span className="font-bold">Python</span> and <span className="font-bold">SQL</span> to match the Verification Intern roles perfectly.
              </div>

              <button
                onClick={() => setIsInsightsOpen(false)}
                className="w-full py-2 rounded-full font-bold text-white bg-[#0077b5] hover:bg-sky-850 cursor-pointer shadow-sm focus:outline-none text-center"
              >
                Close Coach
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Easy Apply modal */}
      {isApplyModalOpen && activeJob && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl overflow-hidden shadow-2xl p-6 border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 text-left select-none">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-1.5">
                <span>📝</span>
                <span>Apply to {activeJob.company}</span>
              </h3>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-full cursor-pointer focus:outline-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {isSubmittingApp ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0077b5]"></div>
                <span className="text-sm font-semibold text-slate-655 animate-pulse text-center">Submitting application to {activeJob.company} recruiters...</span>
                <span className="text-xs text-slate-400">Uploading profile resume and cover letter...</span>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSubmittingApp(true);
                  try {
                    await api.post("/users/jobs/apply", {
                      jobId: activeJob.id,
                      resumeOption,
                      coverLetter
                    });
                    setTimeout(() => {
                      setIsSubmittingApp(false);
                      setIsApplyModalOpen(false);
                      setAppliedJobs([...appliedJobs, activeJob.id]);
                      setCoverLetter("");
                    }, 1500);
                  } catch (error) {
                    setIsSubmittingApp(false);
                    alert(error.response?.data?.message || "Failed to submit application");
                  }
                }}
                className="flex flex-col gap-4 text-xs"
              >
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Choose Resume</label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="radio"
                        name="resume"
                        value="profile"
                        checked={resumeOption === "profile"}
                        onChange={() => setResumeOption("profile")}
                        className="text-[#0077b5] focus:ring-[#0077b5]"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">Use LinkedIn Profile Resume</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Includes your headline, school row, and matching skills.</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="radio"
                        name="resume"
                        value="upload"
                        checked={resumeOption === "upload"}
                        onChange={() => setResumeOption("upload")}
                        className="text-[#0077b5] focus:ring-[#0077b5]"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">Upload PDF / Word resume</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Select a document from your local machine.</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cover Letter / Note to Recruiter</label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Introduce yourself and explain why you're a great fit for this role..."
                    className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-800 resize-none h-24 font-sans font-medium"
                  />
                </div>

                <div className="bg-sky-50 border border-sky-100 p-3 rounded-lg flex items-center gap-3">
                  <div className="text-xl font-bold text-[#0077b5]">{matchPercentage}%</div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-slate-700">AI Skill Match Gauge</span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {matchedSkills.length} of {matchedSkills.length + missingSkills.length} required skills matched.
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-slate-100 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-1.5 rounded-full font-semibold text-slate-500 hover:bg-slate-50 border border-slate-200 cursor-pointer focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-1.5 rounded-full font-bold text-white bg-[#0077b5] hover:bg-sky-850 cursor-pointer shadow-md focus:outline-none"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
