import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import UserSidebar from "../../components/UserSidebar";
import { Calendar, Clock, Ticket, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";

export default function Slots() {
  const [date, setDate] = useState("");
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const serviceId = id;

  const fetchSlots = async () => {
    if (!date) return alert("Please select a date first");
    setLoading(true);
    try {
      const res = await api.get("/segments/available", { params: { serviceId, date }});
      setSegments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const book = async (slot) => {
  const token = localStorage.getItem("token");

  try {
    await api.post(
      "/bookings/create",
      {
        serviceId,
        date,
        startTime: slot.startTime,
        endTime: slot.endTime
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    alert("🎉 Booking Successful!");
    fetchSlots();
  } catch (err) {
    console.log(err);
    alert("Booking failed");
  }
};

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen text-slate-800">
      <UserSidebar />

      <div className="ml-64 w-full relative">
        {/* --- DARK HEADER --- */}
        <div className="bg-[#0f172a] p-10 pb-32">
          <header className="max-w-5xl mx-auto flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-emerald-400" />
                <p className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">Step 2: Timing</p>
              </div>
              <h1 className="text-5xl font-black text-white tracking-tight">
                Select <span className="text-emerald-400">Slot</span>
              </h1>
            </div>

            {/* DATE PICKER GLASS UI */}
            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-3xl border border-white/10 backdrop-blur-md">
              <input
                type="date"
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent text-white font-mono font-bold p-3 outline-none cursor-pointer [color-scheme:dark]"
              />
              <button
                onClick={fetchSlots}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                Find Slots
              </button>
            </div>
          </header>
        </div>

        {/* --- SLOTS GRID AREA --- */}
        <div className="px-10 -mt-20 max-w-5xl mx-auto pb-20 relative z-10">
          
          <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-10">
            
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
               <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                  <Calendar size={24} />
               </div>
               <div>
                  <h3 className="font-black text-slate-900 text-xl tracking-tight">Available Windows</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
                    {date ? new Date(date).toDateString() : "Please select a date above"}
                  </p>
               </div>
            </div>

            {/* SLOTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {segments.length > 0 ? (
                segments.map((seg) => {
                  const available = seg.available;
                  const isFull = seg.isFull;

                  return (
                    <button
                      key={seg._id}
                      disabled={isFull}
                      onClick={() => book({
                                      startTime: seg.startTime,
                                      endTime: seg.endTime
                                    })
                              }
                      className={`group relative p-6 rounded-[2rem] border-2 transition-all duration-300 text-left overflow-hidden
                        ${isFull 
                          ? "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed" 
                          : "bg-white border-slate-100 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-100 hover:-translate-y-1"
                        }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-xl ${isFull ? 'bg-slate-200 text-slate-400' : 'bg-emerald-50 text-emerald-600'}`}>
                          <Clock size={18} />
                        </div>
                        {isFull ? (
                          <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-200 px-2 py-1 rounded-md">Sold Out</span>
                        ) : (
                          <div className="flex items-center gap-1 text-emerald-500">
                             <span className="text-[10px] font-black uppercase tracking-tighter italic">{available} Tokens Left</span>
                          </div>
                        )}
                      </div>

                      <h4 className={`text-xl font-black tracking-tight mb-1 ${isFull ? 'text-slate-400' : 'text-slate-900'}`}>
                        {seg.startTime} — {seg.endTime}
                      </h4>
                      
                      <div className="flex items-center justify-between mt-6">
                        <p className={`text-[9px] font-black uppercase tracking-widest ${isFull ? 'text-slate-300' : 'text-slate-400'}`}>
                          {isFull ? 'Booking Closed' : 'Instant Confirmation'}
                        </p>
                        {!isFull && <ChevronRight size={16} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />}
                      </div>

                      {/* Hover Slide Effect */}
                      {!isFull && (
                        <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 w-0 group-hover:w-full transition-all duration-500"></div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                  <AlertCircle size={48} className="text-slate-200 mb-4" />
                  <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-sm">
                    {loading ? "Scanning for availability..." : "No slots found for this date"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* BOOKING INFO FOOTER */}
          <div className="mt-8 flex items-center gap-6 px-10">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Available</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Capacity</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}