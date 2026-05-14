import { useState, useEffect } from "react";
import api from "../../utils/api";
import UserSidebar from "../../components/UserSidebar";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Clock, 
  Zap, 
  ArrowRight, 
  Search, 
  Bell,
  User as UserIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [activeCount, setActiveCount] = useState(0);
  // Local storage se data nikalna
  const userName = localStorage.getItem("userName") || "User";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRecentData();
  }, []);

  const fetchRecentData = async () => {
    try {
      const res = await api.get("/bookings/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allBookings = res.data;
      setRecentBookings(allBookings.slice(0, 3)); // UI ke liye sirf top 3 bookings dashboard par dikhayenge
      setActiveCount(
        allBookings.filter(b =>
        b.status !== "completed" &&
        b.status !== "cancelled" &&
        b.status !== "absent").length);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans">
      {/* Sidebar Component */}
      <UserSidebar />

      <div className="ml-64 w-full relative">
        
        {/* --- DARK HEADER SECTION --- */}
        <div className="bg-[#0f172a] p-10 pb-40 relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

          <header className="max-w-6xl mx-auto flex justify-between items-center relative z-10 text-white">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <p className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">System Online</p>
              </div>
              <h1 className="text-5xl font-black tracking-tight leading-none">
                Hello, <span className="text-emerald-400">{userName.split(' ')[0]}</span>
              </h1>
              <p className="text-slate-400 mt-2 font-medium italic opacity-80">What are we booking today?</p>
            </div>
            
            <div className="flex items-center gap-4">
               <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-emerald-400 transition-all">
                  <Bell size={22} />
               </button>
               <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                  <span className="text-xl font-black uppercase">{userName.charAt(0)}</span>
               </div>
            </div>
          </header>
        </div>

        {/* --- MAIN CONTENT (Negative Margin Grid) --- */}
        <div className="px-10 -mt-24 max-w-6xl mx-auto pb-20 relative z-20">
          
          {/* QUICK ACTION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <QuickCard 
              title="Explore Services" 
              desc="Browse categories" 
              icon={<Search size={24}/>} 
              color="emerald" 
              onClick={() => navigate("/services")}
            />
            <QuickCard 
              title="My Bookings" 
              desc="Check schedules" 
              icon={<CalendarCheck size={24}/>} 
              color="cyan" 
              onClick={() => navigate("/my-bookings")}
            />
            <QuickCard 
              title="Quick Status" 
              desc={`${activeCount} Active Tokens`}
              icon={<Zap size={24}/>} 
              color="orange" 
              onClick={() => navigate("/my-bookings")}
            />
          </div>

          {/* RECENT ACTIVITY SECTION */}
          <div className="bg-white rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Timeline updates</p>
              </div>
              <button 
                onClick={() => navigate("/my-bookings")}
                className="group flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50/50 px-5 py-2.5 rounded-xl border border-emerald-100 hover:bg-emerald-50 transition-all"
              >
                View Full Ledger <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="p-6">
              {recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.map((b) => (
                    <div key={b._id} className="flex items-center justify-between p-6 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-slate-900 text-emerald-400 rounded-2xl flex flex-col items-center justify-center font-mono font-black shadow-xl group-hover:scale-105 transition-transform">
                          <span className="text-[8px] opacity-50 uppercase tracking-tighter">Token</span>
                          <span className="text-xl -mt-1">{b.tokenNumber || "—"}</span>
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-xl leading-none mb-1">{b.serviceId?.name}</h4>
                          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-tight italic">
                            <UserIcon size={12} className="text-emerald-500" />
                            <span>{b.serviceId?.spId?.name || "Independent Provider"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-12 text-right">
                        <div>
                           <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Timing Window</p>
                           <p className="text-sm font-black text-slate-600 font-mono italic">{b.segmentId?.startTime}</p>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center flex flex-col items-center opacity-30">
                  <Clock size={48} className="text-slate-200 mb-4" />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No recent bookings found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function QuickCard({ title, desc, icon, color, onClick }) {
  const themes = {
    emerald: "bg-emerald-500 shadow-emerald-200 hover:bg-emerald-600",
    cyan: "bg-cyan-500 shadow-cyan-200 hover:bg-cyan-600",
    orange: "bg-orange-500 shadow-orange-200 hover:bg-orange-600"
  };

  return (
    <button 
      onClick={onClick}
      className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:-translate-y-2 transition-all text-left relative overflow-hidden h-full"
    >
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 text-white transition-all group-hover:rotate-12 duration-500 shadow-lg ${themes[color]}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">{title}</h3>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{desc}</p>
      
      <div className="absolute bottom-8 right-8 text-slate-100 group-hover:text-emerald-500/20 transition-colors">
        <ArrowRight size={32} />
      </div>
    </button>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Cancelled: "bg-red-50 text-red-600 border-red-100",
    Confirmed: "bg-cyan-50 text-cyan-600 border-cyan-100",
    default: "bg-orange-50 text-orange-600 border-orange-100",
  };
  const style = styles[status] || styles.default;
  return (
    <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 min-w-[110px] text-center shadow-sm ${style}`}>
      {status}
    </div>
  );
}