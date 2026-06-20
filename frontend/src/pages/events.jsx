import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Layout from "@/components/Layout";
import { fetchUserProfile } from "@/config/redux/action/authAction";
import api from "@/config";

const EVENTS_DATA = [
  {
    name: "Amazon Hackathon 2026",
    host: "Amazon Student Developer Clubs",
    date: "June 28, 2026",
    time: "09:00 AM - 06:00 PM (IST)",
    location: "Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad",
    type: "In-Person",
    attendeesCount: 450,
    description: "A 24-hour developer hackathon focusing on building React/Node.js full-stack web applications and spatial AI tools. Compete for prizes, meet mentors, and build MVPs under the deadline.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&auto=format&fit=crop&q=60",
    speakers: ["Aisha Khan (Full-stack Developer @ CBIT)", "Siddharth Rao (Principal Cloud Architect @ Amazon)"],
    link: "https://meet.google.com/abc-defg-hij"
  },
  {
    name: "Generative AI & LLM Summit",
    host: "xAI & Hyderabad Tech Community",
    date: "July 05, 2026",
    time: "03:00 PM - 07:00 PM (IST)",
    location: "Virtual Event (Google Meet link provided)",
    type: "Virtual",
    attendeesCount: 1250,
    description: "Diving deep into LLMs, open-weights models like Llama 3, PyTorch fine-tuning, and scalable inference architectures. Learn best practices for integrating AI into Next.js web applications.",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=300&auto=format&fit=crop&q=60",
    speakers: ["Sam Altman (CEO @ OpenAI)", "Dr. Priya Sen (AI Researcher @ IIT Hyderabad)"],
    link: "https://meet.google.com/xyz-pdqr-wuv"
  },
  {
    name: "System Design Bootcamp: Scalable Architectures",
    host: "System Design Academy",
    date: "July 12, 2026",
    time: "10:00 AM - 02:00 PM (IST)",
    location: "Hyderabad IT Corridor Hub, Gachibowli",
    type: "In-Person",
    attendeesCount: 380,
    description: "Practical bootcamp on microservices, Apache Kafka event streams, Redis cache replication, and designing database systems for millions of operations per second.",
    image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=300&auto=format&fit=crop&q=60",
    speakers: ["Jensen Huang (CEO @ NVIDIA)", "Kiran Dev (Staff Systems Engineer @ Uber)"],
    link: "https://meet.google.com/sd-bootcamp-meet"
  },
  {
    name: "Hyderabad React Developers Meetup",
    host: "JS Hyderabad Community",
    date: "July 19, 2026",
    time: "04:00 PM - 06:00 PM (IST)",
    location: "Virtual (Zoom / YouTube Live)",
    type: "Virtual",
    attendeesCount: 780,
    description: "Discussing the latest updates in React 19, Compiler optimizers, React Server Actions, and Next.js Turbopack integrations. Q&A and community showcase session.",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=300&auto=format&fit=crop&q=60",
    speakers: ["Mark Zuckerberg (CEO @ Meta)", "Aisha Khan (Frontend Lead @ JS Hyd)"],
    link: "https://zoom.us/j/react-hyd-meetup"
  }
];

export default function Events() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loadingMap, setLoadingMap] = useState({});

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleToggleAttendance = async (eventName, isAttending) => {
    setLoadingMap(prev => ({ ...prev, [eventName]: true }));
    try {
      const action = isAttending ? "leave" : "join";
      await api.put("/users/update-discover", {
        type: "event",
        name: eventName,
        action
      });
      dispatch(fetchUserProfile());
    } catch (err) {
      console.error("Failed to update event attendance:", err.message);
    } finally {
      setLoadingMap(prev => ({ ...prev, [eventName]: false }));
    }
  };

  const attendingEvents = EVENTS_DATA.filter(ev => 
    user?.joinedEvents?.includes(ev.name)
  );

  const exploreEvents = EVENTS_DATA.filter(ev => 
    !user?.joinedEvents?.includes(ev.name)
  );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto flex flex-col gap-6 text-left select-none pb-10">
        
        {/* Header Widget */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-grow">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <span>LinkedIn Tech Events</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1.5">
              Discover and join virtual or in-person developer conferences, hackathons, and networking sessions.
            </p>
          </div>
          <Link href="/" className="px-4 py-1.5 bg-[#0077b5] text-white hover:bg-sky-850 rounded-full text-xs font-semibold shadow-sm transition-all flex items-center gap-1 cursor-pointer">
            <span>←</span> Back to Feed
          </Link>
        </div>

        {/* 1. Attending Events Section (Conditional) */}
        {attendingEvents.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-xs text-slate-500 uppercase tracking-wider pl-1">
              Your Registered Events ({attendingEvents.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {attendingEvents.map((ev) => (
                <div 
                  key={ev.name}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="h-28 relative bg-slate-100">
                    <img 
                      src={ev.image} 
                      alt={ev.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
                      ✓ Registered
                    </div>
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                      {ev.type}
                    </div>
                  </div>

                  <div className="p-4 flex-grow flex flex-col gap-2">
                    <span className="text-[10px] text-red-500 font-bold uppercase">{ev.date} • {ev.time}</span>
                    <h3 
                      className="font-bold text-sm text-slate-800 hover:text-[#0077b5] cursor-pointer hover:underline line-clamp-1"
                      onClick={() => setSelectedEvent(ev)}
                    >
                      {ev.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {ev.description}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2 justify-end">
                    <button
                      onClick={() => setSelectedEvent(ev)}
                      className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded cursor-pointer transition-colors"
                    >
                      Event Details
                    </button>
                    <button
                      onClick={() => handleToggleAttendance(ev.name, true)}
                      disabled={loadingMap[ev.name]}
                      className="px-3 py-1 border border-red-500 hover:bg-red-50 text-red-500 text-xs font-semibold rounded cursor-pointer transition-colors flex items-center justify-center min-w-[90px]"
                    >
                      {loadingMap[ev.name] ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-red-500 border-t-transparent"></div>
                      ) : (
                        "Leave Event"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Explore Events */}
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-xs text-slate-500 uppercase tracking-wider pl-1">
            Explore Upcoming Events
          </h2>
          {exploreEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {exploreEvents.map((ev) => (
                <div 
                  key={ev.name}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="h-28 relative bg-slate-100">
                    <img 
                      src={ev.image} 
                      alt={ev.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                      {ev.type}
                    </div>
                  </div>

                  <div className="p-4 flex-grow flex flex-col gap-2">
                    <span className="text-[10px] text-[#0077b5] font-bold uppercase">{ev.date}</span>
                    <h3 
                      className="font-bold text-xs text-slate-800 hover:text-[#0077b5] cursor-pointer hover:underline line-clamp-1"
                      onClick={() => setSelectedEvent(ev)}
                    >
                      {ev.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 line-clamp-3 leading-relaxed">
                      {ev.description}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2 justify-between items-center">
                    <span className="text-[9px] text-slate-400 font-bold">
                      👥 {ev.attendeesCount}+ attending
                    </span>
                    <button
                      onClick={() => handleToggleAttendance(ev.name, false)}
                      disabled={loadingMap[ev.name]}
                      className="px-3.5 py-1 bg-[#0077b5] hover:bg-sky-855 text-white text-xs font-semibold rounded shadow-sm cursor-pointer transition-colors flex items-center justify-center min-w-[70px]"
                    >
                      {loadingMap[ev.name] ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                      ) : (
                        "Attend"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-400 text-xs">
              🎉 You've registered for all scheduled events. Make sure to mark your calendar!
            </div>
          )}
        </div>

        {/* Modal: Event Details */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-xl overflow-hidden shadow-2xl p-6 border border-slate-200 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-150">
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <span>📅</span>
                  <span>Event Schedule</span>
                </h3>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-full cursor-pointer focus:outline-none transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto flex-grow flex flex-col gap-4 pr-1">
                <div className="rounded-lg overflow-hidden border border-slate-150 bg-slate-50 h-36">
                  <img 
                    src={selectedEvent.image} 
                    alt={selectedEvent.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-left flex flex-col gap-1">
                  <h2 className="font-bold text-base text-slate-900 leading-tight">{selectedEvent.name}</h2>
                  <span className="text-xs text-slate-500 font-medium mt-1">Hosted by <strong className="text-slate-700">{selectedEvent.host}</strong></span>
                </div>

                <div className="border border-slate-150 bg-slate-50 p-3 rounded-lg flex flex-col gap-2 text-xs text-slate-655 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📅</span>
                    <span><strong>Date:</strong> {selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">🕒</span>
                    <span><strong>Time:</strong> {selectedEvent.time}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-base">📍</span>
                    <span><strong>Location:</strong> {selectedEvent.location} ({selectedEvent.type})</span>
                  </div>
                </div>

                <div className="text-xs text-slate-655 leading-relaxed text-left">
                  <h4 className="font-bold text-[10px] text-slate-500 uppercase tracking-wider mb-1">About the Event</h4>
                  <p>{selectedEvent.description}</p>
                </div>

                {/* Speakers */}
                <div className="text-left flex flex-col gap-1.5">
                  <h4 className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Speakers</h4>
                  <ul className="text-xs text-slate-655 list-disc pl-4 space-y-1">
                    {selectedEvent.speakers.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Attendee link (Conditional) */}
                {user?.joinedEvents?.includes(selectedEvent.name) && (
                  <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-xs text-slate-800 text-left flex flex-col gap-1">
                    <span className="font-bold text-[#0077b5]">🚀 Join Link is Active:</span>
                    <p className="text-[10px] text-slate-600">You are registered! Use the link below to join the event when it starts:</p>
                    <a 
                      href={selectedEvent.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#0077b5] underline hover:text-sky-850 font-mono mt-1.5 break-all block"
                    >
                      {selectedEvent.link}
                    </a>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex gap-2 justify-end border-t border-slate-100 pt-4 mt-4">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:bg-slate-50 border border-slate-200 cursor-pointer"
                >
                  Close
                </button>
                {user?.joinedEvents?.includes(selectedEvent.name) ? (
                  <button
                    onClick={() => {
                      handleToggleAttendance(selectedEvent.name, true);
                      setSelectedEvent(null);
                    }}
                    className="px-5 py-1.5 rounded-full text-xs font-semibold text-white bg-red-500 hover:bg-red-650 cursor-pointer shadow-md transition-colors"
                  >
                    Leave Event
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleToggleAttendance(selectedEvent.name, false);
                      setSelectedEvent(null);
                    }}
                    className="px-5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#0077b5] hover:bg-sky-850 cursor-pointer shadow-md transition-colors"
                  >
                    Register / Attend
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
