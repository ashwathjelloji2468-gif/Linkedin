import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Layout from "@/components/Layout";
import api from "@/config";
import { fetchUserProfile } from "@/config/redux/action/authAction";

export default function PremiumPortal() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [loadingUpgrade, setLoadingUpgrade] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleUpgrade = async () => {
    try {
      setLoadingUpgrade(true);
      await api.put("/users/upgrade-premium");
      dispatch(fetchUserProfile());
      alert("Successfully upgraded to LinkedIn Premium! 🌟");
    } catch (err) {
      console.error("Failed to upgrade to premium:", err.message);
      alert("Upgrade failed. Please try again.");
    } finally {
      setLoadingUpgrade(false);
    }
  };

  const handleGenerateCoverLetter = (e) => {
    e.preventDefault();
    if (!jobTitle || !companyName) return;

    setGenerating(true);
    setTimeout(() => {
      const skillsStr = user?.skills?.slice(0, 5).join(", ") || "software engineering, React, Node.js";
      const school = user?.education?.[0]?.school || "CBIT";
      const experienceStr = user?.experience?.[0]
        ? `${user.experience[0].title} at ${user.experience[0].company}`
        : "Software Engineering Intern";

      const letter = `Dear Hiring Team at ${companyName},

I am writing to express my strong interest in the ${jobTitle} position at your esteemed organization. As a student graduating from ${school} with experience as a ${experienceStr}, I am confident in my ability to make an immediate impact on your team.

My technical background includes hands-on experience in: ${skillsStr}. Throughout my coursework and professional projects, I have focused on building clean, high-performance web applications and optimizing user experiences.

I am highly motivated to bring my background in software engineering and problem-solving to the ${jobTitle} role at ${companyName}. Thank you for your time and consideration, and I look forward to discussing how my skills align with your team's goals.

Sincerely,
${user?.name || "Candidate"}`;

      setGeneratedLetter(letter);
      setGenerating(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto flex flex-col gap-6 font-sans text-left select-none">
        
        {/* Back Link */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#0077b5] transition-colors mb-2 w-fit cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home Feed</span>
          </Link>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>IN</span>
                <span>Premium Career Portal</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Unlock exclusive AI tools and stand out to hiring managers at top tech firms.
              </p>
            </div>
            {user?.isPremium && (
              <span className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <span>🌟</span>
                <span>Premium Member</span>
              </span>
            )}
          </div>
        </div>

        {/* Upgrade card if not Premium */}
        {!user?.isPremium ? (
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 rounded-lg p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-base font-bold text-amber-900 flex items-center gap-1.5">
                <span>🚀</span>
                <span>Upgrade to LinkedIn Premium for ₹0</span>
              </h2>
              <p className="text-xs text-amber-800 leading-relaxed mt-2 font-medium">
                Get 4x more recruiter views, view detailed company insights, and unlock our proprietary **AI Cover Letter Generator** matched directly to your CBSE/CBIT academic history and engineering skills.
              </p>
            </div>
            <button
              onClick={handleUpgrade}
              disabled={loadingUpgrade}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md transition-all duration-150 flex-shrink-0 cursor-pointer focus:outline-none"
            >
              {loadingUpgrade ? "Upgrading..." : "Activate Premium Free"}
            </button>
          </div>
        ) : null}

        {/* Premium App: AI Cover Letter Generator */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <span>✉️</span>
              <span>AI Cover Letter Generator (Premium App)</span>
            </h2>
            {!user?.isPremium && (
              <span className="bg-amber-100 text-amber-850 text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                <span>🔒</span>
                <span>Premium Only</span>
              </span>
            )}
          </div>

          {user?.isPremium ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Form Input */}
              <form onSubmit={handleGenerateCoverLetter} className="col-span-12 md:col-span-5 flex flex-col gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-600 mb-1.5">Target Job Title</label>
                  <input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Frontend Developer Intern"
                    className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-850"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1.5">Target Company Name</label>
                  <input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Google India"
                    className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-850"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1.5">Job Description (Optional)</label>
                  <textarea
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    placeholder="Paste the job requirements here..."
                    className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-855 h-20 resize-none font-sans"
                  />
                </div>
                <button
                  type="submit"
                  disabled={generating}
                  className="w-full py-2.5 bg-[#0077b5] hover:bg-sky-850 text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer focus:outline-none text-center"
                >
                  {generating ? "Analyzing profile & generating..." : "Generate Cover Letter"}
                </button>
              </form>

              {/* Cover Letter Output */}
              <div className="col-span-12 md:col-span-7 flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-600">Generated Output</span>
                {generatedLetter ? (
                  <div className="flex flex-col gap-3">
                    <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-[10px] text-slate-800 whitespace-pre-wrap leading-relaxed select-all font-sans font-medium overflow-y-auto max-h-[350px]">
                      {generatedLetter}
                    </pre>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedLetter);
                        alert("Cover letter copied to clipboard!");
                      }}
                      className="px-4 py-1.5 text-xs font-bold text-[#0077b5] border border-[#0077b5] hover:bg-sky-50 rounded-full w-fit cursor-pointer focus:outline-none"
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-300 rounded-lg p-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center h-64 bg-slate-50/50">
                    <span>✨</span>
                    <span className="mt-1 font-semibold">Your generated cover letter will appear here.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-amber-200 bg-amber-50/20 rounded-lg p-10 text-center flex flex-col items-center justify-center gap-3">
              <span className="text-xl">🔒</span>
              <h3 className="font-bold text-xs text-amber-900">AI Cover Letter Generator is Locked</h3>
              <p className="text-[11px] text-slate-500 max-w-sm font-medium">
                Please activate your complimentary Premium Career subscription above to unlock premium features and AI resume tools.
              </p>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
