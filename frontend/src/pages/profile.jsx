import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "@/components/Layout";
import api from "@/config";
import { updateProfile, uploadAvatarAction } from "@/config/redux/action/authAction";
import { API_BASE_URL } from "@/config";

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Modal display states
  const [isEditInfoOpen, setIsEditInfoOpen] = useState(false);
  const [isAddExpOpen, setIsAddExpOpen] = useState(false);
  const [isAddEduOpen, setIsAddEduOpen] = useState(false);
  const [showSummaryDraftModal, setShowSummaryDraftModal] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || "");
  const [headline, setHeadline] = useState(user?.headline || "");
  const [about, setAbout] = useState(user?.about || "");
  const [location, setLocation] = useState(user?.location || "");

  const [expTitle, setExpTitle] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expDesc, setExpDesc] = useState("");

  const [eduSchool, setEduSchool] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduField, setEduField] = useState("");
  const [eduYear, setEduYear] = useState("");

  const [newSkill, setNewSkill] = useState("");

  // AI Summary generator state
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [draftedSummary, setDraftedSummary] = useState("");

  const fileInputRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleUpdateInfo = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ name, headline, about, location }));
    setIsEditInfoOpen(false);
  };

  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!expTitle || !expCompany) return;
    const newExp = {
      title: expTitle,
      company: expCompany,
      description: expDesc,
      startDate: new Date(),
    };
    const updatedExperience = [...(user?.experience || []), newExp];
    dispatch(updateProfile({ experience: updatedExperience }));
    
    // Reset exp state
    setExpTitle("");
    setExpCompany("");
    setExpDesc("");
    setIsAddExpOpen(false);
  };

  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!eduSchool || !eduDegree) return;
    const newEdu = {
      school: eduSchool,
      degree: eduDegree,
      fieldOfStudy: eduField,
      graduationYear: parseInt(eduYear) || new Date().getFullYear(),
    };
    const updatedEducation = [...(user?.education || []), newEdu];
    dispatch(updateProfile({ education: updatedEducation }));

    // Reset edu state
    setEduSchool("");
    setEduDegree("");
    setEduField("");
    setEduYear("");
    setIsAddEduOpen(false);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const updatedSkills = [...(user?.skills || []), newSkill.trim()];
    dispatch(updateProfile({ skills: updatedSkills }));
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = (user?.skills || []).filter((s) => s !== skillToRemove);
    dispatch(updateProfile({ skills: updatedSkills }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profilePic", file);
    dispatch(uploadAvatarAction(formData));
  };

  const handleDownloadResume = async () => {
    try {
      const response = await api.get("/users/user/download_resume", {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${user?.username || "profile"}_resume.pdf`;
      link.click();
    } catch (error) {
      alert("Failed to generate resume. Please verify profile photo upload has JPEG support.");
    }
  };

  // AI Profile Coach Logic
  const getProfileStrengthPercentage = () => {
    let score = 20; // base score
    if (user?.about) score += 20;
    if (user?.experience?.length > 0) score += 20;
    if (user?.education?.length > 0) score += 20;
    if (user?.skills?.length >= 3) score += 20;
    return score;
  };

  const getProfileStrengthText = () => {
    const pct = getProfileStrengthPercentage();
    if (pct <= 40) return "Beginner";
    if (pct <= 80) return "Intermediate";
    return "All-Star 🌟";
  };

  const getRecommendations = () => {
    const recs = [];
    if (!user?.about) {
      recs.push("summary");
    }
    if (!user?.experience || user.experience.length === 0) {
      recs.push("experience");
    }
    if (!user?.education || user.education.length === 0) {
      recs.push("education");
    }
    if (!user?.skills || user.skills.length < 3) {
      recs.push("skills");
    }
    return recs;
  };

  const handleGenerateAISummary = () => {
    setIsGeneratingSummary(true);
    setTimeout(() => {
      const skillsStr = user?.skills?.slice(0, 4).join(", ") || "software development";
      const companyStr = user?.experience?.[0]?.company || "top organizations";
      const titleStr = user?.headline || "professional";

      const draft = `Highly motivated and results-driven ${titleStr}. Skilled in key technologies including ${skillsStr}. Dedicated to collaborating with cross-functional teams, solving complex engineering problems, and designing interactive, premium user interfaces that wow customers.`;
      
      setDraftedSummary(draft);
      setIsGeneratingSummary(false);
      setShowSummaryDraftModal(true);
    }, 1200);
  };

  const handleApplyAISummary = () => {
    dispatch(updateProfile({ about: draftedSummary }));
    setShowSummaryDraftModal(false);
  };

  const recommendations = getRecommendations();

  const defaultSkills = [
    "React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Express", 
    "MongoDB", "Python", "Docker", "Kubernetes", "AWS", "Git", "Redux", 
    "GraphQL", "System Design", "UI/UX"
  ];
  const recommendedSkillsList = defaultSkills.filter(
    (skill) => !user?.skills?.some((us) => us.toLowerCase() === skill.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        
        {/* Profile Card Header Widget */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm relative">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-sky-700 to-[#0077b5]"></div>

          {/* Profile details */}
          <div className="px-6 pb-6 relative flex flex-col md:flex-row md:items-end justify-between items-start gap-4">
            
            {/* Avatar uploader wrapper */}
            <div
              onClick={handleAvatarClick}
              className="w-28 h-28 rounded-full overflow-hidden absolute -top-14 border-4 border-white shadow-md bg-white cursor-pointer group flex items-center justify-center"
            >
              {user?.profilePicture ? (
                <img
                  src={`${API_BASE_URL}/uploads/${user.profilePicture.replace("uploads/", "")}`}
                  alt="avatar"
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="w-full h-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-3xl group-hover:opacity-80 transition-opacity">
                  {getInitials(user?.name)}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="mt-16 md:mt-4 md:flex-grow">
              <h1 className="text-xl font-bold text-slate-900">{user?.name}</h1>
              <span className="text-sm text-slate-650 block mt-0.5">{user?.headline || "Add a professional headline"}</span>
              <span className="text-xs text-slate-400 block mt-1">{user?.location || "Location not set"}</span>
              <span className="text-xs font-semibold text-[#0077b5] hover:underline cursor-pointer block mt-2">
                {user?.connections?.length || 0} connections
              </span>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => {
                  setName(user?.name || "");
                  setHeadline(user?.headline || "");
                  setAbout(user?.about || "");
                  setLocation(user?.location || "");
                  setIsEditInfoOpen(true);
                }}
                className="flex-grow md:flex-grow-0 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-[#0077b5] hover:bg-sky-850 transition-all shadow-sm cursor-pointer"
              >
                Edit Info
              </button>
              <button
                onClick={handleDownloadResume}
                className="flex-grow md:flex-grow-0 px-4 py-1.5 rounded-full text-xs font-semibold text-[#0077b5] border border-[#0077b5] hover:bg-sky-50 transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Resume</span>
              </button>
            </div>
          </div>
        </div>

        {/* Unique Feature: AI Profile Coach Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-bl-full opacity-40"></div>
          
          <div className="flex items-center gap-2 mb-3 relative z-10">
            <span className="text-base">✨</span>
            <h2 className="font-bold text-sm text-slate-800">AI Profile Coach</h2>
            <span className="bg-sky-100 text-[#0077b5] text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Unique AI Feature</span>
          </div>

          {/* Progress gauge */}
          <div className="mb-4 relative z-10">
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>Profile Strength: <span className="text-slate-800">{getProfileStrengthText()}</span></span>
              <span>{getProfileStrengthPercentage()}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-[#0077b5] h-full transition-all duration-500"
                style={{ width: `${getProfileStrengthPercentage()}%` }}
              ></div>
            </div>
          </div>

          {recommendations.length > 0 ? (
            <div className="flex flex-col gap-2.5 relative z-10">
              <span className="text-xs font-semibold text-slate-500">Recommended for you:</span>
              <ul className="text-xs space-y-2 pl-1">
                {recommendations.includes("summary") && (
                  <li className="flex items-center justify-between text-slate-650">
                    <span className="flex items-center gap-1.5">
                      <span className="text-amber-500 font-bold">⚠️</span>
                      <span>Your profile lacks a professional summary.</span>
                    </span>
                    <button
                      onClick={handleGenerateAISummary}
                      disabled={isGeneratingSummary}
                      className="text-xs font-semibold text-[#0077b5] hover:underline flex items-center gap-1"
                    >
                      {isGeneratingSummary ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-[#0077b5] border-t-transparent"></div>
                      ) : (
                        "✨ Generate AI Bio"
                      )}
                    </button>
                  </li>
                )}
                {recommendations.includes("experience") && (
                  <li className="flex items-center gap-1.5 text-slate-650">
                    <span className="text-amber-500 font-bold">⚠️</span>
                    <span>No work history. Add experience to show achievements.</span>
                  </li>
                )}
                {recommendations.includes("education") && (
                  <li className="flex items-center gap-1.5 text-slate-650">
                    <span className="text-amber-500 font-bold">⚠️</span>
                    <span>No school credentials. Complete education data.</span>
                  </li>
                )}
                {recommendations.includes("skills") && (
                  <li className="flex items-center gap-1.5 text-slate-650">
                    <span className="text-amber-500 font-bold">⚠️</span>
                    <span>Add at least 3 skills to show capabilities.</span>
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <div className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
              <span>✓</span>
              <span>Congratulations! Your profile is fully complete and ready to stand out!</span>
            </div>
          )}
        </div>

        {/* About/Bio Section Widget */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-sm text-slate-800 mb-3">About</h2>
          <p className="text-xs text-slate-650 leading-relaxed whitespace-pre-wrap">
            {user?.about || "Write something about yourself to complete your profile."}
          </p>
        </div>

        {/* Experience Section Widget */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-sm text-slate-800">Experience</h2>
            <button
              onClick={() => setIsAddExpOpen(true)}
              className="text-slate-500 hover:text-[#0077b5] p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </button>
          </div>
          {user?.experience && user.experience.length > 0 ? (
            <div className="flex flex-col gap-4">
              {user.experience.map((exp, index) => (
                <div key={index} className="flex gap-3 pb-3 border-b border-slate-100 last:border-b-0 last:pb-0">
                  <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-600">
                    {exp.company?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-slate-800">{exp.title}</h3>
                    <span className="text-xs text-slate-600 block mt-0.5">{exp.company}</span>
                    <span className="text-[10px] text-slate-500 block mt-1 leading-relaxed">
                      {exp.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-slate-455 text-center py-4">No experience listed.</span>
          )}
        </div>

        {/* Education Section Widget */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-sm text-slate-800">Education</h2>
            <button
              onClick={() => setIsAddEduOpen(true)}
              className="text-slate-500 hover:text-[#0077b5] p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </button>
          </div>
          {user?.education && user.education.length > 0 ? (
            <div className="flex flex-col gap-4">
              {user.education.map((edu, index) => (
                <div key={index} className="flex gap-3 pb-3 border-b border-slate-100 last:border-b-0 last:pb-0">
                  <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-600">
                    {edu.school?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-slate-800">{edu.school}</h3>
                    <span className="text-xs text-slate-600 block mt-0.5">
                      {edu.degree} - {edu.fieldOfStudy}
                    </span>
                    <span className="text-[10px] text-slate-450 block mt-0.5">Graduated: {edu.graduationYear}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-slate-455 text-center py-4">No education listed.</span>
          )}
        </div>

        {/* Skills Section Widget */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-sm text-slate-800 mb-3">Skills</h2>
          <form onSubmit={handleAddSkill} className="flex gap-2 mb-4">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="border border-slate-300 rounded px-3 py-1 text-xs flex-grow focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-800"
              placeholder="Add a new skill (e.g. Next.js)"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#0077b5] hover:bg-sky-850 text-white rounded text-xs font-semibold cursor-pointer"
            >
              Add
            </button>
          </form>
          {user?.skills && user.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3 py-1 rounded-full flex items-center gap-1.5 group transition-colors"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-red-500 rounded-full focus:outline-none"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {recommendedSkillsList.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-semibold block mb-2">Recommended Skills (Quick Add):</span>
              <div className="flex flex-wrap gap-1.5">
                {recommendedSkillsList.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      const updatedSkills = [...(user?.skills || []), skill];
                      const uniqueSkills = Array.from(new Set(updatedSkills));
                      dispatch(updateProfile({ skills: uniqueSkills }));
                    }}
                    className="bg-sky-50/50 hover:bg-sky-100 border border-sky-200 text-[#0077b5] text-[10px] px-2.5 py-1 rounded-full cursor-pointer transition-colors duration-150 font-sans"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* MODAL: AI Summary Draft Details */}
      {showSummaryDraftModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl overflow-hidden shadow-2xl p-6 border border-slate-200 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-base text-slate-800 flex items-center gap-1.5">
                <span>✨</span>
                <span>AI Summary Assistant</span>
              </h3>
              <button onClick={() => setShowSummaryDraftModal(false)} className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-xs text-slate-500 mb-4 leading-normal">
              Based on your details, here is a drafted summary for your LinkedIn profile:
            </p>

            <div className="bg-sky-50/50 p-4 border border-sky-100 rounded-lg text-slate-800 text-xs leading-relaxed mb-5 italic select-all">
              "{draftedSummary}"
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowSummaryDraftModal(false)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:bg-slate-50 border border-slate-200 cursor-pointer"
              >
                Discard
              </button>
              <button
                onClick={handleApplyAISummary}
                className="px-5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#0077b5] hover:bg-sky-850 cursor-pointer shadow-md"
              >
                Apply to Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Personal Info */}
      {isEditInfoOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl overflow-hidden shadow-2xl p-6 border border-slate-200 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-slate-800">Edit Info</h3>
              <button onClick={() => setIsEditInfoOpen(false)} className="text-slate-400 hover:bg-slate-150 p-1.5 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdateInfo} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-850"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Headline</label>
                <input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-850"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-855"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">About</label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-855"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="mt-2 w-full bg-[#0077b5] hover:bg-sky-850 text-white font-semibold py-2 rounded text-xs cursor-pointer shadow"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Experience */}
      {isAddExpOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl overflow-hidden shadow-2xl p-6 border border-slate-200 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-slate-800">Add Experience</h3>
              <button onClick={() => setIsAddExpOpen(false)} className="text-slate-400 hover:bg-slate-150 p-1.5 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddExperience} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Title</label>
                <input
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-850"
                  placeholder="e.g. Software Engineer"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Company</label>
                <input
                  value={expCompany}
                  onChange={(e) => setExpCompany(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-850"
                  placeholder="e.g. Microsoft"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
                <textarea
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-855"
                  placeholder="Describe your role and accomplishments..."
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="mt-2 w-full bg-[#0077b5] hover:bg-sky-855 text-white font-semibold py-2 rounded text-xs cursor-pointer shadow"
              >
                Add Experience
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Education */}
      {isAddEduOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl overflow-hidden shadow-2xl p-6 border border-slate-200 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-slate-800">Add Education</h3>
              <button onClick={() => setIsAddEduOpen(false)} className="text-slate-400 hover:bg-slate-150 p-1.5 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddEducation} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">School</label>
                <input
                  value={eduSchool}
                  onChange={(e) => setEduSchool(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-850"
                  placeholder="e.g. Stanford University"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Degree</label>
                <input
                  value={eduDegree}
                  onChange={(e) => setEduDegree(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-855"
                  placeholder="e.g. Bachelor of Science"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Field of Study</label>
                <input
                  value={eduField}
                  onChange={(e) => setEduField(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-855"
                  placeholder="e.g. Computer Science"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Graduation Year</label>
                <input
                  type="number"
                  value={eduYear}
                  onChange={(e) => setEduYear(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-855"
                  placeholder="e.g. 2026"
                />
              </div>
              <button
                type="submit"
                className="mt-2 w-full bg-[#0077b5] hover:bg-sky-855 text-white font-semibold py-2 rounded text-xs cursor-pointer shadow"
              >
                Add Education
              </button>
            </form>
          </div>
        </div>
      )}

    </Layout>
  );
}
