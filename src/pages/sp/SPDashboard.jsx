import { useState, useEffect } from "react";
import api from "../../utils/api";
import SPSidebar from "../../components/SPSidebar";
import { CheckCircle, XCircle, CalendarDays, ArrowUpRight, Bell, Zap, Clock, Check, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SPDashboard() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const spId = localStorage.getItem("userId");

  useEffect(() => {
    if (!spId) navigate("/login");
    fetchBookings();
  }, [spId]);

  const fetchBookings = async () => {
  try {
    const res = await api.get("/bookings/sp", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setBookings(res.data);
  } catch (err) {
    console.error(err);
  }
};

  const updateStatus = async (id, status) => {
  try {
    await api.put(`/bookings/status/${id}`, 
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchBookings();
  } catch (err) {
    alert("Failed");
  }
};

  const stats = [
    { label: "Total Bookings", value: bookings.length, color: "emerald", icon: <Users size={20}/> },
    { label: "Upcoming", value: bookings.filter(b => ["Pending", "Confirmed"].includes(b.status)).length, color: "orange", icon: <Clock size={20}/> },
    { label: "Completed", value: bookings.filter(b => b.status === "Completed").length, color: "cyan", icon: <Check size={20}/> },
    { label: "Cancelled", value: bookings.filter(b => b.status === "Cancelled").length, color: "red", icon: <XCircle size={20}/> },
  ];

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <SPSidebar />

      <div className="ml-64 w-full relative">
        
        {/* --- DARK HEADER SECTION (As per your screenshot) --- */}
        <div className="bg-[#0f172a] p-10 pb-32"> 
          <header className="flex justify-between items-center max-w-7xl mx-auto">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                 <p className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">System Operational</p>
              </div>
              <h1 className="text-5xl font-black text-white tracking-tight">
                Control <span className="text-emerald-400">Panel</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl text-white/70 hover:text-emerald-400 transition-all cursor-pointer">
                <Bell size={22} />
              </div>
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-3 rounded-3xl border border-white/10 pr-8">
                 <div className="h-12 w-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                    <CalendarDays size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Date</p>
                    <p className="text-sm font-black text-white font-mono">{new Date().toDateString()}</p>
                 </div>
              </div>
            </div>
          </header>
        </div>

        {/* --- MAIN CONTENT AREA (White BG with Negative Margin) --- */}
        <div className="px-10 -mt-20 max-w-7xl mx-auto pb-20">
          
          {/* --- GLASS STATS GRID --- */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, i) => (
              <StatBox key={i} {...stat} />
            ))}
          </div>

          {/* --- TABLE SECTION --- */}
          <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-2xl tracking-tight flex items-center gap-3">
                 <Zap className="text-emerald-500" size={24} /> Recent Appointments
              </h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 px-6 py-3 rounded-2xl transition-all border border-emerald-100">
                 Archive History
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                  <tr>
                    <th className="px-10 py-6">Customer Module</th>
                    <th className="px-10 py-6">Service Type</th>
                    <th className="px-10 py-6 text-center">Identifier / Slot</th>
                    <th className="px-10 py-6">Status</th>
                    <th className="px-10 py-6 text-right pr-14">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.map((b) => (
                    <tr key={b._id} className="group hover:bg-slate-50 transition-all duration-300">
                      <td className="px-10 py-7 font-black text-slate-800">{b.customerName}</td>
                      <td className="px-10 py-7 font-bold text-slate-500">{b.serviceName}</td>
                      <td className="px-10 py-7 text-center">
                        <span className="px-4 py-2 bg-slate-900 text-emerald-400 rounded-xl font-mono font-black text-xs">
                          {b.tokenNumber || b.slotTime}
                        </span>
                      </td>
                      <td className="px-10 py-7">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="px-10 py-7 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => updateStatus(b._id, "Completed")} className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                             <Check size={18} />
                          </button>
                          <button onClick={() => updateStatus(b._id, "Cancelled")} className="h-10 w-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                             <XCircle size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- GLASSMORPHIC STATBOX ---
function StatBox({ label, value, color, icon }) {
  const themes = {
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    orange: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    cyan: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
    red: "text-red-500 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className="group relative">
      {/* Card Body with Glass Effect */}
      <div className="relative bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden">
        
        {/* Glass Reflection Streak */}
        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[35deg] group-hover:left-[130%] transition-all duration-[1000ms]"></div>

        <div className="flex justify-between items-center mb-8">
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border-2 transition-transform group-hover:scale-110 ${themes[color]}`}>
            {icon}
          </div>
          <ArrowUpRight size={18} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
        </div>

        <h2 className="text-5xl font-[1000] text-slate-900 tracking-tighter mb-1 leading-none font-mono">
           {value < 10 ? `0${value}` : value}
        </h2>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Cancelled: "bg-red-50 text-red-600 border-red-100",
    default: "bg-orange-50 text-orange-600 border-orange-100 animate-pulse",
  };
  const style = styles[status] || styles.default;
  return (
    <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${style}`}>
      {status}
    </span>
  );
}