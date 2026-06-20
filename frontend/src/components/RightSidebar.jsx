import { useState } from "react";

export default function RightSidebar() {
  const [showAllNews, setShowAllNews] = useState(false);
  const [showAllPuzzles, setShowAllPuzzles] = useState(false);

  const mainNews = [
    {
      title: "India-UK CETA: What it means for ...",
      time: "21h ago",
      readers: "1,174 readers",
    },
    {
      title: "Korean instant noodles cook up India ...",
      time: "19h ago",
      readers: "843 readers",
    },
    {
      title: "Banks rejig strategies to retain NRI ...",
      time: "15h ago",
      readers: "435 readers",
    },
    {
      title: "Rural e-commerce startups attract ...",
      time: "17h ago",
      readers: "361 readers",
    },
    {
      title: "India shines in global clean energy race",
      time: "19h ago",
      readers: "309 readers",
    },
  ];

  const extraNews = [
    {
      title: "Next.js 16 releases advanced dev tooling",
      time: "1d ago",
      readers: "4,512 readers",
    },
    {
      title: "Hiring trends pivot towards Agentic AI developers",
      time: "2d ago",
      readers: "12,940 readers",
    },
    {
      title: "Secunderabad tech startups raise seed funding",
      time: "3d ago",
      readers: "612 readers",
    },
  ];

  const activeNews = showAllNews ? [...mainNews, ...extraNews] : mainNews;

  const mainPuzzles = [
    {
      name: "Wend",
      number: "#11",
      connections: "7 connections played",
      bgClass: "bg-amber-100 text-amber-800 border-amber-300",
      letter: "WE",
      subLetter: "DN",
    },
    {
      name: "Patches",
      number: "#94",
      connections: "8 connections played",
      bgClass: "bg-blue-100 text-blue-800 border-blue-300",
      letter: "PA",
      subLetter: "TC",
    },
    {
      name: "Zip",
      number: "#459",
      connections: "18 connections played",
      bgClass: "bg-orange-100 text-orange-850 border-orange-300",
      letter: "ZI",
      subLetter: "PP",
    },
    {
      name: "Mini Sudoku",
      number: "#312",
      connections: "7 connections played",
      bgClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      letter: "12",
      subLetter: "34",
    },
  ];

  const extraPuzzles = [
    {
      name: "Crossword",
      number: "#88",
      connections: "12 connections played",
      bgClass: "bg-purple-100 text-purple-800 border-purple-300",
      letter: "CR",
      subLetter: "WD",
    },
  ];

  const activePuzzles = showAllPuzzles ? [...mainPuzzles, ...extraPuzzles] : mainPuzzles;

  return (
    <div className="flex flex-col gap-3">
      {/* LinkedIn News */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-left">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-sm text-slate-800">LinkedIn News</span>
          {/* Info Icon */}
          <svg className="w-3.5 h-3.5 text-slate-500 cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        </div>

        <div className="flex flex-col gap-3 mb-2">
          {activeNews.map((item, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 group-hover:bg-[#0077b5] transition-colors flex-shrink-0"></span>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-bold text-slate-700 group-hover:text-[#0077b5] group-hover:underline transition-all leading-snug truncate">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    {item.time} • {item.readers}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowAllNews(!showAllNews)}
          className="w-full text-left text-xs font-bold text-slate-550 hover:bg-slate-50 p-1.5 rounded flex items-center justify-start gap-1 transition-all mt-1 focus:outline-none cursor-pointer"
        >
          <span>{showAllNews ? "Show less" : "Show more"}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${showAllNews ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Today's puzzles */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-left">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-sm text-slate-800">Today's puzzles</span>
          <svg className="w-3.5 h-3.5 text-slate-550 cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        </div>

        <div className="flex flex-col gap-3.5 mb-2">
          {activePuzzles.map((puzzle, idx) => (
            <div key={idx} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50/50 p-1 rounded transition-all">
              <div className="flex items-center gap-3">
                {/* Puzzle Icon Tile */}
                <div className={`w-10 h-10 rounded border flex flex-col items-center justify-center font-bold text-[9px] ${puzzle.bgClass} flex-shrink-0 shadow-sm leading-none`}>
                  <div>{puzzle.letter}</div>
                  <div className="mt-0.5">{puzzle.subLetter}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs text-slate-800 group-hover:text-[#0077b5] group-hover:underline transition-all">
                      {puzzle.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{puzzle.number}</span>
                  </div>
                  <span className="text-[10px] text-slate-450 font-medium block mt-0.5">
                    {puzzle.connections}
                  </span>
                </div>
              </div>
              {/* Arrow Indicator */}
              <svg className="w-5 h-5 text-slate-400 group-hover:text-[#0077b5] transition-all transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowAllPuzzles(!showAllPuzzles)}
          className="w-full text-left text-xs font-bold text-slate-550 hover:bg-slate-50 p-1.5 rounded flex items-center justify-start gap-1 transition-all mt-1 focus:outline-none cursor-pointer"
        >
          <span>{showAllPuzzles ? "Show less" : "Show more"}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${showAllPuzzles ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
