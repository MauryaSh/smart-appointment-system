import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Briefcase, Clock, 
  CalendarCheck, MessageSquare, Star, 
  ChevronRight 
} from "lucide-react";
import { CalendarDays } from "lucide-react";

export default function SPSidebar() {
  const location = useLocation();
  const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("userId")
  localStorage.removeItem("selectedService")

  window.location.href = "/login"
}
  // 1. DYNAMIC DATA: LocalStorage se provider ka naam fetch karna
  // Agar naam nahi milta toh default "Service Provider" dikhayega
  const spName = localStorage.getItem("userName") || "Service Provider";
  
  // Name ka pehla letter nikalna profile icon ke liye
  const initial = spName.charAt(0).toUpperCase();

  const linkClass = (path) =>
    `group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 mb-2 ${
      location.pathname === path
        ? "bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)] backdrop-blur-md"
        : "text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-300"
    }`;

  return (
    <div className="w-64 h-screen bg-[#0a1a15] border-r border-emerald-900/30 fixed left-0 top-0 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-50">
      
      {/* SHINING HEADER */}
      <div className="p-8 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full"></div>
        <h2 className="text-2xl font-black tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-200 to-emerald-500">
          SMART<span className="font-light text-slate-300">BOOK</span>
        </h2>
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-700 mt-1">
          SP Control Panel
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        <SidebarLink to="/sp/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={location.pathname === "/sp/dashboard"} linkClass={linkClass} />
        <SidebarLink to="/sp/services" icon={<Briefcase size={20} />} label="Services" active={location.pathname === "/sp/services"} linkClass={linkClass} />
        <SidebarLink to="/sp/shifts" icon={<Clock size={20} />} label="Shifts" active={location.pathname === "/sp/shifts"} linkClass={linkClass} />
        <SidebarLink to="/sp/bookings" icon={<CalendarCheck size={20} />} label="Bookings" active={location.pathname === "/sp/bookings"} linkClass={linkClass} />
        <SidebarLink to="/sp/complaints" icon={<MessageSquare size={20} />} label="Complaints" active={location.pathname === "/sp/complaints"} linkClass={linkClass} />
        <SidebarLink to="/sp/ratings" icon={<Star size={20} />} label="Ratings" active={location.pathname === "/sp/ratings"} linkClass={linkClass} />
        <SidebarLink to="/sp/routine" icon={<CalendarDays size={20} />} label="Routine" active={location.pathname === "/sp/routine"} linkClass={linkClass} />
      </nav>


      {/* DEFAULT DYNAMIC PROFILE FOOTER */}
      <div className="p-4 mt-auto border-t border-emerald-900/30 bg-emerald-900/5 backdrop-blur-sm">
        <Link 
          to="/sp/profile" 
          className="flex items-center gap-3 p-3 rounded-2xl border border-transparent hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
        >
          <div className="relative">
            {/* Dynamic Initial Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-green-300 flex items-center justify-center text-emerald-950 font-black shadow-[0_0_10px_rgba(110,231,183,0.5)]">
              {initial}
            </div>
            {/* Active Glow Dot */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#0a1a15] rounded-full shadow-[0_0_5px_#34d399]"></div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-emerald-50 truncate">{spName}</p>
            <p className="text-[9px] text-emerald-500/70 font-black uppercase tracking-tighter">View Profile</p>
          </div>
          <ChevronRight size={14} className="text-emerald-700 group-hover:translate-x-1 transition-transform" />
        </Link>
          <button
    onClick={logout}
    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500/20 border border-red-400/30 text-red-400 hover:bg-red-500/30 transition-all text-sm font-semibold"
  >
    Logout
  </button>
      </div>
    </div>
  );
}

// Sidebar Link Helper
function SidebarLink({ to, icon, label, active, linkClass }) {
  return (
    <Link to={to} className={linkClass(to)}>
      <div className="flex items-center gap-3">
        <span className={`${active ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "text-emerald-900 group-hover:text-emerald-400"} transition-all`}>
          {icon}
        </span>
        <span className={`text-sm tracking-wide ${active ? "font-bold" : "font-medium"}`}>{label}</span>
      </div>
      {active && <div className="w-1 h-5 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]" />}
    </Link>
  );
}