export default function RightSidebar() {
  const newsItems = [
    {
      title: "Next.js 16 launches globally",
      time: "2h ago",
      readers: "4,321 readers",
    },
    {
      title: "Tech hiring rebounds in Europe",
      time: "1d ago",
      readers: "12,987 readers",
    },
    {
      title: "The rise of Agentic AI coders",
      time: "1d ago",
      readers: "8,812 readers",
    },
    {
      title: "Remote work vs. hybrid model",
      time: "3d ago",
      readers: "24,005 readers",
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* LinkedIn News */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-sm text-slate-800">LinkedIn News</span>
          <svg className="w-4 h-4 text-slate-500 cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        </div>
        <div className="flex flex-col gap-3">
          {newsItems.map((item, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 group-hover:bg-[#0077b5] transition-colors"></span>
                <div className="flex flex-col flex-1">
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-[#0077b5] group-hover:underline transition-all leading-snug">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {item.time} • {item.readers}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promoted / Ads */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-center">
        <div className="flex justify-end">
          <span className="text-[10px] text-slate-400 font-medium cursor-pointer hover:underline">Ad •••</span>
        </div>
        <span className="text-[11px] text-slate-500 block mt-1">Get the latest insights on React 19</span>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="w-12 h-12 bg-sky-100 text-[#0077b5] rounded flex items-center justify-center font-bold text-lg">
            R19
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-800 block mt-3">
          Build Premium Web Applications
        </span>
        <button className="mt-4 w-full text-xs font-semibold text-[#0077b5] border border-[#0077b5] hover:bg-sky-50 py-1.5 rounded-full transition-all duration-200">
          Learn More
        </button>
      </div>
    </div>
  );
}
