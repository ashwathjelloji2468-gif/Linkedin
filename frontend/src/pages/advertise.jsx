import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Layout from "@/components/Layout";
import api from "@/config";
import { fetchUserProfile } from "@/config/redux/action/authAction";

export default function LinkedInAdvertise() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [campName, setCampName] = useState("");
  const [campObjective, setCampObjective] = useState("Website Visits");
  const [campBudget, setCampBudget] = useState("");
  const [campAudience, setCampAudience] = useState("Software Engineers in India");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!campName || !campBudget) return;

    try {
      setLoading(true);
      await api.post("/users/business/create-campaign", {
        name: campName,
        objective: campObjective,
        budget: Number(campBudget),
        targetAudience: campAudience
      });
      dispatch(fetchUserProfile());
      alert(`Ad campaign "${campName}" registered successfully in the database!`);
      
      // Reset form
      setCampName("");
      setCampObjective("Website Visits");
      setCampBudget("");
      setCampAudience("Software Engineers in India");
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create campaign:", err.message);
      alert(err.response?.data?.message || "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  // Calculate campaign metrics
  const activeCampaigns = user?.adCampaigns || [];
  const totalCampaignsCount = activeCampaigns.length;
  const totalBudget = activeCampaigns.reduce((acc, curr) => acc + (curr.budget || 0), 0);
  const totalSpent = activeCampaigns.reduce((acc, curr) => acc + (curr.spent || 0), 0);

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
              <h1 className="text-xl font-bold text-slate-900">LinkedIn Campaign Manager</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Design precision B2B ad campaigns, set budgets, select targets, and view conversion insights.
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#0077b5] hover:bg-sky-850 text-white font-bold px-5 py-2.5 rounded-full text-xs transition-all cursor-pointer focus:outline-none"
            >
              {showForm ? "Close Form" : "Create New Campaign"}
            </button>
          </div>
        </div>

        {/* Campaign Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Campaigns</span>
            <span className="text-2xl font-bold text-slate-800 block mt-1.5">{totalCampaignsCount}</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Allocated Budget</span>
            <span className="text-2xl font-bold text-slate-800 block mt-1.5">₹{totalBudget.toLocaleString()}</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Spent</span>
            <span className="text-2xl font-bold text-[#0077b5] block mt-1.5">₹{totalSpent.toLocaleString()}</span>
          </div>
        </div>

        {/* Campaign creation form */}
        {showForm && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col gap-4 animate-in fade-in duration-200">
            <h2 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span>🎯</span>
              <span>Launch a New Ad Campaign</span>
            </h2>
            <form onSubmit={handleCreateCampaign} className="grid grid-cols-12 gap-4 text-xs font-semibold">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-slate-600 mb-1">Campaign Name *</label>
                <input
                  required
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  placeholder="e.g. Q3 Cloud Infrastructure Campaign"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-800"
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-slate-600 mb-1">Campaign Objective *</label>
                <select
                  value={campObjective}
                  onChange={(e) => setCampObjective(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-800 bg-white"
                >
                  <option>Website Visits</option>
                  <option>Brand Awareness</option>
                  <option>Lead Generation</option>
                  <option>Job Applications</option>
                </select>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-slate-600 mb-1">Daily Budget (INR) *</label>
                <input
                  required
                  type="number"
                  value={campBudget}
                  onChange={(e) => setCampBudget(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-800"
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-slate-600 mb-1">Target Audience Profile</label>
                <input
                  value={campAudience}
                  onChange={(e) => setCampAudience(e.target.value)}
                  placeholder="e.g. Software Engineers, DevOps, IT Decision Makers"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0077b5] text-slate-800"
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
                  {loading ? "Creating..." : "Launch Ad Campaign"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* User's Created Campaigns List */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col gap-4">
          <h2 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <span>🎯</span>
            <span>Your Campaigns list</span>
          </h2>
          {activeCampaigns.length > 0 ? (
            <div className="flex flex-col gap-3.5">
              {activeCampaigns.map((camp, idx) => (
                <div key={idx} className="border border-slate-150 rounded-lg p-4 bg-slate-50/50 flex flex-col gap-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs text-slate-800">{camp.name}</span>
                    <span className="bg-green-100 text-green-800 text-[8px] font-bold px-2 py-0.5 rounded-full">
                      {camp.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-slate-500 font-bold mt-1">
                    <div>
                      <span className="block text-slate-400">Objective</span>
                      <span className="text-slate-700">{camp.objective}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Daily Budget</span>
                      <span className="text-slate-700">₹{camp.budget?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Target Audience</span>
                      <span className="text-slate-700 truncate block max-w-[150px]">{camp.targetAudience}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Spent (To Date)</span>
                      <span className="text-slate-700">₹{camp.spent || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg bg-slate-50/50 text-xs text-slate-400 flex flex-col items-center justify-center gap-1.5">
              <span>📭</span>
              <span className="font-semibold">No active ad campaigns yet. Launch one above!</span>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
