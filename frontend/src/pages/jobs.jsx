import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "@/components/Layout";
import { updateProfile } from "@/config/redux/action/authAction";

export default function Jobs() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(1);
  const [appliedJobs, setAppliedJobs] = useState([]);

  const mockJobs = [
    {
      id: 1,
      title: "Frontend Engineer (React/Next.js)",
      company: "Google",
      location: "Mountain View, CA (Hybrid)",
      posted: "1 day ago",
      logoBg: "bg-red-100 text-red-600 font-bold",
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
      logoBg: "bg-indigo-100 text-indigo-600 font-bold",
      logoText: "S",
      description:
        "Join our engineering team to build payment infrastructure for the internet. You will work on full-stack systems, managing database schemas, core routing, and crafting sleek dashboard user interfaces.",
      requirements: [
        "4+ years of backend development (NodeJS, Express, MongoDB/SQL)",
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
  ];

  const handleApply = (jobId) => {
    if (appliedJobs.includes(jobId)) return;
    setAppliedJobs([...appliedJobs, jobId]);
  };

  const calculateSkillMatch = (job) => {
    if (!job || !user) return { matchPercentage: 0, matchedSkills: [], missingSkills: [] };

    // Technologies to scan for in description & requirements
    const techKeywords = [
      "React", "Next.js", "TypeScript", "Tailwind CSS", "Tailwind", "CSS", 
      "NodeJS", "Node.js", "Express", "MongoDB", "SQL", "APIs", "REST APIs", 
      "Public speaking", "communication"
    ];

    const jobText = (job.title + " " + job.description + " " + job.requirements.join(" ")).toLowerCase();
    const requiredTech = techKeywords.filter(tech => jobText.includes(tech.toLowerCase()));

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
    const updatedSkills = [...(user.skills || []), ...missing];
    dispatch(updateProfile({ skills: updatedSkills }));
  };

  const filteredJobs = mockJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeJob = mockJobs.find((j) => j.id === selectedJobId) || mockJobs[0];
  const { matchPercentage, matchedSkills, missingSkills } = calculateSkillMatch(activeJob);

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        {/* Top Search Bar */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="relative">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#edf3f8] text-slate-800 text-sm border border-transparent rounded px-9 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#0077b5] focus:bg-white placeholder-slate-500 transition-all font-sans"
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
          {/* Left Column: Jobs List */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-1">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
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
                    <div className={`w-10 h-10 rounded flex items-center justify-center text-lg ${job.logoBg}`}>
                      {job.logoText}
                    </div>
                    <div className="overflow-hidden flex-grow">
                      <h3 className="font-semibold text-sm text-slate-800 hover:underline truncate">
                        {job.title}
                      </h3>
                      <span className="text-xs text-slate-600 block mt-0.5 truncate">{job.company}</span>
                      <span className="text-xs text-slate-400 block mt-0.5 truncate">{job.location}</span>
                      <span className="text-[10px] text-slate-400 block mt-2">{job.posted}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400 text-center py-6 block bg-white border border-slate-200 rounded-lg">
                No matching jobs found.
              </span>
            )}
          </div>

          {/* Right Column: Job Description Details */}
          <div className="col-span-12 md:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-sm min-h-[50vh] flex flex-col justify-between">
            {activeJob ? (
              <div className="flex flex-col gap-4">
                {/* Header info */}
                <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                  <div className={`w-16 h-16 rounded flex items-center justify-center text-3xl ${activeJob.logoBg}`}>
                    {activeJob.logoText}
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold text-slate-800 leading-tight">{activeJob.title}</h2>
                    <span className="text-sm font-semibold text-slate-700 block mt-1">
                      {activeJob.company}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">{activeJob.location}</span>
                    <div className="mt-2 flex gap-2">
                      <span className="bg-slate-100 text-slate-650 text-[10px] px-2 py-0.5 rounded font-medium">
                        {activeJob.salary}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Unique Feature: AI Skill Fit Analysis Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-sky-100 rounded-bl-full opacity-35"></div>
                  
                  <div className="flex items-center gap-2 relative z-10">
                    <span className="text-sm">✨</span>
                    <h4 className="font-bold text-xs text-slate-800">AI Skill Match Coach</h4>
                    <span className="bg-sky-100 text-[#0077b5] text-[8px] px-1 py-0.5 rounded font-bold uppercase tracking-wider">Unique Match Analysis</span>
                  </div>

                  <div className="flex items-center gap-4 relative z-10">
                    {/* Gauge percentage */}
                    <div className="flex flex-col items-center">
                      <span className={`text-xl font-black ${matchPercentage >= 70 ? "text-emerald-600" : "text-amber-600"}`}>
                        {matchPercentage}%
                      </span>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Score</span>
                    </div>

                    <div className="flex-grow flex flex-col gap-2">
                      {/* Matched skills */}
                      {matchedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 items-center">
                          <span className="text-[10px] text-slate-400 font-semibold mr-1">Matched:</span>
                          {matchedSkills.map(skill => (
                            <span key={skill} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Missing skills */}
                      {missingSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1 items-center justify-between">
                          <div className="flex flex-wrap gap-1 items-center">
                            <span className="text-[10px] text-slate-400 font-semibold mr-1">Missing:</span>
                            {missingSkills.map(skill => (
                              <span key={skill} className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] px-2 py-0.5 rounded-full font-medium">
                                + {skill}
                              </span>
                            ))}
                          </div>
                          
                          <button
                            onClick={() => handleAddMissingSkills(missingSkills)}
                            className="text-[9px] font-bold text-[#0077b5] hover:underline cursor-pointer flex items-center gap-0.5"
                          >
                            ⚡ Auto-Add Skills
                          </button>
                        </div>
                      ) : (
                        <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          ✓ Perfect match! You possess all required technical skills for this role.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Body details */}
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 mb-2">Job Description</h3>
                    <p className="text-xs text-slate-650 leading-relaxed">{activeJob.description}</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-800 mb-2">Requirements</h3>
                    <ul className="list-disc list-inside text-xs text-slate-650 space-y-1 pl-1">
                      {activeJob.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => handleApply(activeJob.id)}
                    disabled={appliedJobs.includes(activeJob.id)}
                    className={`px-6 py-2 rounded-full font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                      appliedJobs.includes(activeJob.id)
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold"
                        : "bg-[#0077b5] text-white hover:bg-sky-800 shadow-md"
                    }`}
                  >
                    {appliedJobs.includes(activeJob.id) ? (
                      <>
                        <svg className="w-4 h-4 text-emerald-700 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
              <span className="text-xs text-slate-400 text-center py-6 my-auto block">
                Select a job posting to view details.
              </span>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
