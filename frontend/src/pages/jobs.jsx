import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "@/components/Layout";
import api from "@/config";
import { updateProfile } from "@/config/redux/action/authAction";

export default function Jobs() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(1);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeOption, setResumeOption] = useState("profile");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'applied'

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

  const mockJobs = [
    {
      id: 1,
      title: "Frontend Engineer (React/Next.js)",
      company: "Google",
      location: "Mountain View, CA (Hybrid)",
      posted: "1 day ago",
      logoBg: "bg-red-100 text-red-650 font-bold",
      logoText: "G",
      description:
        "We are looking for a Frontend Engineer to build premium, modern web applications using React and Next.js. You will collaborate closely with designers and product managers to create interactive features that wow our users.",
      requirements: [
        "3+ years of experience with React, TypeScript, and Tailwind CSS",
        "Experience building Next.js applications (Pages/App Router)",
        "Excellent communication and collaboration skills",
      ],
      salary: "$140,000 - $180,000/year",
    },
    {
      id: 2,
      title: "Fullstack Developer",
      company: "Stripe",
      location: "San Francisco, CA (Remote)",
      posted: "3 days ago",
      logoBg: "bg-indigo-100 text-indigo-650 font-bold",
      logoText: "S",
      description:
        "Join our engineering team to build payment infrastructure for the internet. You will work on full-stack systems, managing database schemas, core routing, and crafting sleek dashboard user interfaces.",
      requirements: [
        "4+ years of backend development (Node.js, Express, MongoDB)",
        "Strong React frontend skills",
        "Passion for developer tooling and APIs",
      ],
      salary: "$150,000 - $200,000/year",
    },
    {
      id: 3,
      title: "Developer Relations Engineer",
      company: "Vercel",
      location: "New York, NY (Hybrid)",
      posted: "1 week ago",
      logoBg: "bg-slate-100 text-slate-800 font-bold",
      logoText: "V",
      description:
        "Help developers build a faster Web. As a DevRel Engineer, you will create content, speak at conferences, and build open-source starters demonstrating the power of Next.js and Vercel deployments.",
      requirements: [
        "Deep knowledge of Next.js, React, and deployment architectures",
        "Public speaking or communication history (blogs, YouTube, workshops)",
        "Empathy for developers and community engagement",
      ],
      salary: "$130,000 - $165,000/year",
    },
    {
      id: 4,
      title: "Senior AI Research Engineer",
      company: "Meta",
      location: "Menlo Park, CA (Hybrid)",
      posted: "2 days ago",
      logoBg: "bg-blue-100 text-blue-650 font-bold",
      logoText: "M",
      description:
        "Join our FAIR (Fundamental AI Research) team to train next-generation large language models. You will design neural architectures, scale training pipelines, and optimize model inference latency.",
      requirements: [
        "Mastery in Python and PyTorch",
        "Strong understanding of deep learning and Transformers",
        "Experience with Docker, Kubernetes, and distributed GPU training",
      ],
      salary: "$210,000 - $280,000/year",
    },
    {
      id: 5,
      title: "Cloud DevOps Architect",
      company: "Netflix",
      location: "Los Gatos, CA (Hybrid)",
      posted: "4 days ago",
      logoBg: "bg-red-100 text-red-700 font-bold",
      logoText: "N",
      description:
        "Scale the delivery of entertainment to hundreds of millions of screens worldwide. You will maintain cloud infrastructure, design resilient CI/CD pipelines, and manage our multi-region AWS deployments.",
      requirements: [
        "Expertise with AWS cloud architectures",
        "Strong infrastructure-as-code scripting (Terraform or CloudFormation)",
        "Deep knowledge of Docker, Kubernetes, and Linux internals",
      ],
      salary: "$180,000 - $240,000/year",
    },
    {
      id: 6,
      title: "UI/UX Engineer",
      company: "Airbnb",
      location: "San Francisco, CA (Hybrid)",
      posted: "5 days ago",
      logoBg: "bg-rose-100 text-rose-500 font-bold",
      logoText: "A",
      description:
        "Bridge the gap between design and engineering. You will collaborate with Figma designers to prototype features, create dynamic micro-animations, and implement our design system.",
      requirements: [
        "Advanced Figma prototyping and Design Systems experience",
        "Expert in React, TypeScript, and CSS/animations",
        "High attention to visual detail and user experience",
      ],
      salary: "$135,000 - $175,000/year",
    },
    {
      id: 7,
      title: "Senior Backend Engineer",
      company: "Amazon",
      location: "Seattle, WA (Hybrid)",
      posted: "6 days ago",
      logoBg: "bg-orange-100 text-orange-605 font-bold",
      logoText: "A",
      description:
        "Build highly scalable distributed systems powering retail checkout pipelines. You will design robust microservices, optimize database queries, and author clean, reliable Go codebase.",
      requirements: [
        "5+ years of backend development (Go, Java, or C++)",
        "Deep knowledge of System Design, concurrency, and REST APIs",
        "Experience with SQL and MongoDB databases",
      ],
      salary: "$165,000 - $215,000/year",
    },
    {
      id: 8,
      title: "Mobile Software Engineer",
      company: "Spotify",
      location: "New York, NY (Remote)",
      posted: "1 week ago",
      logoBg: "bg-emerald-100 text-emerald-650 font-bold",
      logoText: "S",
      description:
        "Deliver premium audio experiences to mobile apps. You will build music streaming features using React Native and optimize local storage and audio buffering algorithms.",
      requirements: [
        "3+ years building mobile apps with React Native or Swift/Kotlin",
        "Solid foundation in TypeScript and mobile state management (Redux)",
        "Experience collaborating with Git workflow",
      ],
      salary: "$130,000 - $170,000/year",
    },
    {
      id: 9,
      title: "ML Platform Engineer",
      company: "OpenAI",
      location: "San Francisco, CA (Hybrid)",
      posted: "3 days ago",
      logoBg: "bg-slate-900 text-white font-bold",
      logoText: "O",
      description:
        "Help build the platform that runs the world's most advanced AI models. You will develop backend APIs, deploy models using Docker, and manage cloud compute clusters.",
      requirements: [
        "Deep knowledge of Python, APIs, and microservices",
        "Strong DevOps background (Docker, Kubernetes, AWS)",
        "Passion for Artificial Intelligence and model serving",
      ],
      salary: "$230,000 - $310,000/year",
    },
    {
      id: 10,
      title: "Senior Solutions Engineer",
      company: "Slack",
      location: "Denver, CO (Remote)",
      posted: "1 week ago",
      logoBg: "bg-purple-100 text-purple-650 font-bold",
      logoText: "S",
      description:
        "Partner with enterprise customers to design and build custom workspace workflows. You will build APIs integrations, write Node.js microservices, and speak with customer engineering teams.",
      requirements: [
        "Strong development experience in Node.js and REST APIs",
        "Familiarity with Slack API or platform ecosystems",
        "Excellent communication, public speaking, and customer presentation skills",
      ],
      salary: "$140,000 - $175,000/year",
    },
    {
      id: 11,
      title: "Technical Product Manager",
      company: "Microsoft",
      location: "Redmond, WA (Hybrid)",
      posted: "2 weeks ago",
      logoBg: "bg-blue-50 text-blue-700 font-bold",
      logoText: "M",
      description:
        "Define the roadmap for our developer cloud developer platform. You will analyze developer requirements, write technical specifications, and work with SQL data pipelines.",
      requirements: [
        "Background in engineering or Computer Science",
        "Familiarity with SQL, AWS/Azure, and System Design concepts",
        "Excellent product management and communication skills",
      ],
      salary: "$150,000 - $190,000/year",
    },
    {
      id: 12,
      title: "Site Reliability Engineer",
      company: "Datadog",
      location: "Boston, MA (Hybrid)",
      posted: "1 week ago",
      logoBg: "bg-purple-100 text-purple-800 font-bold",
      logoText: "D",
      description:
        "Ensure the reliability and uptime of our large-scale monitoring platforms. You will troubleshoot network issues, automate infrastructure setup, and manage cloud operations.",
      requirements: [
        "Expertise in Go, Python, or shell scripting",
        "Hands-on experience with AWS, Docker, and Kubernetes",
        "Passion for observability, metrics, and incident resolution",
      ],
      salary: "$145,000 - $185,000/year",
    },
    {
      id: 13,
      title: "Graduate Research Assistant (AI & ML Labs)",
      company: "CBIT Research & Development",
      location: "Hyderabad, TS (Hybrid)",
      posted: "2 days ago",
      logoBg: "bg-sky-100 text-sky-700 font-bold border border-sky-300",
      logoText: "CB",
      description:
        "Join Chaitanya Bharathi Institute of Technology's premier research wing. Assist in training and evaluating domain-specific LLMs and developing fullstack prototypes for smart academic services.",
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
      description:
        "Work directly with CBIT's internal IT systems team to rebuild student portals and administrative dashboards. Gain hands-on exposure deploying live Next.js platforms.",
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
      description:
        "Design and construct intuitive user interfaces for Azure AI developer modules. You will ensure high performance, design consistency, and premium micro-interactions.",
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
      description:
        "Build the foundation of secure consumer interfaces. You will develop highly scalable systems, coordinate with global product teams, and learn accelerated dev setups.",
      requirements: [
        "Solid foundations in Data Structures and Algorithms",
        "Familiarity with Java, C++, Python, or Go",
        "Experience in front-end frameworks (React/Angular) is a major plus",
      ],
      salary: "₹22,00,000 - ₹30,00,000/year",
    },
    {
      id: 17,
      title: "Full Stack AI Engineer",
      company: "xAI",
      location: "San Francisco, CA (Remote)",
      posted: "2 days ago",
      logoBg: "bg-black text-white font-bold border border-slate-700",
      logoText: "X",
      description:
        "Construct responsive chat dashboards and pipeline metrics overlays. You will deploy frontend interfaces that serve queries to deep neural weights instantly.",
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
      description:
        "Architect mobile interfaces for driver coordination apps. Lead a focused engineering group maintaining React Native modular components across Android/iOS platforms.",
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
      description:
        "Author next-gen starter templates and documentation modules. Educate developers globally while shipping responsive frontend layers supporting edge networks.",
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
      logoBg: "bg-red-600 text-white font-bold",
      logoText: "T",
      description:
        "Construct dashboard overlays and operational screens for energy networks. Integrate three-dimensional vehicle charts with responsive control hooks.",
      requirements: [
        "Advanced React rendering, context management, and animations",
        "Familiarity with canvas charts or Three.js/WebGL is a plus",
        "Strong focus on responsive design and telemetry integration",
      ],
      salary: "$130,000 - $170,000/year",
    },
  ];

  const handleApply = (jobId) => {
    if (appliedJobs.includes(jobId)) return;
    setAppliedJobs([...appliedJobs, jobId]);
  };

  const calculateSkillMatch = (job) => {
    if (!job || !user) return { matchPercentage: 0, matchedSkills: [], missingSkills: [] };

    // Technologies to scan for in description & requirements
    const techKeywords = [
      "React Native", "React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "GraphQL", "Figma",
      "Node.js", "NodeJS", "Express", "MongoDB", "Python", "PyTorch", "Go",
      "Docker", "Kubernetes", "AWS", "Git", "DevOps", "System Design", "UI/UX", "Data Science", "Security",
      "SQL", "APIs", "REST APIs", "Public speaking", "communication"
    ];

    const jobText = (job.title + " " + job.description + " " + job.requirements.join(" ")).toLowerCase();
    
    // Scan for matched keywords
    let requiredTech = techKeywords.filter(tech => jobText.includes(tech.toLowerCase()));

    // Deduplicate substrings
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
  const filteredJobs = mockJobs.filter(
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
      <div className="flex flex-col gap-4 text-left">
        {/* Top Search Bar */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="relative">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#edf3f8] text-slate-800 text-sm border border-transparent rounded-full px-9 py-2.5 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white placeholder-slate-500 transition-all font-sans"
              placeholder="Search jobs by title or company"
            />
            <svg
              className="w-5 h-5 text-slate-500 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Main Columns Content */}
        <div className="grid grid-cols-12 gap-5 items-start">
          
          {/* Left Column: Jobs List & Tab Selection */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-3">
            {/* Tabs */}
            <div className="flex border border-slate-200 bg-white rounded-lg p-1 shadow-sm select-none">
              <button
                onClick={() => {
                  setActiveTab("all");
                  const allJobsFiltered = filteredJobs;
                  if (allJobsFiltered.length > 0) {
                    setSelectedJobId(allJobsFiltered[0].id);
                  }
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer text-center ${
                  activeTab === "all"
                    ? "bg-[#0077b5] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                All Jobs ({filteredJobs.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab("applied");
                  const appliedJobsFiltered = filteredJobs.filter(j => appliedJobs.includes(j.id));
                  if (appliedJobsFiltered.length > 0) {
                    setSelectedJobId(appliedJobsFiltered[0].id);
                  } else {
                    setSelectedJobId(null);
                  }
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer text-center ${
                  activeTab === "applied"
                    ? "bg-[#0077b5] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                Applied ({appliedJobs.length})
              </button>
            </div>

            {/* Scrollable Job List */}
            <div className="flex flex-col gap-2 max-h-[66vh] overflow-y-auto pr-1">
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
                      <div className={`w-10 h-10 rounded flex items-center justify-center text-xs ${job.logoBg} flex-shrink-0 shadow-sm`}>
                        {job.logoText}
                      </div>
                      <div className="overflow-hidden flex-grow">
                        <h3 className="font-bold text-sm text-slate-800 hover:underline truncate">
                          {job.title}
                        </h3>
                        <span className="text-xs text-slate-600 block mt-0.5 truncate">{job.company}</span>
                        <span className="text-xs text-slate-400 block mt-0.5 truncate">{job.location}</span>
                        <div className="flex items-center justify-between mt-2.5">
                          <span className="text-[10px] text-slate-400">{job.posted}</span>
                          {appliedJobs.includes(job.id) && (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                              Applied
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-white border border-slate-200 rounded-lg shadow-sm px-4">
                  <svg className="w-12 h-12 text-slate-300 mx-auto mb-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m9-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-slate-400 font-semibold block leading-relaxed">
                    {activeTab === "applied"
                      ? "You haven't submitted any job applications yet."
                      : "No matching job posts found."}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Job Description Details */}
          <div className="col-span-12 md:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-sm min-h-[50vh] flex flex-col justify-between">
            {activeJob ? (
              <div className="flex flex-col gap-4">
                {/* Header info */}
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded flex items-center justify-center text-3xl ${activeJob.logoBg} flex-shrink-0 shadow-sm`}>
                    {activeJob.logoText}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 leading-tight">{activeJob.title}</h2>
                    <span className="text-sm font-semibold text-slate-600 block mt-1 hover:underline cursor-pointer">
                      {activeJob.company}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">{activeJob.location}</span>
                    <div className="flex items-center gap-2 mt-2 font-medium">
                      <span className="text-xs text-slate-400">{activeJob.posted}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {activeJob.salary}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Skill Match Gauge Card */}
                <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden mt-2">
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-base">✨</span>
                      <h3 className="font-bold text-sm text-slate-800">AI Profile Skill Match</h3>
                    </div>
                    <span className="text-lg font-bold text-[#0077b5]">{matchPercentage}% Match</span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0077b5] h-full rounded-full transition-all duration-500"
                      style={{ width: `${matchPercentage}%` }}
                    />
                  </div>

                  {/* Skills lists */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">Matched Skills ({matchedSkills.length})</span>
                      {matchedSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {matchedSkills.map((skill) => (
                            <span key={skill} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 block font-medium">No matched skills in profile.</span>
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">Missing Skills ({missingSkills.length})</span>
                      {missingSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {missingSkills.map((skill) => (
                            <span key={skill} className="bg-red-50/50 text-red-700 border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              + {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 block font-medium">No missing skills! You're a perfect match.</span>
                      )}
                    </div>
                  </div>

                  {missingSkills.length > 0 && (
                    <div className="flex justify-start mt-2">
                      <button
                        onClick={() => handleAddMissingSkills(missingSkills)}
                        className="px-3.5 py-1.5 bg-[#0077b5] text-white hover:bg-sky-850 rounded-full font-bold text-[10px] transition-all cursor-pointer shadow"
                      >
                        ⚡ Add Missing Skills to Profile
                      </button>
                    </div>
                  )}
                </div>

                {/* Job Description details */}
                <div className="flex flex-col gap-3 mt-2">
                  <h3 className="font-bold text-sm text-slate-800">Job Description</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">{activeJob.description}</p>
                </div>

                {/* Requirements */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-bold text-sm text-slate-800">Requirements</h3>
                  <ul className="list-disc pl-5 text-xs text-slate-655 space-y-1.5 font-sans">
                    {activeJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                {/* Apply Button */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => {
                      if (!appliedJobs.includes(activeJob.id)) {
                        setIsApplyModalOpen(true);
                      }
                    }}
                    disabled={appliedJobs.includes(activeJob.id)}
                    className={`px-6 py-2 rounded-full font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                      appliedJobs.includes(activeJob.id)
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                        : "bg-[#0077b5] text-white hover:bg-sky-850 shadow"
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
                <svg className="w-16 h-16 text-slate-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-slate-400 font-semibold text-center">
                  Select a job posting on the left to see details.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Easy Apply Modal */}
      {isApplyModalOpen && activeJob && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl overflow-hidden shadow-2xl p-6 border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 text-left">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 select-none">
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
                className="flex flex-col gap-4"
              >
                {/* Resume selection */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Choose Resume</label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
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

                    <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
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

                {/* Cover Letter */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cover Letter / Note to Recruiter</label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Introduce yourself and explain why you're a great fit for this role..."
                    className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-800 resize-none h-24 font-sans"
                  />
                </div>

                {/* Skill Match Status */}
                <div className="bg-sky-50 border border-sky-100 p-3 rounded-lg flex items-center gap-3">
                  <div className="text-xl font-bold text-[#0077b5]">{matchPercentage}%</div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">AI Skill Match Gauge</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {matchedSkills.length} of {matchedSkills.length + missingSkills.length} required skills matched.
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-slate-100 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:bg-slate-50 border border-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-1.5 rounded-full text-xs font-bold text-white bg-[#0077b5] hover:bg-sky-850 cursor-pointer shadow-md"
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
