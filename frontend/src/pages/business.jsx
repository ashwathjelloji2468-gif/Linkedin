import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Layout from "@/components/Layout";
import api from "@/config";
import { fetchUserProfile } from "@/config/redux/action/authAction";

export default function BusinessSolutions() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [compName, setCompName] = useState("");
  const [compIndustry, setCompIndustry] = useState("");
  const [compWebsite, setCompWebsite] = useState("");
  const [compSize, setCompSize] = useState("1-10 employees");
  const [compDesc, setCompDesc] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!compName || !compIndustry) return;

    try {
      setLoading(true);
      await api.post("/users/business/create-company", {
        name: compName,
        industry: compIndustry,
        website: compWebsite,
        size: compSize,
        description: compDesc
      });
      dispatch(fetchUserProfile());
      alert(`Company page "${compName}" registered successfully in the database!`);
      
      // Reset form
      setCompName("");
      setCompIndustry("");
      setCompWebsite("");
      setCompSize("1-10 employees");
      setCompDesc("");
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create company:", err.message);
      alert(err.response?.data?.message || "Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  const solutionsList = [
    { title: "Talent Solutions", desc: "Find, recruit, and hire exceptional engineering talent using our advanced matcher.", icon: "👥" },
    { title: "Sales Solutions", desc: "Connect with key decision makers and generate high-value B2B tech leads.", icon: "📈" },
    { title: "Learning Solutions", desc: "Upskill your developers with certified React, Next.js, and GenAI courses.", icon: "🎓" },
    { title: "Marketing Solutions", desc: "Reach business customers and grow your brand on the world's largest professional network.", icon: "🎯" }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto flex flex-col gap-6 font-sans text-left select-none">
        
        {/* Header Widget */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#0077b5] transition-colors mb-2 w-fit cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home Feed</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">LinkedIn Business Services</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Explore specialized enterprise solutions and manage your registered company profiles.
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#0077b5] hover:bg-sky-850 text-white font-bold px-5 py-2.5 rounded-full text-xs transition-all cursor-pointer focus:outline-none"
            >
              {showForm ? "Close Form" : "Create a Company Page"}
            </button>
          </div>
        </div>

        {/* Company creation form */}
        {showForm && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col gap-4 animate-in fade-in duration-200">
            <h2 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span>🏢</span>
              <span>Register a New Company Page</span>
            </h2>
            <form onSubmit={handleCreateCompany} className="grid grid-cols-12 gap-4 text-xs font-semibold">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-slate-600 mb-1">Company Name *</label>
                <input
                  required
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  placeholder="e.g. Acme Tech Solutions"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-800"
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-slate-600 mb-1">Industry *</label>
                <input
                  required
                  value={compIndustry}
                  onChange={(e) => setCompIndustry(e.target.value)}
                  placeholder="e.g. Information Technology & Services"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-800"
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-slate-600 mb-1">Website URL</label>
                <input
                  value={compWebsite}
                  onChange={(e) => setCompWebsite(e.target.value)}
                  placeholder="e.g. https://www.acmetech.com"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-800"
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-slate-600 mb-1">Company Size</label>
                <select
                  value={compSize}
                  onChange={(e) => setCompSize(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-800 bg-white"
                >
                  <option>1-10 employees</option>
                  <option>11-50 employees</option>
                  <option>51-200 employees</option>
                  <option>201-500 employees</option>
                  <option>500+ employees</option>
                </select>
              </div>
              <div className="col-span-12">
                <label className="block text-slate-600 mb-1">Company Description</label>
                <textarea
                  value={compDesc}
                  onChange={(e) => setCompDesc(e.target.value)}
                  placeholder="Write a brief tagline or description..."
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-800 h-20 resize-none font-sans"
                />
              </div>
              <div className="col-span-12 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-slate-300 rounded-full hover:bg-slate-50 cursor-pointer focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#0077b5] text-white rounded-full hover:bg-sky-850 cursor-pointer focus:outline-none shadow"
                >
                  {loading ? "Registering..." : "Submit Company Page"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* User's Created Companies List */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col gap-4">
          <h2 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <span>🏢</span>
            <span>Your Registered Company Pages</span>
          </h2>
          {user?.businessCompanies && user.businessCompanies.length > 0 ? (
            <div className="flex flex-col gap-3.5">
              {user.businessCompanies.map((comp, idx) => (
                <div key={idx} className="border border-slate-150 rounded-lg p-4 bg-slate-50/50 flex flex-col gap-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs text-[#0077b5]">{comp.name}</span>
                    <span className="text-[9px] text-slate-400 font-bold">
                      Created on {new Date(comp.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold block">{comp.industry} • {comp.size}</span>
                  {comp.website && (
                    <a
                      href={comp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#0077b5] font-bold hover:underline w-fit"
                    >
                      {comp.website}
                    </a>
                  )}
                  {comp.description && (
                    <p className="text-[10px] text-slate-600 leading-relaxed font-medium mt-1">
                      {comp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg bg-slate-50/50 text-xs text-slate-400 flex flex-col items-center justify-center gap-1.5">
              <span>📭</span>
              <span className="font-semibold">You haven't registered any company pages yet.</span>
            </div>
          )}
        </div>

        {/* Business Solutions grid */}
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-sm text-slate-800 uppercase tracking-wider pl-1">Enterprise Solutions Catalog</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {solutionsList.map((sol, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all flex gap-4">
                <div className="text-3xl flex items-center justify-center p-2.5 bg-sky-50/70 rounded-lg h-fit select-none">
                  {sol.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xs text-slate-800">{sol.title}</h3>
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed font-medium">
                    {sol.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}
